"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { BlockNode, BlockParamSpec, BlockType } from "@/lib/interpreter/types";
import { BLOCK_TEMPLATES } from "@/lib/interpreter/blockDefinitions";
import { createId } from "@/lib/utils/id";
import { getAssetDefinition } from "@/lib/assetLibrary";
import { useEditorStore } from "@/lib/store/editorStore";
import { COLOR_SWATCHES } from "@/lib/utils/colorSwatches";
import type { ModelType } from "@/types/scene";

const CATEGORY_STYLES: Record<string, { bg: string; border: string }> = {
  event: { bg: "bg-amber-50", border: "border-amber-300" },
  action: { bg: "bg-brand-50", border: "border-brand-300" },
  control: { bg: "bg-teal-50", border: "border-teal-300" },
  speech: { bg: "bg-rose-50", border: "border-rose-300" },
  physics: { bg: "bg-slate-100", border: "border-slate-300" },
  character: { bg: "bg-violet-50", border: "border-violet-300" },
};

const SWATCH_LABELS: Record<string, string> = {
  "#8b5cf6": "Violet",
  "#14b8a6": "Teal",
  "#f43f5e": "Rose",
  "#f59e0b": "Amber",
  "#38bdf8": "Sky",
  "#22c55e": "Green",
  "#64748b": "Slate",
  "#a8a29e": "Stone",
};

interface BlockViewProps {
  block: BlockNode;
  onChange: (updated: BlockNode) => void;
  onRemove: () => void;
  targetLabel: string;
  targetModelType?: ModelType;
  /** The id of the object this script belongs to, so target pickers can exclude it. */
  currentObjectId?: string;
}

export function BlockView({
  block,
  onChange,
  onRemove,
  targetLabel,
  targetModelType,
  currentObjectId,
}: BlockViewProps) {
  const template = BLOCK_TEMPLATES[block.type];
  const style = CATEGORY_STYLES[template.category];
  const [isDropTarget, setIsDropTarget] = useState(false);
  const allObjects = useEditorStore((s) => s.objects);

  // For the "Play animation" block, surface the target's real baked clip
  // names (e.g. Walk/Run for the Fox) alongside the universal procedural
  // fallbacks, so scripting a real asset can trigger its authored animation.
  // For character "walk to" / "face" blocks, populate the target dropdown
  // with every other object currently in the scene. For "change outfit
  // color", populate the shared color swatch list.
  const resolvedParamSpecs = useMemo<BlockParamSpec[]>(() => {
    if (block.type === "action.playAnimation" && targetModelType) {
      const def = getAssetDefinition(targetModelType);
      const clips = def?.source.kind === "gltf" ? def.source.clips ?? [] : [];
      if (clips.length > 0) {
        return template.paramSpecs.map((spec) =>
          spec.key === "animation"
            ? {
                ...spec,
                options: [
                  ...clips.map((clip) => ({ value: clip, label: `${clip} (real clip)` })),
                  ...(spec.options ?? []),
                ],
              }
            : spec
        );
      }
    }
    if (block.type === "character.walkTo" || block.type === "character.faceTarget") {
      const otherObjects = allObjects.filter((o) => o.id !== currentObjectId);
      return template.paramSpecs.map((spec) =>
        spec.key === "targetId"
          ? {
              ...spec,
              options: otherObjects.map((o) => ({ value: o.id, label: o.name })),
            }
          : spec
      );
    }
    if (block.type === "character.changeOutfitColor") {
      return template.paramSpecs.map((spec) =>
        spec.key === "color"
          ? {
              ...spec,
              options: COLOR_SWATCHES.map((swatch) => ({
                value: swatch,
                label: SWATCH_LABELS[swatch] ?? swatch,
              })),
            }
          : spec
      );
    }
    return template.paramSpecs;
  }, [block.type, targetModelType, template.paramSpecs, allObjects, currentObjectId]);

  const handleParamChange = (key: string, value: string | number) => {
    onChange({ ...block, params: { ...block.params, [key]: value } });
  };

  const updateChild = (index: number, updated: BlockNode) => {
    const children = [...block.children];
    children[index] = updated;
    onChange({ ...block, children });
  };

  const removeChild = (index: number) => {
    const children = block.children.filter((_, i) => i !== index);
    onChange({ ...block, children });
  };

  const handleChildDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDropTarget(false);
    const blockType = event.dataTransfer.getData("application/x-block-type") as BlockType;
    if (!blockType) return;
    const childTemplate = BLOCK_TEMPLATES[blockType];
    const newBlock: BlockNode = {
      uid: createId("blk"),
      type: blockType,
      params: { ...childTemplate.defaultParams },
      children: [],
    };
    onChange({ ...block, children: [...block.children, newBlock] });
  };

  const label = template.label.replace("[Asset]", targetLabel);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-xl border-2 ${style.border} ${style.bg} p-2.5 shadow-sm`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-surface-900">{label}</span>
        <button
          onClick={onRemove}
          aria-label={`Remove ${label} block`}
          className="rounded-full px-1.5 text-xs text-surface-900/40 hover:bg-surface-900/10 hover:text-coral-500"
        >
          ✕
        </button>
      </div>

      {resolvedParamSpecs.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {resolvedParamSpecs.map((spec) => (
            <label key={spec.key} className="flex items-center gap-1 text-xs text-surface-900/70">
              {spec.label}
              {spec.type === "select" ? (
                <span className="flex items-center gap-1">
                  {block.type === "character.changeOutfitColor" && (
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full border border-surface-900/10"
                      style={{ backgroundColor: String(block.params[spec.key] ?? "") }}
                      aria-hidden
                    />
                  )}
                  <select
                    value={String(block.params[spec.key] ?? "")}
                    onChange={(e) => handleParamChange(spec.key, e.target.value)}
                    className="rounded-md border border-surface-200 bg-white px-1.5 py-0.5 text-xs"
                  >
                    {spec.options?.length === 0 && <option value="">No other objects yet</option>}
                    {spec.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </span>
              ) : spec.type === "text" ? (
                <input
                  type="text"
                  value={String(block.params[spec.key] ?? "")}
                  onChange={(e) => handleParamChange(spec.key, e.target.value)}
                  className="w-28 rounded-md border border-surface-200 bg-white px-1.5 py-0.5 text-xs"
                />
              ) : (
                <input
                  type="number"
                  value={Number(block.params[spec.key] ?? 0)}
                  min={spec.min}
                  max={spec.max}
                  step={spec.step ?? 1}
                  onChange={(e) => handleParamChange(spec.key, Number(e.target.value))}
                  className="w-16 rounded-md border border-surface-200 bg-white px-1.5 py-0.5 text-xs"
                />
              )}
              {spec.suffix && <span className="text-surface-900/40">{spec.suffix}</span>}
            </label>
          ))}
        </div>
      )}

      {template.acceptsChildren && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDropTarget(true);
          }}
          onDragLeave={() => setIsDropTarget(false)}
          onDrop={handleChildDrop}
          className={`mt-2 flex flex-col gap-2 rounded-lg border-2 border-dashed p-2 transition-colors ${
            isDropTarget ? "border-brand-400 bg-brand-100/50" : "border-surface-200"
          }`}
        >
          {block.children.length === 0 && (
            <p className="py-1 text-center text-[11px] text-surface-900/40">Drop blocks here</p>
          )}
          {block.children.map((child, index) => (
            <BlockView
              key={child.uid}
              block={child}
              targetLabel={targetLabel}
              targetModelType={targetModelType}
              currentObjectId={currentObjectId}
              onChange={(updated) => updateChild(index, updated)}
              onRemove={() => removeChild(index)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
