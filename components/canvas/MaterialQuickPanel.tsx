"use client";

import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";
import { getAssetDefinition } from "@/lib/assetLibrary";
import { COLOR_SWATCHES } from "@/lib/utils/colorSwatches";
import type { ModelType } from "@/types/scene";

const SWATCHES = COLOR_SWATCHES;

interface MaterialQuickPanelProps {
  objectId: string;
  modelType: ModelType;
  yOffset: number;
}

/**
 * Quick color swatch picker for the selected object's primitive material.
 * Real glTF assets (Fox, CesiumMan) keep their authored textures — swapping
 * colors on a photoreal model wouldn't make sense, so the panel says so.
 */
export function MaterialQuickPanel({ objectId, modelType, yOffset }: MaterialQuickPanelProps) {
  const def = getAssetDefinition(modelType);
  const updateObject = useEditorStore((s) => s.updateObject);
  const currentColor = useEditorStore(
    (s) => s.objects.find((o) => o.id === objectId)?.color ?? def?.color
  );

  const isRealAsset = def?.source.kind === "gltf";

  return (
    <Html position={[0, yOffset, 0]} center distanceFactor={8} zIndexRange={[39, 0]}>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-48 select-none rounded-2xl border border-surface-200 bg-surface-0 p-3 shadow-soft-lg"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {isRealAsset ? (
          <p className="text-xs text-surface-900/60">
            This is a real textured model — material color comes from its own artwork.
          </p>
        ) : (
          <>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-surface-900/40">
              Color
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  onClick={() => updateObject(objectId, { color: swatch })}
                  className={`h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                    currentColor === swatch ? "border-surface-900" : "border-transparent"
                  }`}
                  style={{ backgroundColor: swatch }}
                  aria-label={`Set color ${swatch}`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </Html>
  );
}
