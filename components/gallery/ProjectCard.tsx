"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectSummary } from "@/types/scene";
import { useProjectsStore } from "@/lib/store/projectsStore";
import { IconButton } from "@/components/ui/IconButton";

interface ProjectCardProps {
  project: ProjectSummary;
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const deleteProject = useProjectsStore((s) => s.deleteProject);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    deleteProject(project.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm hover:shadow-soft"
    >
      <Link href={`/editor/${project.id}`}>
        <div
          className="flex h-32 items-center justify-center text-4xl"
          style={{ background: `linear-gradient(135deg, ${project.color}33, ${project.color}11)` }}
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-soft"
            style={{ backgroundColor: project.color }}
          >
            🌀
          </span>
        </div>
        <div className="p-4">
          <h3 className="truncate text-sm font-semibold text-surface-900">{project.name}</h3>
          <p className="mt-0.5 text-xs text-surface-900/45">Edited {formatRelativeTime(project.updatedAt)}</p>
        </div>
      </Link>

      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton
          label={confirming ? "Confirm delete" : "Delete project"}
          onClick={handleDelete}
          className={confirming ? "!bg-coral-500 !text-white !border-coral-500" : ""}
        >
          {confirming ? "⚠️" : "🗑️"}
        </IconButton>
      </div>
    </motion.div>
  );
}
