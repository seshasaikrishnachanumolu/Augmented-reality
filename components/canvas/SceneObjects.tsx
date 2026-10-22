"use client";

import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";
import { useEditorStore } from "@/lib/store/editorStore";
import { SceneObject } from "./SceneObject";
import { TransformGizmo } from "./TransformGizmo";
import type { SceneObjectState, Vector3Tuple } from "@/types/scene";

interface SceneObjectsProps {
  onGizmoDraggingChange: (dragging: boolean) => void;
}

/**
 * Resolves each object's world-space position, following parent chains for
 * attached objects (a child's `position` is treated as a local offset from
 * its parent once `parentId` is set). Guards against cycles defensively.
 */
function resolveWorldPositions(objects: SceneObjectState[]): Map<string, Vector3Tuple> {
  const byId = new Map(objects.map((o) => [o.id, o]));
  const resolved = new Map<string, Vector3Tuple>();

  function resolve(id: string, depth = 0): Vector3Tuple {
    const cached = resolved.get(id);
    if (cached) return cached;
    const obj = byId.get(id);
    if (!obj) return [0, 0, 0];
    if (!obj.parentId || depth > 8) {
      resolved.set(id, obj.position);
      return obj.position;
    }
    const parentPos = resolve(obj.parentId, depth + 1);
    const world: Vector3Tuple = [
      parentPos[0] + obj.position[0],
      parentPos[1] + obj.position[1],
      parentPos[2] + obj.position[2],
    ];
    resolved.set(id, world);
    return world;
  }

  for (const obj of objects) resolve(obj.id);
  return resolved;
}

export function SceneObjects({ onGizmoDraggingChange }: SceneObjectsProps) {
  const objects = useEditorStore((s) => s.objects);
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);
  const openContextMenu = useEditorStore((s) => s.openContextMenu);
  const mode = useEditorStore((s) => s.mode);
  const transformTool = useEditorStore((s) => s.transformTool);
  const attachPickingForId = useEditorStore((s) => s.attachPickingForId);
  const attachObjectTo = useEditorStore((s) => s.attachObjectTo);

  const [refMap, setRefMap] = useState<Map<string, THREE.Object3D>>(() => new Map());

  const registerRef = useCallback((id: string, obj: THREE.Object3D | null) => {
    setRefMap((prev) => {
      const next = new Map(prev);
      if (obj) {
        next.set(id, obj);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const worldPositions = useMemo(() => resolveWorldPositions(objects), [objects]);

  const selectedTarget = selectedId ? refMap.get(selectedId) : undefined;

  const handleSelect = (id: string) => {
    if (attachPickingForId) {
      if (id !== attachPickingForId) attachObjectTo(attachPickingForId, id);
      return;
    }
    select(id);
  };

  return (
    <>
      {objects.map((object) => (
        <SceneObject
          key={object.id}
          object={object}
          worldPosition={worldPositions.get(object.id) ?? object.position}
          isSelected={object.id === selectedId}
          isAttachTarget={attachPickingForId !== null && attachPickingForId !== object.id}
          mode={mode}
          onSelect={handleSelect}
          onContextMenu={openContextMenu}
          registerRef={registerRef}
        />
      ))}
      {mode === "edit" && selectedId && selectedTarget && !attachPickingForId && (
        <TransformGizmo
          target={selectedTarget}
          objectId={selectedId}
          tool={transformTool}
          onDraggingChange={onGizmoDraggingChange}
        />
      )}
    </>
  );
}
