"use client";

import { OrbitControls } from "@react-three/drei";

interface CameraRigProps {
  enabled: boolean;
}

export function CameraRig({ enabled }: CameraRigProps) {
  return (
    <OrbitControls
      makeDefault
      enabled={enabled}
      enableDamping
      dampingFactor={0.12}
      minDistance={2}
      maxDistance={30}
      maxPolarAngle={Math.PI / 2 - 0.02}
    />
  );
}
