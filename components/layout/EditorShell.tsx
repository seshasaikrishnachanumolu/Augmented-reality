"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNavbar } from "./TopNavbar";
import { LeftSidebar } from "./LeftSidebar";
import { SceneSwitcher } from "./SceneSwitcher";
import { Stage } from "@/components/canvas/Stage";
import { BlockEditorPanel } from "@/components/blocks/BlockEditorPanel";
import { ExportModal } from "@/components/webar/ExportModal";
import { PlayModeBanner } from "./PlayModeBanner";
import { useEditorStore } from "@/lib/store/editorStore";
import { useProjectsStore } from "@/lib/store/projectsStore";

interface EditorShellProps {
  projectId: string;
}

export function EditorShell({ projectId }: EditorShellProps) {
  const router = useRouter();
  const loadProject = useEditorStore((s) => s.loadProject);
  const currentProjectId = useEditorStore((s) => s.projectId);
  const getScene = useProjectsStore((s) => s.getScene);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (currentProjectId === projectId) return;
    let cancelled = false;
    (async () => {
      const scene = await getScene(projectId);
      if (cancelled) return;
      if (!scene) {
        setNotFound(true);
        return;
      }
      await loadProject(projectId);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (notFound) router.replace("/gallery");
  }, [notFound, router]);

  if (notFound || currentProjectId !== projectId) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-surface-100">
      <TopNavbar />
      <SceneSwitcher />
      <div className="relative flex min-h-0 flex-1">
        <LeftSidebar />
        <main className="relative min-w-0 flex-1">
          <Stage />
          <PlayModeBanner />
        </main>
        <BlockEditorPanel />
      </div>
      <ExportModal />
    </div>
  );
}
