"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useEditorStore } from "@/lib/store/editorStore";
import { ObjectModel } from "./ObjectModel";
import { SelectionToolbar } from "./SelectionToolbar";
import { AnimationQuickPanel } from "./AnimationQuickPanel";
import { MaterialQuickPanel } from "./MaterialQuickPanel";
import { SpeechBubble } from "./SpeechBubble";
import { ExpressionBubble } from "./ExpressionBubble";
import { getAssetDefinition } from "@/lib/assetLibrary";
import {
  runObjectScript,
  runPhysicsSimulation,
  type PhysicsSettings,
  type RunningScript,
} from "@/lib/interpreter/runner";
import type { SceneObjectState } from "@/types/scene";

interface SceneObjectProps {
  object: SceneObjectState;
  worldPosition: [number, number, number];
  isSelected: boolean;
  isAttachTarget: boolean;
  mode: "edit" | "code" | "play";
  onSelect: (id: string) => void;
  onContextMenu: (id: string, x: number, y: number) => void;
  registerRef: (id: string, obj: THREE.Object3D | null) => void;
}

export function SceneObject({
  object,
  worldPosition,
  isSelected,
  isAttachTarget,
  mode,
  onSelect,
  onContextMenu,
  registerRef,
}: SceneObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scripts = useEditorStore((s) => s.scripts);
  const updateObject = useEditorStore((s) => s.updateObject);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const runningRef = useRef<RunningScript | null>(null);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [speech, setSpeech] = useState<string | null>(null);
  const [expression, setExpression] = useState<string | null>(null);
  const physicsSettingsRef = useRef<PhysicsSettings>({ gravityEnabled: false, bounciness: 0 });

  const assetDef = getAssetDefinition(object.modelType);
  const availableClips = assetDef?.source.kind === "gltf" ? assetDef.source.clips ?? [] : [];

  useEffect(() => {
    registerRef(object.id, groupRef.current);
    return () => registerRef(object.id, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object.id]);

  // Wire up interpreter execution while in Play Mode.
  useEffect(() => {
    if (!isPlaying) return;
    const blocks = scripts[object.id];
    if (!blocks || blocks.length === 0) return;

    const running = runObjectScript(
      blocks,
      () => useEditorStore.getState().objects.find((o) => o.id === object.id) ?? object,
      (patch) => updateObject(object.id, patch),
      (clipName, _loop, durationMs) => {
        if (!availableClips.includes(clipName)) return Promise.resolve(false);
        setActiveClip(clipName);
        return new Promise((resolve) => {
          setTimeout(() => {
            setActiveClip(null);
            resolve(true);
          }, durationMs);
        });
      },
      (text, durationMs) => {
        setSpeech(text);
        return new Promise((resolve) => {
          setTimeout(() => {
            setSpeech(null);
            resolve();
          }, durationMs);
        });
      },
      (settings) => {
        physicsSettingsRef.current = settings;
      },
      (id) => useEditorStore.getState().objects.find((o) => o.id === id),
      (emoji, durationMs) => {
        setExpression(emoji);
        return new Promise((resolve) => {
          setTimeout(() => {
            setExpression(null);
            resolve();
          }, durationMs);
        });
      },
      (color) => updateObject(object.id, { color })
    );
    runningRef.current = running;
    return () => {
      running.dispose();
      runningRef.current = null;
      setActiveClip(null);
      setSpeech(null);
      setExpression(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, object.id]);

  // Continuous gravity/bounce simulation, independent of the click-triggered
  // action sequence above — physics settings are configured once when the
  // script starts (see onPhysicsSettings) but the fall itself runs every
  // frame regardless of clicks.
  useEffect(() => {
    if (!isPlaying) return;
    const simulation = runPhysicsSimulation(
      () => physicsSettingsRef.current,
      () => useEditorStore.getState().objects.find((o) => o.id === object.id) ?? object,
      (patch) => updateObject(object.id, patch),
      () => {
        // Rest on top of the highest physics-enabled object directly below
        // (simple XZ-radius overlap check), otherwise rest on the ground.
        const live = useEditorStore.getState().objects.find((o) => o.id === object.id);
        if (!live) return 0;
        let restY = 0;
        for (const other of useEditorStore.getState().objects) {
          if (other.id === object.id || !other.gravityEnabled) continue;
          const dx = other.position[0] - live.position[0];
          const dz = other.position[2] - live.position[2];
          const withinFootprint = Math.sqrt(dx * dx + dz * dz) < 0.6;
          if (withinFootprint && other.position[1] >= restY) {
            restY = other.position[1] + 1; // stack on top with a 1-unit gap
          }
        }
        return restY;
      }
    );
    return () => simulation.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, object.id]);

  const activeQuickPanel = useEditorStore((s) => s.activeQuickPanel);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (mode === "play") {
      runningRef.current?.triggerClick();
      return;
    }
    if (object.locked && !isAttachTarget) return;
    onSelect(object.id);
  };

  const handleContextMenu = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    event.nativeEvent.preventDefault();
    if (object.locked) return;
    onSelect(object.id);
    onContextMenu(object.id, event.nativeEvent.clientX, event.nativeEvent.clientY);
  };

  const showToolbar = isSelected && mode === "edit" && !object.locked;

  return (
    <group
      ref={groupRef}
      position={worldPosition}
      rotation={object.rotation}
      scale={object.scale}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <ObjectModel
        modelType={object.modelType}
        color={object.color}
        activeClip={activeClip ?? undefined}
        loopClip={!activeClip}
      />
      {isSelected && mode !== "play" && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.68, 32]} />
          <meshBasicMaterial color={object.locked ? "#94a3b8" : "#7c3aed"} transparent opacity={0.85} />
        </mesh>
      )}
      {isAttachTarget && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.78, 32]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.6} />
        </mesh>
      )}
      {showToolbar && (
        <>
          <SelectionToolbar objectId={object.id} modelType={object.modelType} yOffset={2.1} />
          {activeQuickPanel === "animation" && (
            <AnimationQuickPanel objectId={object.id} modelType={object.modelType} yOffset={1.55} />
          )}
          {activeQuickPanel === "material" && (
            <MaterialQuickPanel objectId={object.id} modelType={object.modelType} yOffset={1.55} />
          )}
        </>
      )}
      {speech && <SpeechBubble text={speech} yOffset={2.1} />}
      {expression && <ExpressionBubble emoji={expression} yOffset={2.35} />}
    </group>
  );
}
