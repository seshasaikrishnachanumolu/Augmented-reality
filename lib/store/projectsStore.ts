import { create } from "zustand";
import type { ProjectSceneData, ProjectSummary, SceneData } from "@/types/scene";
import type { BlockNode } from "@/lib/interpreter/types";
import { createId } from "@/lib/utils/id";

const PROJECT_COLORS = ["#8b5cf6", "#14b8a6", "#f43f5e", "#f59e0b", "#38bdf8", "#22c55e"];

export function createEmptyScene(name = "Scene 1"): SceneData {
  return { id: createId("scn"), name, objects: [], scripts: {} };
}

function cloneBlocks(blocks: BlockNode[]): BlockNode[] {
  return blocks.map((block) => ({
    ...block,
    uid: createId("blk"),
    params: { ...block.params },
    children: cloneBlocks(block.children),
  }));
}

/** Deep-clones a scene with fresh ids for the scene, its objects, and its scripts. */
export function cloneSceneWithFreshIds(scene: SceneData, name?: string): SceneData {
  const idMap = new Map<string, string>();
  const objects = scene.objects.map((obj) => {
    const newId = createId("obj");
    idMap.set(obj.id, newId);
    return { ...obj, id: newId };
  });
  const remappedObjects = objects.map((obj) =>
    obj.parentId ? { ...obj, parentId: idMap.get(obj.parentId) ?? null } : obj
  );
  const scripts: Record<string, BlockNode[]> = {};
  for (const [oldId, blocks] of Object.entries(scene.scripts)) {
    const newId = idMap.get(oldId);
    if (newId) scripts[newId] = cloneBlocks(blocks);
  }
  return { id: createId("scn"), name: name ?? scene.name, objects: remappedObjects, scripts };
}

function randomColor(): string {
  return PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
}

async function parseJsonSafe(response: Response): Promise<Record<string, unknown>> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

interface ProjectsStore {
  projects: ProjectSummary[];
  /** In-memory cache of full scene data per project id, keyed for the duration of the session. */
  sceneCache: Record<string, ProjectSceneData>;
  hasHydrated: boolean;
  isLoadingProjects: boolean;

  /** Fetches the current user's project list from the server. Call once the user is known to be logged in. */
  fetchProjects: () => Promise<void>;
  createProject: (name?: string) => Promise<string | null>;
  createProjectFromScenes: (scenes: SceneData[], name?: string) => Promise<string | null>;
  renameProject: (id: string, name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  /** Fetches (and caches) a single project's full scene data from the server. */
  getScene: (id: string) => Promise<ProjectSceneData | undefined>;
  /** Persists a project's scene data to the server (and updates the local cache). */
  saveScene: (id: string, data: ProjectSceneData) => Promise<void>;
}

export const useProjectsStore = create<ProjectsStore>()((set, get) => ({
  projects: [],
  sceneCache: {},
  hasHydrated: false,
  isLoadingProjects: false,

  fetchProjects: async () => {
    set({ isLoadingProjects: true });
    try {
      const response = await fetch("/api/projects");
      const data = await parseJsonSafe(response);
      if (response.ok && Array.isArray(data.projects)) {
        set({ projects: data.projects as ProjectSummary[] });
      }
    } finally {
      set({ isLoadingProjects: false, hasHydrated: true });
    }
  },

  createProject: async (name) => {
    const scene = createEmptyScene();
    return get().createProjectFromScenes([scene], name);
  },

  createProjectFromScenes: async (scenes, name) => {
    const freshScenes = scenes.map((s) => cloneSceneWithFreshIds(s, s.name));
    const color = randomColor();
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, scenes: freshScenes }),
      });
      const data = await parseJsonSafe(response);
      if (!response.ok || !data.project) return null;
      const project = data.project as ProjectSummary;
      set((state) => ({
        projects: [project, ...state.projects],
        sceneCache: {
          ...state.sceneCache,
          [project.id]: { scenes: freshScenes, activeSceneId: freshScenes[0].id },
        },
      }));
      return project.id;
    } catch {
      return null;
    }
  },

  renameProject: async (id, name) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, name: name.trim() || p.name } : p)),
    }));
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    } catch {
      // Best-effort: the optimistic rename above already reflects in the UI;
      // a failed network write here will simply be out of sync until reload.
    }
  },

  deleteProject: async (id) => {
    set((state) => {
      const rest = { ...state.sceneCache };
      delete rest[id];
      return { projects: state.projects.filter((p) => p.id !== id), sceneCache: rest };
    });
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
    } catch {
      // Best-effort deletion; UI already reflects removal optimistically.
    }
  },

  getScene: async (id) => {
    const cached = get().sceneCache[id];
    if (cached) return cached;
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await parseJsonSafe(response);
      if (!response.ok || !data.project) return undefined;
      const project = data.project as { scenes: SceneData[]; activeSceneId: string };
      const sceneData: ProjectSceneData = { scenes: project.scenes, activeSceneId: project.activeSceneId };
      set((state) => ({ sceneCache: { ...state.sceneCache, [id]: sceneData } }));
      return sceneData;
    } catch {
      return undefined;
    }
  },

  saveScene: async (id, data) => {
    set((state) => ({
      sceneCache: { ...state.sceneCache, [id]: data },
      projects: state.projects.map((p) => (p.id === id ? { ...p, updatedAt: Date.now() } : p)),
    }));
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes: data.scenes, activeSceneId: data.activeSceneId }),
      });
    } catch {
      // Best-effort save; local cache above keeps the editor consistent
      // within this session even if the network write fails.
    }
  },
}));
