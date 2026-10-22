"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";
import { useProjectsStore } from "@/lib/store/projectsStore";
import { useClerkAuthUser } from "@/lib/store/useClerkAuthUser";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/gallery/UserMenu";
import type { EditorMode } from "@/types/scene";
import clsx from "@/lib/utils/clsx";

const MODES: { id: EditorMode; label: string; icon: string }[] = [
  { id: "edit", label: "Edit Mode", icon: "✏️" },
  { id: "code", label: "Code Mode", icon: "🧩" },
  { id: "play", label: "Play Mode", icon: "▶️" },
];

export function TopNavbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const openExportModal = useEditorStore((s) => s.openExportModal);
  const projectId = useEditorStore((s) => s.projectId);
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === projectId));
  const renameProject = useProjectsStore((s) => s.renameProject);
  const { user } = useClerkAuthUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const startEditing = () => {
    if (!project) return;
    setNameDraft(project.name);
    setIsEditingName(true);
  };

  const commitName = () => {
    if (project && nameDraft.trim()) renameProject(project.id, nameDraft);
    setIsEditingName(false);
  };

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-surface-200 bg-surface-0/95 px-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Link
            href="/gallery"
            aria-label="Back to gallery"
            title="Back to gallery"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 bg-surface-0 text-lg text-surface-900 transition-colors hover:bg-surface-50"
          >
            ←
          </Link>
        </motion.div>
        <div className="hidden h-6 w-px bg-surface-200 sm:block" />
        {isEditingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName();
              if (e.key === "Escape") setIsEditingName(false);
            }}
            className="w-48 rounded-lg border border-brand-300 bg-white px-2 py-1 text-sm font-medium text-surface-900 focus:outline-none"
          />
        ) : (
          <button
            onClick={startEditing}
            title="Rename project"
            className="hidden max-w-[12rem] truncate rounded-lg px-2 py-1 text-sm font-medium text-surface-900/80 hover:bg-surface-100 sm:block"
          >
            {project?.name ?? "Untitled CoSpace"}
          </button>
        )}
      </div>

      <nav className="flex items-center gap-1 rounded-2xl border border-surface-200 bg-surface-50 p-1">
        {MODES.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={clsx(
                "relative rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                isActive ? "text-white" : "text-surface-900/70 hover:text-surface-900"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="mode-pill"
                  className="absolute inset-0 rounded-xl bg-brand-500 shadow-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                <span>{m.icon}</span>
                {m.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <Button variant="primary" size="md" onClick={openExportModal} className="gap-2">
          <span aria-hidden>📱</span>
          Export to WebAR
        </Button>
        {user && <UserMenu user={user} />}
      </div>
    </motion.header>
  );
}
