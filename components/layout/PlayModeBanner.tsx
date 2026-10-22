"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";

export function PlayModeBanner() {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const objects = useEditorStore((s) => s.objects);
  const scripts = useEditorStore((s) => s.scripts);

  const scriptedCount = objects.filter((o) => (scripts[o.id]?.length ?? 0) > 0).length;

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-surface-900/85 px-4 py-2 text-xs font-medium text-white shadow-soft-lg"
        >
          ▶️ Play Mode — click a scripted asset to trigger its behavior
          {scriptedCount === 0 && " (no scripts attached yet)"}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
