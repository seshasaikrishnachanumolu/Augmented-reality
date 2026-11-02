"use client";

import { motion } from "framer-motion";
import { ASSET_LIBRARY } from "@/lib/assetLibrary";
import type { AssetDefinition, GltfModelSource } from "@/types/scene";

export interface PlaceableAsset extends AssetDefinition {
  source: GltfModelSource;
}

/**
 * Only real downloadable glTF assets can be placed in the camera AR
 * viewer — it uses a raw three.js GLTFLoader (see WebXRHitTestViewer),
 * not the hand-coded procedural meshes the main scene editor uses for
 * "primitive" assets, so those aren't placeable here.
 */
export const PLACEABLE_ASSETS: PlaceableAsset[] = ASSET_LIBRARY.filter(
  (asset): asset is PlaceableAsset => asset.source.kind === "gltf"
);

interface ModelPickerProps {
  onSelect: (asset: PlaceableAsset) => void;
  onClose: () => void;
}

/**
 * The "which model do you want to place?" step shown after choosing
 * Camera AR's model-placement mode — the actual tap-to-place-on-a-surface
 * interaction happens afterwards in WebXRHitTestViewer, this just decides
 * which model that tap will place.
 */
export function ModelPicker({ onSelect, onClose }: ModelPickerProps) {
  return (
    <div className="relative flex h-screen w-screen flex-col bg-surface-900 text-white">
      <div className="flex items-center justify-between px-5 pt-6">
        <div>
          <h1 className="text-lg font-semibold">Choose a model</h1>
          <p className="text-sm text-white/50">Pick what you want to place in your space.</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur"
          aria-label="Back"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto p-5 sm:grid-cols-3">
        {PLACEABLE_ASSETS.map((asset) => (
          <motion.button
            key={asset.modelType}
            onClick={() => onSelect(asset)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
              style={{ backgroundColor: `${asset.color}33` }}
              aria-hidden
            >
              {asset.icon}
            </div>
            <span className="text-sm font-medium">{asset.label}</span>
            <span className="text-[11px] text-white/50">{asset.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
