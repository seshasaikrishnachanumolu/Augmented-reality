"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";

type ActionKey = "attach" | "detach" | "lock" | "duplicate" | "delete";

export function ContextMenu() {
  const contextMenu = useEditorStore((s) => s.contextMenu);
  const closeContextMenu = useEditorStore((s) => s.closeContextMenu);
  const duplicateObject = useEditorStore((s) => s.duplicateObject);
  const removeObject = useEditorStore((s) => s.removeObject);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const startAttachPicking = useEditorStore((s) => s.startAttachPicking);
  const detachObject = useEditorStore((s) => s.detachObject);
  const objects = useEditorStore((s) => s.objects);
  const menuRef = useRef<HTMLDivElement>(null);

  const targetObject = contextMenu ? objects.find((o) => o.id === contextMenu.objectId) : null;

  const items = useMemo<{ key: ActionKey; label: string; icon: string; danger?: boolean }[]>(() => {
    const isLocked = !!targetObject?.locked;
    const isAttached = !!targetObject?.parentId;
    return [
      isAttached
        ? { key: "detach", label: "Detach", icon: "🔗" }
        : { key: "attach", label: "Attach to...", icon: "🧷" },
      { key: "lock", label: isLocked ? "Unlock" : "Lock", icon: isLocked ? "🔓" : "🔒" },
      { key: "duplicate", label: "Duplicate", icon: "📋" },
      { key: "delete", label: "Delete", icon: "🗑️", danger: true },
    ];
  }, [targetObject]);

  useEffect(() => {
    if (!contextMenu) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContextMenu();
    };
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [contextMenu, closeContextMenu]);

  const handleAction = (key: ActionKey) => {
    if (!contextMenu) return;
    const { objectId } = contextMenu;
    if (key === "duplicate") duplicateObject(objectId);
    if (key === "delete") removeObject(objectId);
    if (key === "lock") toggleLock(objectId);
    if (key === "attach") startAttachPicking(objectId);
    if (key === "detach") detachObject(objectId);
    closeContextMenu();
  };

  return (
    <AnimatePresence>
      {contextMenu && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.92, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.14 }}
          style={{ position: "fixed", left: contextMenu.x, top: contextMenu.y }}
          className="z-50 w-48 overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 py-1.5 shadow-soft-lg"
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => handleAction(item.key)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-surface-100 ${
                item.danger ? "text-coral-500" : "text-surface-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
