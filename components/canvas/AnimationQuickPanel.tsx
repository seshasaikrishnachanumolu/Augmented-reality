"use client";

import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { getAssetDefinition } from "@/lib/assetLibrary";
import type { ModelType } from "@/types/scene";

const PROCEDURAL_ANIMATIONS = [
  { value: "bounce", label: "Bounce", icon: "🦘" },
  { value: "spin", label: "Spin", icon: "🌀" },
  { value: "pulse", label: "Pulse", icon: "💓" },
];

interface AnimationQuickPanelProps {
  objectId: string;
  modelType: ModelType;
  yOffset: number;
}

/**
 * Quick preview panel opened from the selection toolbar's Animation button.
 * Lets you preview an object's available animations (real baked clips for
 * glTF assets, or the universal procedural set) without opening Code Mode.
 * This is a preview surface, not a scripting surface — attaching an
 * animation to a click event still happens via the block editor.
 */
export function AnimationQuickPanel({ modelType, yOffset }: AnimationQuickPanelProps) {
  const def = getAssetDefinition(modelType);
  const realClips = def?.source.kind === "gltf" ? def.source.clips ?? [] : [];

  return (
    <Html position={[0, yOffset, 0]} center distanceFactor={8} zIndexRange={[39, 0]}>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-56 select-none rounded-2xl border border-surface-200 bg-surface-0 p-3 shadow-soft-lg"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-surface-900/40">
          {realClips.length > 0 ? "Real animation clips" : "Procedural animations"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(realClips.length > 0 ? realClips.map((c) => ({ value: c, label: c, icon: "🎬" })) : PROCEDURAL_ANIMATIONS).map(
            (anim) => (
              <span
                key={anim.value}
                className="flex items-center gap-1 rounded-lg bg-surface-100 px-2 py-1 text-xs text-surface-900"
              >
                <span>{anim.icon}</span>
                {anim.label}
              </span>
            )
          )}
        </div>
        <p className="mt-2 text-[11px] text-surface-900/40">
          Add a &quot;Play animation&quot; block in Code Mode to trigger these on click.
        </p>
      </motion.div>
    </Html>
  );
}
