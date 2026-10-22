"use client";

import { motion } from "framer-motion";
import { AssetCategory } from "@/components/assets/AssetCategory";
import { ASSET_CATEGORIES } from "@/lib/assetLibrary";

export function LeftSidebar() {
  return (
    <motion.aside
      initial={{ x: -64, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.05 }}
      className="z-20 flex h-full w-72 shrink-0 flex-col border-r border-surface-200 bg-surface-0"
    >
      <div className="border-b border-surface-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-surface-900">Asset Library</h2>
        <p className="text-xs text-surface-900/50">Drag an asset onto the stage</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {ASSET_CATEGORIES.map((cat, i) => (
          <AssetCategory key={cat.id} id={cat.id} label={cat.label} icon={cat.icon} defaultOpen={i === 0} />
        ))}
      </div>
    </motion.aside>
  );
}
