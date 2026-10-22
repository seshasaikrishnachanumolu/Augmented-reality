"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";

/**
 * Tab strip under the navbar for switching between a project's scenes
 * (a "CoSpace" can contain multiple scenes, similar to slides). Supports
 * add/duplicate/rename/delete, mirroring CoSpaces' multi-scene projects.
 */
export function SceneSwitcher() {
  const scenes = useEditorStore((s) => s.scenes);
  const sceneId = useEditorStore((s) => s.sceneId);
  const switchScene = useEditorStore((s) => s.switchScene);
  const addScene = useEditorStore((s) => s.addScene);
  const duplicateScene = useEditorStore((s) => s.duplicateScene);
  const removeScene = useEditorStore((s) => s.removeScene);
  const renameScene = useEditorStore((s) => s.renameScene);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setDraft(name);
    setMenuOpenFor(null);
  };

  const commitEdit = () => {
    if (editingId) renameScene(editingId, draft);
    setEditingId(null);
  };

  return (
    <div className="relative z-20 flex h-11 shrink-0 items-center gap-1.5 border-b border-surface-200 bg-surface-50 px-3">
      <div className="flex flex-1 items-center gap-1.5 overflow-x-auto">
        {scenes.map((scene, index) => {
          const isActive = scene.id === sceneId;
          return (
            <div key={scene.id} className="relative shrink-0">
              {editingId === scene.id ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="h-8 w-32 rounded-lg border border-brand-300 bg-white px-2 text-xs font-medium"
                />
              ) : (
                <motion.div
                  role="button"
                  tabIndex={0}
                  onClick={() => switchScene(scene.id)}
                  onDoubleClick={() => startEditing(scene.id, scene.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") switchScene(scene.id);
                  }}
                  whileHover={{ y: -1 }}
                  className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-brand-500 text-white shadow-soft"
                      : "bg-surface-0 text-surface-900/70 hover:bg-surface-100"
                  }`}
                >
                  <span className="opacity-60">{index + 1}</span>
                  {scene.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenFor(menuOpenFor === scene.id ? null : scene.id);
                    }}
                    className={`ml-0.5 rounded px-1 ${isActive ? "hover:bg-white/20" : "hover:bg-surface-200"}`}
                    aria-label={`${scene.name} options`}
                  >
                    ⋮
                  </button>
                </motion.div>
              )}

              {menuOpenFor === scene.id && (
                <div
                  onMouseLeave={() => setMenuOpenFor(null)}
                  className="absolute left-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-xl border border-surface-200 bg-surface-0 py-1 shadow-soft-lg"
                >
                  <button
                    onClick={() => {
                      startEditing(scene.id, scene.name);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-surface-100"
                  >
                    ✏️ Rename
                  </button>
                  <button
                    onClick={() => {
                      duplicateScene(scene.id);
                      setMenuOpenFor(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-surface-100"
                  >
                    📋 Duplicate
                  </button>
                  {scenes.length > 1 && (
                    <button
                      onClick={() => {
                        removeScene(scene.id);
                        setMenuOpenFor(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-coral-500 hover:bg-surface-100"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addScene}
        title="Add scene"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-200 bg-surface-0 text-sm text-surface-900/70 hover:bg-surface-100"
      >
        ➕
      </button>
    </div>
  );
}
