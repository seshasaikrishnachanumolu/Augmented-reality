"use client";

import { motion } from "framer-motion";
import type { AssetDefinition } from "@/types/scene";

interface AssetCardProps {
  asset: AssetDefinition;
}

export function AssetCard({ asset }: AssetCardProps) {
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData("application/x-model-type", asset.modelType);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div draggable onDragStart={handleDragStart} className="cursor-grab active:cursor-grabbing">
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        title={asset.description}
        className="group flex select-none flex-col items-center gap-1.5 rounded-2xl border border-surface-200 bg-surface-0 p-3 text-center shadow-sm hover:border-brand-200 hover:shadow-soft"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-inner"
          style={{ backgroundColor: `${asset.color}26` }}
          aria-hidden
        >
          {asset.icon}
        </div>
        <span className="text-xs font-medium text-surface-900">{asset.label}</span>
      </motion.div>
    </div>
  );
}
