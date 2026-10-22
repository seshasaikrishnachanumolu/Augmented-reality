"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, Sky } from "@react-three/drei";
import * as THREE from "three";
import { useEditorStore } from "@/lib/store/editorStore";
import { SceneObjects } from "./SceneObjects";
import { CameraRig } from "./CameraRig";
import { ContextMenu } from "./ContextMenu";
import type { ModelType } from "@/types/scene";

const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export function Stage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const addObject = useEditorStore((s) => s.addObject);
  const select = useEditorStore((s) => s.select);
  const setTransformTool = useEditorStore((s) => s.setTransformTool);
  const mode = useEditorStore((s) => s.mode);
  const attachPickingForId = useEditorStore((s) => s.attachPickingForId);
  const cancelAttachPicking = useEditorStore((s) => s.cancelAttachPicking);
  const [isGizmoDragging, setIsGizmoDragging] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && attachPickingForId) {
        cancelAttachPicking();
        return;
      }
      if (mode !== "edit") return;
      if (event.key === "w" || event.key === "W") setTransformTool("translate");
      if (event.key === "e" || event.key === "E") setTransformTool("rotate");
      if (event.key === "r" || event.key === "R") setTransformTool("scale");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, setTransformTool, attachPickingForId, cancelAttachPicking]);

  const dropPositionFromEvent = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    const camera = cameraRef.current;
    const container = containerRef.current;
    if (!camera || !container) return [0, 0, 0] as [number, number, number];

    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, hit);
    return [hit.x ?? 0, 0, hit.z ?? 0] as [number, number, number];
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const modelType = event.dataTransfer.getData("application/x-model-type") as ModelType;
      if (!modelType) return;
      const position = dropPositionFromEvent(event);
      const id = addObject(modelType, position);
      select(id);
    },
    [addObject, dropPositionFromEvent, select]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full bg-gradient-to-b from-brand-50 via-surface-50 to-surface-100"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Canvas
        shadows
        camera={{ position: [6, 5.5, 6], fov: 50 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
        onPointerMissed={() => select(null)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={30}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <hemisphereLight args={["#e0e7ff", "#5b21b6", 0.3]} />

        {/* Soft image-based lighting so PBR materials pick up realistic
            reflections/highlights instead of looking flat under direct light only. */}
        <Environment preset="park" background={false} />
        <Sky sunPosition={[5, 8, 4]} turbidity={6} rayleigh={1.5} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial color="#8bab6b" roughness={0.95} metalness={0} />
        </mesh>
        <Grid
          position={[0, 0.01, 0]}
          args={[80, 80]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#ffffff"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#ffffff"
          fadeDistance={26}
          fadeStrength={1.5}
          fadeFrom={0.8}
          infiniteGrid
        />

        <SceneObjects onGizmoDraggingChange={setIsGizmoDragging} />
        <CameraRig enabled={!isGizmoDragging} />
      </Canvas>

      <ContextMenu />

      {attachPickingForId && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-surface-900/90 px-4 py-2 text-xs font-medium text-white shadow-soft-lg">
          🧷 Click an object to attach to it — Esc to cancel
        </div>
      )}
    </div>
  );
}
