import type { SceneObjectState, Vector3Tuple } from "@/types/scene";
import type { BlockNode } from "./types";

type ApplyTransform = (patch: Partial<Pick<SceneObjectState, "position" | "rotation" | "scale">>) => void;
type GetLive = () => SceneObjectState;
/** Looks up any object in the scene by id (used by character blocks that reference another object). */
type GetObjectById = (id: string) => SceneObjectState | undefined;
/**
 * Requests that a named baked animation clip play, resolving when it's done
 * (or immediately if the object has no such clip / no glTF source at all —
 * in that case the caller should fall back to a procedural animation).
 * `durationMs` is provided for procedural fallbacks that don't know a clip's
 * natural length.
 */
type PlayClip = (clipName: string, loop: boolean, durationMs: number) => Promise<boolean>;
/** Shows a speech bubble with the given text for durationMs, resolving when it's cleared. */
type ShowSpeech = (text: string, durationMs: number) => Promise<void>;
/** Shows a brief expression emoji cue above the object for a short duration. */
type ShowExpression = (emoji: string, durationMs: number) => Promise<void>;

export interface RunningScript {
  triggerClick: () => void;
  dispose: () => void;
}

export interface PhysicsSettings {
  gravityEnabled: boolean;
  bounciness: number;
}

const GRAVITY_ACCEL = 9.8; // m/s^2, scaled for a readable in-scene fall speed
const MIN_BOUNCE_VELOCITY = 0.4; // below this, treat the bounce as settled

/**
 * Runs a continuous gravity/bounce simulation for a single object while
 * `settings.gravityEnabled` is true. This is intentionally a simple
 * per-object vertical integrator (no rigid-body engine): it decrements Y
 * velocity each frame, stops at the ground plane, and applies a decaying
 * bounce scaled by `bounciness`. `getGroundY` allows resting on top of other
 * physics objects (simple AABB-free "is there something below me" check)
 * rather than always falling to the world floor.
 */
export function runPhysicsSimulation(
  getSettings: () => PhysicsSettings,
  getLive: GetLive,
  applyTransform: ApplyTransform,
  getRestingSurfaceY: () => number
): { dispose: () => void } {
  let cancelled = false;
  let velocityY = 0;
  let rafId = 0;

  const tick = () => {
    if (cancelled) return;
    const settings = getSettings();
    if (!settings.gravityEnabled) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    const dt = 1 / 60;
    const live = getLive();
    const restY = getRestingSurfaceY();
    velocityY -= GRAVITY_ACCEL * dt;
    let nextY = live.position[1] + velocityY * dt;

    if (nextY <= restY) {
      nextY = restY;
      if (Math.abs(velocityY) > MIN_BOUNCE_VELOCITY && settings.bounciness > 0) {
        velocityY = -velocityY * settings.bounciness;
      } else {
        velocityY = 0;
      }
    }

    applyTransform({ position: [live.position[0], nextY, live.position[2]] });
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return {
    dispose: () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    },
  };
}

const TWEEN_DURATION_MS = 500;

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function addAxis(vec: Vector3Tuple, axis: string, delta: number): Vector3Tuple {
  const index = axis === "x" ? 0 : axis === "y" ? 1 : 2;
  const next: Vector3Tuple = [...vec];
  next[index] += delta;
  return next;
}

/**
 * Runs a single scene object's block script tree. Each top-level `event.onClick`
 * block registers its children as the action sequence executed when `triggerClick`
 * fires. Timers/RAF handles are tracked in a disposer bag so `dispose()` can cancel
 * everything cleanly when Play Mode ends.
 */
export function runObjectScript(
  topLevelBlocks: BlockNode[],
  getLive: GetLive,
  applyTransform: ApplyTransform,
  playClip?: PlayClip,
  showSpeech?: ShowSpeech,
  onPhysicsSettings?: (settings: PhysicsSettings) => void,
  getObjectById?: GetObjectById,
  showExpression?: ShowExpression,
  setOutfitColor?: (color: string) => void
): RunningScript {
  const disposers = new Set<() => void>();
  let cancelled = false;

  function trackTimeout(fn: () => void, ms: number) {
    const handle = setTimeout(() => {
      disposers.delete(dispose);
      if (!cancelled) fn();
    }, ms);
    const dispose = () => clearTimeout(handle);
    disposers.add(dispose);
  }

  function trackRaf(step: (elapsed: number) => boolean) {
    const start = performance.now();
    let rafId = 0;
    const dispose = () => cancelAnimationFrame(rafId);
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const shouldContinue = step(elapsed);
      if (shouldContinue && !cancelled) {
        rafId = requestAnimationFrame(tick);
      } else {
        disposers.delete(dispose);
      }
    };
    disposers.add(dispose);
    rafId = requestAnimationFrame(tick);
  }

  async function runSequence(blocks: BlockNode[], signal: { stopped: boolean }): Promise<void> {
    for (const block of blocks) {
      if (cancelled || signal.stopped) return;
      await runBlock(block, signal);
    }
  }

  function runBlock(block: BlockNode, signal: { stopped: boolean }): Promise<void> {
    switch (block.type) {
      case "action.moveBy":
        return new Promise((resolve) => {
          const axis = String(block.params.axis ?? "x");
          const distance = Number(block.params.distance ?? 0);
          const from = getLive().position;
          const to = addAxis(from, axis, distance);
          trackRaf((elapsed) => {
            const t = Math.min(elapsed / TWEEN_DURATION_MS, 1);
            const eased = easeInOutQuad(t);
            const current: Vector3Tuple = [
              from[0] + (to[0] - from[0]) * eased,
              from[1] + (to[1] - from[1]) * eased,
              from[2] + (to[2] - from[2]) * eased,
            ];
            applyTransform({ position: current });
            if (t >= 1) {
              resolve();
              return false;
            }
            return true;
          });
        });
      case "action.rotate":
        return new Promise((resolve) => {
          const axis = String(block.params.axis ?? "y");
          const degrees = Number(block.params.degrees ?? 0);
          const radians = (degrees * Math.PI) / 180;
          const from = getLive().rotation;
          const to = addAxis(from, axis, radians);
          trackRaf((elapsed) => {
            const t = Math.min(elapsed / TWEEN_DURATION_MS, 1);
            const eased = easeInOutQuad(t);
            const current: Vector3Tuple = [
              from[0] + (to[0] - from[0]) * eased,
              from[1] + (to[1] - from[1]) * eased,
              from[2] + (to[2] - from[2]) * eased,
            ];
            applyTransform({ rotation: current });
            if (t >= 1) {
              resolve();
              return false;
            }
            return true;
          });
        });
      case "action.playAnimation":
        return (async () => {
          const animation = String(block.params.animation ?? "bounce");
          // If the object exposes a real baked clip with this exact name (e.g.
          // "Walk"/"Run"/"Anim_0" on a glTF asset), play that instead of the
          // procedural fallback so real assets use their authored animation.
          if (playClip) {
            const playedRealClip = await playClip(animation, false, 700);
            if (playedRealClip) return;
          }
          await new Promise<void>((resolve) => {
            const from = getLive();
            const baseScale = from.scale;
            const basePos = from.position;
            trackRaf((elapsed) => {
              const t = Math.min(elapsed / 600, 1);
              const wave = Math.sin(t * Math.PI);
              if (animation === "spin") {
                applyTransform({ rotation: [0, wave * Math.PI * 2, 0] });
              } else if (animation === "pulse") {
                const s = 1 + wave * 0.25;
                applyTransform({ scale: [baseScale[0] * s, baseScale[1] * s, baseScale[2] * s] });
              } else {
                applyTransform({ position: [basePos[0], basePos[1] + wave * 0.4, basePos[2]] });
              }
              if (t >= 1) {
                if (animation === "pulse") applyTransform({ scale: baseScale });
                else if (animation !== "spin") applyTransform({ position: basePos });
                resolve();
                return false;
              }
              return true;
            });
          });
        })();
      case "character.walkTo":
        return (async () => {
          const targetId = String(block.params.targetId ?? "");
          const speed = Math.max(0.1, Number(block.params.speed ?? 1));
          const target = getObjectById?.(targetId);
          if (!target) return;

          const from = getLive().position;
          const to: Vector3Tuple = [target.position[0], from[1], target.position[2]];
          const distance = Math.hypot(to[0] - from[0], to[2] - from[2]);
          if (distance < 0.01) return;
          const durationMs = (distance / speed) * 1000;

          // Face the walk direction, then play a real "Walk" clip if the
          // asset has one, otherwise just tween position.
          const facingAngle = Math.atan2(to[0] - from[0], to[2] - from[2]);
          applyTransform({ rotation: [0, facingAngle, 0] });
          if (playClip) void playClip("Walk", true, durationMs);

          await new Promise<void>((resolve) => {
            trackRaf((elapsed) => {
              const t = Math.min(elapsed / durationMs, 1);
              const current: Vector3Tuple = [
                from[0] + (to[0] - from[0]) * t,
                from[1],
                from[2] + (to[2] - from[2]) * t,
              ];
              applyTransform({ position: current });
              if (t >= 1) {
                resolve();
                return false;
              }
              return true;
            });
          });
        })();
      case "character.faceTarget":
        return new Promise((resolve) => {
          const targetId = String(block.params.targetId ?? "");
          const target = getObjectById?.(targetId);
          if (!target) {
            resolve();
            return;
          }
          const from = getLive();
          const dx = target.position[0] - from.position[0];
          const dz = target.position[2] - from.position[2];
          const targetAngle = Math.atan2(dx, dz);
          const fromAngle = from.rotation[1];
          // Take the shortest angular path so the character doesn't spin the long way around.
          let delta = targetAngle - fromAngle;
          delta = Math.atan2(Math.sin(delta), Math.cos(delta));
          trackRaf((elapsed) => {
            const t = Math.min(elapsed / TWEEN_DURATION_MS, 1);
            const eased = easeInOutQuad(t);
            applyTransform({ rotation: [from.rotation[0], fromAngle + delta * eased, from.rotation[2]] });
            if (t >= 1) {
              resolve();
              return false;
            }
            return true;
          });
        });
      case "character.greet":
        return new Promise((resolve) => {
          const from = getLive();
          const baseRotation = from.rotation;
          trackRaf((elapsed) => {
            const t = Math.min(elapsed / 800, 1);
            const wave = Math.sin(t * Math.PI * 3) * (1 - t);
            applyTransform({
              rotation: [baseRotation[0], baseRotation[1], baseRotation[2] + wave * 0.35],
            });
            if (t >= 1) {
              applyTransform({ rotation: baseRotation });
              resolve();
              return false;
            }
            return true;
          });
        });
      case "character.setExpression":
        return (async () => {
          const expression = String(block.params.expression ?? "happy");
          const emojiMap: Record<string, string> = {
            happy: "😊",
            sad: "😢",
            surprised: "😲",
            angry: "😠",
          };
          const emoji = emojiMap[expression] ?? "😊";
          if (showExpression) {
            await showExpression(emoji, 1200);
          } else {
            await new Promise<void>((resolve) => trackTimeout(resolve, 1200));
          }
        })();
      case "character.changeOutfitColor":
        return new Promise((resolve) => {
          const color = String(block.params.color ?? "#8b5cf6");
          setOutfitColor?.(color);
          resolve();
        });
      case "speech.say":
        return (async () => {
          const text = String(block.params.text ?? "");
          const seconds = Number(block.params.seconds ?? 2);
          if (showSpeech) {
            await showSpeech(text, Math.max(0, seconds * 1000));
          } else {
            await new Promise<void>((resolve) => trackTimeout(resolve, Math.max(0, seconds * 1000)));
          }
        })();
      case "control.wait":
        return new Promise((resolve) => {
          const seconds = Number(block.params.seconds ?? 0);
          trackTimeout(resolve, Math.max(0, seconds * 1000));
        });
      case "control.loop":
        return (async () => {
          const times = Number(block.params.times ?? 0);
          const infinite = times <= 0;
          let i = 0;
          while (!cancelled && !signal.stopped && (infinite || i < times)) {
            await runSequence(block.children, signal);
            i += 1;
          }
        })();
      default:
        return Promise.resolve();
    }
  }

  const eventBlocks = topLevelBlocks.filter((b) => b.type === "event.onClick");

  // Physics blocks configure a persistent simulation rather than firing on
  // click — collect the last-configured gravity/bounciness values from
  // anywhere in the script (top level or nested) and apply them once so the
  // separate `runPhysicsSimulation` loop (driven from SceneObject) picks
  // them up immediately when Play Mode starts.
  function collectPhysicsSettings(blocks: BlockNode[], settings: PhysicsSettings) {
    for (const b of blocks) {
      if (b.type === "physics.enableGravity") settings.gravityEnabled = b.params.enabled === "on";
      if (b.type === "physics.setBounciness") settings.bounciness = Number(b.params.value ?? 0);
      if (b.children.length > 0) collectPhysicsSettings(b.children, settings);
    }
  }
  if (onPhysicsSettings) {
    const settings: PhysicsSettings = { gravityEnabled: false, bounciness: 0 };
    collectPhysicsSettings(topLevelBlocks, settings);
    onPhysicsSettings(settings);
  }

  function triggerClick() {
    if (cancelled) return;
    const signal = { stopped: false };
    for (const event of eventBlocks) {
      void runSequence(event.children, signal);
    }
  }

  function dispose() {
    cancelled = true;
    for (const d of Array.from(disposers)) d();
    disposers.clear();
  }

  return { triggerClick, dispose };
}
