"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { useProjectsStore } from "@/lib/store/projectsStore";
import { useClerkAuthUser } from "@/lib/store/useClerkAuthUser";
import { PROJECT_TEMPLATES } from "@/lib/templates";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectCard } from "./CreateProjectCard";
import { TemplateCard } from "./TemplateCard";
import { UserMenu } from "./UserMenu";

export function GalleryPage() {
  const projects = useProjectsStore((s) => s.projects);
  const hydrated = useProjectsStore((s) => s.hasHydrated);
  const fetchProjects = useProjectsStore((s) => s.fetchProjects);
  const { user } = useClerkAuthUser();

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-screen overflow-y-auto bg-surface-50">
      <header className="flex items-center justify-between border-b border-surface-200 bg-surface-0 px-6 py-4 sm:px-10">
        <Logo href="/" />
        {user && <UserMenu user={user} />}
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 p-6 text-white sm:flex-row sm:items-center"
        >
          <div>
            <h2 className="text-lg font-semibold">📷 Camera AR</h2>
            <p className="mt-1 text-sm text-white/80">
              Scan your surroundings with your camera and place a 3D model directly in your space.
            </p>
          </div>
          <Link
            href="/ar-scan"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-600 shadow-soft-lg transition-transform hover:scale-105"
          >
            Open Camera AR →
          </Link>
        </motion.div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-surface-900">Templates</h2>
          <p className="mt-1 text-sm text-surface-900/50">Start from a ready-made scene.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECT_TEMPLATES.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>

        <div className="mb-8 border-t border-surface-200 pt-8">
          <h1 className="text-2xl font-semibold text-surface-900">My CoSpaces</h1>
          <p className="mt-1 text-sm text-surface-900/50">
            Pick up where you left off, or start a brand new interactive scene.
          </p>
        </div>

        {!hydrated ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[188px] animate-pulse rounded-2xl bg-surface-100" />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <CreateProjectCard />
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}

        {hydrated && projects.length === 0 && (
          <p className="mt-6 text-center text-sm text-surface-900/40">
            No CoSpaces yet — create your first one above.
          </p>
        )}
      </main>
    </div>
  );
}
