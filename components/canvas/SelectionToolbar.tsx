"use client";

import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";
import { getAssetDefinition } from "@/lib/assetLibrary";
import type { ModelType } from "@/types/scene";

interface SelectionToolbarProps {
  objectId: string;
  modelType: ModelType;
  /** Local Y offset (above the object's bounding area) in the object's own space. */
  yOffset: number;
}

const ACTIONS: { key: "code" | "transform" | "animation" | "material"; icon: string; label: string }[] = [
  { key: "code", icon: "🧩", label: "Code" },
  { key: "transform", icon: "✋", label: "Transform" },
  { key: "animation", icon: "🎞️", label: "Animation" },
  { key: "material", icon: "🎨", label: "Material" },
];

/**
 * A CoSpaces-style floating quick-action toolbar that appears above the
 * currently selected object, anchored in 3D space via drei's <Html>. Each
 * action jumps the editor into the relevant mode/panel rather than requiring
 * the right-click context menu for common actions.
 */
export function SelectionToolbar({ objectId, modelType, yOffset }: SelectionToolbarProps) {
  const setMode = useEditorStore((s) => s.setMode);
  const setScriptTarget = useEditorStore((s) => s.setScriptTarget);
  const setTransformTool = useEditorStore((s) => s.setTransformTool);
  const transformTool = useEditorStore((s) => s.transformTool);
  const activeQuickPanel = useEditorStore((s) => s.activeQuickPanel);
  const setActiveQuickPanel = useEditorStore((s) => s.setActiveQuickPanel);

  const def = getAssetDefinition(modelType);

  const handleAction = (key: (typeof ACTIONS)[number]["key"]) => {
    if (key === "code") {
      setScriptTarget(objectId);
      setMode("code");
      return;
    }
    if (key === "transform") {
      const next = transformTool === "translate" ? "rotate" : transformTool === "rotate" ? "scale" : "translate";
      setTransformTool(next);
      return;
    }
    setActiveQuickPanel(activeQuickPanel === key ? null : key);
  };

  return (
    <Html position={[0, yOffset, 0]} center distanceFactor={8} zIndexRange={[40, 0]}>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
        className="flex select-none items-center gap-1 whitespace-nowrap rounded-2xl border border-surface-200 bg-surface-900/90 px-1.5 py-1.5 shadow-soft-lg backdrop-blur-sm"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span className="px-2 text-[11px] font-medium text-white/70">{def?.label ?? "Object"}</span>
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            title={action.label}
            onClick={(e) => {
              e.stopPropagation();
              handleAction(action.key);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm transition-colors ${
              activeQuickPanel === action.key
                ? "bg-brand-500 text-white"
                : "text-white/80 hover:bg-white/15"
            }`}
          >
            {action.icon}
          </button>
        ))}
      </motion.div>
    </Html>
  );
}
