"use client";

import { useMemo } from "react";
import { getAssetDefinition } from "@/lib/assetLibrary";
import { CharacterModel } from "./CharacterModels";
import { AnimalModel } from "./AnimalModels";
import { BuildingModel } from "./BuildingModels";
import { NatureModel } from "./NatureModels";
import type { ModelType } from "@/types/scene";

interface PrimitiveModelProps {
  modelType: ModelType;
  color?: string;
}

/**
 * Renders high-fidelity, stylized 3D models for all 80 assets in the library:
 * - Characters (20 archetypes with anatomically distinct clothes, gear, and props)
 * - Animals (20 creatures with anatomical limbs, ears, snouts, tails, and eyes)
 * - Buildings (20 architectural structures with roofs, doors, windows, and trims)
 * - Nature (20 environmental assets with organic foliage, flora, and formations)
 */
export function PrimitiveModel({ modelType, color }: PrimitiveModelProps) {
  const def = useMemo(() => getAssetDefinition(modelType), [modelType]);
  const baseColor = color ?? def?.color ?? "#8b5cf6";

  if (modelType.startsWith("character-")) {
    return <CharacterModel modelType={modelType} color={baseColor} />;
  }

  if (modelType.startsWith("animal-")) {
    return <AnimalModel modelType={modelType} color={baseColor} />;
  }

  if (modelType.startsWith("building-")) {
    return <BuildingModel modelType={modelType} color={baseColor} />;
  }

  if (modelType.startsWith("nature-")) {
    return <NatureModel modelType={modelType} color={baseColor} />;
  }

  return (
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.8, 1, 0.8]} />
      <meshStandardMaterial color={baseColor} />
    </mesh>
  );
}
