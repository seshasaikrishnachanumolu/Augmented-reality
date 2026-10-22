"use client";

import { motion } from "framer-motion";
import type { BlockTemplate } from "@/lib/interpreter/types";

const CATEGORY_COLORS: Record<string, string> = {
  event: "bg-amber-400",
  action: "bg-brand-500",
  control: "bg-teal-500",
  speech: "bg-coral-400",
  physics: "bg-slate-500",
  character: "bg-violet-500",
};

interface BlockPaletteItemProps {
  template: BlockTemplate;
}

export function BlockPaletteItem({ template }: BlockPaletteItemProps) {
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData("application/x-block-type", template.type);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div draggable onDragStart={handleDragStart} className="cursor-grab active:cursor-grabbing">
      <motion.div
        whileHover={{ scale: 1.02, x: 2 }}
        whileTap={{ scale: 0.98 }}
        title={template.description}
        className={`select-none rounded-xl px-3 py-2 text-sm font-medium text-white shadow-sm ${CATEGORY_COLORS[template.category]}`}
      >
        {template.label}
      </motion.div>
    </div>
  );
}
