"use client";

import * as THREE from "three";
import { TransformControls } from "@react-three/drei";
import { useEditorStore } from "@/lib/store/editorStore";
import type { TransformTool } from "@/types/scene";

interface TransformGizmoProps {
  target: THREE.Object3D;
  objectId: string;
  tool: TransformTool;
  onDraggingChange: (dragging: boolean) => void;
}

export function TransformGizmo({ target, objectId, tool, onDraggingChange }: TransformGizmoProps) {
  const updateObject = useEditorStore((s) => s.updateObject);

  const handleChange = () => {
    if (!target) return;
    // Our scene "groups" are flat siblings in the actual Three.js graph — we
    // fake logical parenting via app state, not real Object3D nesting. So
    // when this object is attached to a parent, the gizmo's world-space
    // readout has to be converted back to a parent-relative offset before
    // it's written to state (which stores local offsets for attached objects).
    const { objects } = useEditorStore.getState();
    const self = objects.find((o) => o.id === objectId);
    const parent = self?.parentId ? objects.find((o) => o.id === self.parentId) : null;

    const worldPos = target.position;
    const localPos: [number, number, number] = parent
      ? [worldPos.x - parent.position[0], worldPos.y - parent.position[1], worldPos.z - parent.position[2]]
      : [worldPos.x, worldPos.y, worldPos.z];

    updateObject(objectId, {
      position: localPos,
      rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
      scale: [target.scale.x, target.scale.y, target.scale.z],
    });
  };

  return (
    <TransformControls
      object={target}
      mode={tool}
      onObjectChange={handleChange}
      onMouseDown={() => onDraggingChange(true)}
      onMouseUp={() => onDraggingChange(false)}
      size={0.85}
    />
  );
}
