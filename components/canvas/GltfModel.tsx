"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import type { GltfModelSource } from "@/types/scene";

interface GltfModelProps {
  source: GltfModelSource;
  /** Clip name to play. Falls back to the source's idleClip, then does nothing. */
  activeClip?: string | null;
  /** Whether the active clip should loop (true) or play once and hold (false). */
  loop?: boolean;
}

function GltfModelInner({ source, activeClip, loop = true }: GltfModelProps) {
  const { scene, animations } = useGLTF(source.url);
  // useGLTF caches and reuses the same loaded scene graph across every
  // instance of this URL. Skeleton-aware cloning (rather than reusing the
  // shared object or a naive .clone()) lets multiple copies of the same
  // animated asset exist in the scene independently, each with its own
  // skinned mesh bindings and animation mixer.
  const clonedSceneObject = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const clonedScene = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, clonedScene);

  const clipName = activeClip ?? source.idleClip ?? null;

  useEffect(() => {
    if (!clipName) return;
    const action = actions[clipName];
    if (!action) return;
    // THREE.AnimationAction is a mutable, stateful controller object (there's
    // no immutable API for configuring loop/clamp on it) — this is the
    // standard three.js pattern for driving a clip, not incidental mutation.
    // eslint-disable-next-line react-hooks/immutability
    action.clampWhenFinished = !loop;
    action.reset().setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity).fadeIn(0.2).play();
    return () => {
      action.fadeOut(0.15);
    };
  }, [actions, clipName, loop]);

  return (
    <group ref={clonedScene} scale={source.fitScale}>
      <primitive object={clonedSceneObject} />
    </group>
  );
}

/**
 * Loads and renders a real glTF/GLB asset, optionally driving one of its
 * baked animation clips. Wrapped in Suspense with a lightweight placeholder
 * so a slow network fetch doesn't block the rest of the scene from rendering.
 */
export function GltfModel(props: GltfModelProps) {
  return (
    <Suspense fallback={<PlaceholderBox />}>
      <GltfModelInner {...props} />
    </Suspense>
  );
}

function PlaceholderBox() {
  return (
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[0.5, 0.8, 0.5]} />
      <meshStandardMaterial color="#c7b9f0" wireframe />
    </mesh>
  );
}
