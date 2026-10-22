"use client";

import { BLOCK_CATEGORY_ORDER, getTemplatesByCategory } from "@/lib/interpreter/blockDefinitions";
import { BlockPaletteItem } from "./BlockPaletteItem";

export function BlockPalette() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto border-r border-surface-200 p-4">
      {BLOCK_CATEGORY_ORDER.map(({ category, label }) => (
        <div key={category}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-surface-900/50">
            {label}
          </h3>
          <div className="flex flex-col gap-2">
            {getTemplatesByCategory(category).map((template) => (
              <BlockPaletteItem key={template.type} template={template} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
