"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";
import { BlockPalette } from "./BlockPalette";
import { BlockWorkspace } from "./BlockWorkspace";

export function BlockEditorPanel() {
  const mode = useEditorStore((s) => s.mode);
  const objects = useEditorStore((s) => s.objects);
  const selectedId = useEditorStore((s) => s.selectedId);
  const scriptTargetId = useEditorStore((s) => s.scriptTargetId);
  const setScriptTarget = useEditorStore((s) => s.setScriptTarget);

  const isOpen = mode === "code";

  useEffect(() => {
    if (!isOpen) return;
    if (scriptTargetId && objects.some((o) => o.id === scriptTargetId)) return;
    setScriptTarget(selectedId ?? objects[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="block-editor"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "40%", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="z-20 flex h-full min-w-[360px] max-w-[560px] shrink-0 overflow-hidden border-l border-surface-200 bg-surface-0"
        >
          <div className="flex h-full w-full">
            <div className="w-44 shrink-0">
              <BlockPalette />
            </div>
            <BlockWorkspace />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
