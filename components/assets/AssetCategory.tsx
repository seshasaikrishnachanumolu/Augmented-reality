"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AssetCard } from "./AssetCard";
import { getAssetsByCategory } from "@/lib/assetLibrary";
import type { AssetCategoryId } from "@/types/scene";

interface AssetCategoryProps {
  id: AssetCategoryId;
  label: string;
  icon: string;
  defaultOpen?: boolean;
}

export function AssetCategory({ id, label, icon, defaultOpen }: AssetCategoryProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const assets = getAssetsByCategory(id);

  return (
    <div className="border-b border-surface-200/70 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-3 text-left transition-colors hover:bg-surface-50"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-surface-900">
          <span className="text-base">{icon}</span>
          {label}
          <span className="rounded-full bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-900/60">
            {assets.length}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-surface-900/50"
        >
          ▸
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 px-3 pb-3">
              {assets.map((asset) => (
                <AssetCard key={asset.modelType} asset={asset} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
