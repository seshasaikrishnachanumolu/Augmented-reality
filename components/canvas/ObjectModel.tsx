"use client";

import { useMemo } from "react";
import { getAssetDefinition } from "@/lib/assetLibrary";
import { PrimitiveModel } from "./PrimitiveModel";
import { GltfModel } from "./GltfModel";
import type { ModelType } from "@/types/scene";

interface ObjectModelProps {
  modelType: ModelType;
  color?: string;
  activeClip?: string | null;
  loopClip?: boolean;
}

/**
 * Renders the appropriate visual for a scene object: a real glTF asset when
 * the asset definition specifies one, otherwise a stylized PBR primitive.
 * This is the single place that decides "real model vs. primitive stand-in",
 * so the rest of the canvas layer doesn't need to know the difference.
 */
export function ObjectModel({ modelType, color, activeClip, loopClip }: ObjectModelProps) {
  const def = useMemo(() => getAssetDefinition(modelType), [modelType]);

  if (def?.source.kind === "gltf") {
    return <GltfModel source={def.source} activeClip={activeClip} loop={loopClip} />;
  }

  return <PrimitiveModel modelType={modelType} color={color} />;
}
