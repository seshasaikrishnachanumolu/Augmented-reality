import { create } from "zustand";
import type {
  EditorMode,
  ModelType,
  ProjectSceneData,
  QuickPanel,
  SceneData,
  SceneObjectState,
  TransformTool,
  Vector3Tuple,
} from "@/types/scene";
import type { BlockNode } from "@/lib/interpreter/types";
import { createId } from "@/lib/utils/id";
import { getAssetDefinition } from "@/lib/assetLibrary";
import { useProjectsStore, createEmptyScene, cloneSceneWithFreshIds } from "@/lib/store/projectsStore";

type PlaySnapshotEntry = Pick<SceneObjectState, "position" | "rotation" | "scale">;

interface EditorStore {
  // ---- project binding ----
  projectId: string | null;
  isLoadingProject: boolean;
  loadProject: (projectId: string) => Promise<void>;
  saveProject: () => void;

  // ---- scenes (a project/CoSpace has one or more scenes, like slides) ----
  scenes: SceneData[];
  sceneId: string | null;
  switchScene: (sceneId: string) => void;
  addScene: () => void;
  duplicateScene: (sceneId: string) => void;
  removeScene: (sceneId: string) => void;
  renameScene: (sceneId: string, name: string) => void;

  // ---- mode ----
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;

  // ---- scene objects (of the currently active scene) ----
  objects: SceneObjectState[];
  addObject: (modelType: ModelType, position: Vector3Tuple) => string;
  updateObject: (id: string, patch: Partial<Omit<SceneObjectState, "id">>) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;

  // ---- selection & transform tool ----
  selectedId: string | null;
  select: (id: string | null) => void;
  transformTool: TransformTool;
  setTransformTool: (tool: TransformTool) => void;

  // ---- context menu ----
  contextMenu: { objectId: string; x: number; y: number } | null;
  openContextMenu: (objectId: string, x: number, y: number) => void;
  closeContextMenu: () => void;

  // ---- quick-action toolbar sub-panel ----
  activeQuickPanel: QuickPanel;
  setActiveQuickPanel: (panel: QuickPanel) => void;

  // ---- lock ----
  toggleLock: (id: string) => void;

  // ---- attach (parenting) ----
  attachPickingForId: string | null;
  startAttachPicking: (id: string) => void;
  cancelAttachPicking: () => void;
  attachObjectTo: (childId: string, parentId: string) => void;
  detachObject: (id: string) => void;

  // ---- block scripts (of the currently active scene) ----
  scripts: Record<string, BlockNode[]>;
  scriptTargetId: string | null;
  setScriptTarget: (id: string | null) => void;
  setScript: (objectId: string, blocks: BlockNode[]) => void;

  // ---- play mode ----
  isPlaying: boolean;
  snapshotBeforePlay: Record<string, PlaySnapshotEntry> | null;
  enterPlayMode: () => void;
  exitPlayMode: () => void;

  // ---- export ----
  exportedId: string | null;
  isExportModalOpen: boolean;
  openExportModal: () => void;
  closeExportModal: () => void;
}

const DEFAULT_ROTATION: Vector3Tuple = [0, 0, 0];
const DEFAULT_SCALE: Vector3Tuple = [1, 1, 1];

/** Finds a scene by id in a scenes array, falling back to the first scene. */
function findScene(scenes: SceneData[], sceneId: string | null): SceneData | undefined {
  return scenes.find((s) => s.id === sceneId) ?? scenes[0];
}

/** Writes `objects`/`scripts` back into their owning scene within the scenes array. */
function commitCurrentSceneInto(
  scenes: SceneData[],
  sceneId: string | null,
  objects: SceneObjectState[],
  scripts: Record<string, BlockNode[]>
): SceneData[] {
  return scenes.map((s) => (s.id === sceneId ? { ...s, objects, scripts } : s));
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  projectId: null,
  isLoadingProject: false,
  loadProject: async (projectId) => {
    set({ isLoadingProject: true });
    const data: ProjectSceneData | undefined = await useProjectsStore.getState().getScene(projectId);
    const scenes = data?.scenes && data.scenes.length > 0 ? data.scenes : [createEmptyScene()];
    const activeScene = findScene(scenes, data?.activeSceneId ?? null);
    set({
      projectId,
      scenes,
      sceneId: activeScene?.id ?? scenes[0].id,
      objects: activeScene?.objects ?? [],
      scripts: activeScene?.scripts ?? {},
      selectedId: null,
      scriptTargetId: null,
      mode: "edit",
      isPlaying: false,
      snapshotBeforePlay: null,
      contextMenu: null,
      isLoadingProject: false,
    });
  },
  saveProject: () => {
    const { projectId, scenes, sceneId, objects, scripts } = get();
    if (!projectId) return;
    const committed = commitCurrentSceneInto(scenes, sceneId, objects, scripts);
    void useProjectsStore.getState().saveScene(projectId, {
      scenes: committed,
      activeSceneId: sceneId ?? committed[0].id,
    });
  },

  scenes: [],
  sceneId: null,
  switchScene: (nextSceneId) =>
    set((state) => {
      if (nextSceneId === state.sceneId) return {};
      const committed = commitCurrentSceneInto(state.scenes, state.sceneId, state.objects, state.scripts);
      const next = findScene(committed, nextSceneId);
      if (!next) return {};
      return {
        scenes: committed,
        sceneId: next.id,
        objects: next.objects,
        scripts: next.scripts,
        selectedId: null,
        scriptTargetId: null,
        activeQuickPanel: null,
        contextMenu: null,
      };
    }),
  addScene: () =>
    set((state) => {
      const committed = commitCurrentSceneInto(state.scenes, state.sceneId, state.objects, state.scripts);
      const newScene = createEmptyScene(`Scene ${committed.length + 1}`);
      return {
        scenes: [...committed, newScene],
        sceneId: newScene.id,
        objects: newScene.objects,
        scripts: newScene.scripts,
        selectedId: null,
        scriptTargetId: null,
      };
    }),
  duplicateScene: (sceneIdToClone) =>
    set((state) => {
      const committed = commitCurrentSceneInto(state.scenes, state.sceneId, state.objects, state.scripts);
      const source = committed.find((s) => s.id === sceneIdToClone);
      if (!source) return {};
      const clone = cloneSceneWithFreshIds(source, `${source.name} copy`);
      return {
        scenes: [...committed, clone],
        sceneId: clone.id,
        objects: clone.objects,
        scripts: clone.scripts,
        selectedId: null,
        scriptTargetId: null,
      };
    }),
  removeScene: (sceneIdToRemove) =>
    set((state) => {
      const committed = commitCurrentSceneInto(state.scenes, state.sceneId, state.objects, state.scripts);
      if (committed.length <= 1) return {}; // never delete the last scene
      const index = committed.findIndex((s) => s.id === sceneIdToRemove);
      if (index === -1) return {};
      const remaining = committed.filter((s) => s.id !== sceneIdToRemove);
      const wasActive = state.sceneId === sceneIdToRemove;
      const nextActive = wasActive ? remaining[Math.min(index, remaining.length - 1)] : findScene(remaining, state.sceneId);
      return {
        scenes: remaining,
        sceneId: nextActive?.id ?? remaining[0].id,
        objects: wasActive ? nextActive?.objects ?? [] : state.objects,
        scripts: wasActive ? nextActive?.scripts ?? {} : state.scripts,
        selectedId: wasActive ? null : state.selectedId,
      };
    }),
  renameScene: (sceneIdToRename, name) =>
    set((state) => ({
      scenes: state.scenes.map((s) => (s.id === sceneIdToRename ? { ...s, name: name.trim() || s.name } : s)),
    })),

  mode: "edit",
  setMode: (mode) => {
    const state = get();
    if (mode === "play" && state.mode !== "play") {
      state.enterPlayMode();
      return;
    }
    if (mode !== "play" && state.mode === "play") {
      state.exitPlayMode();
      set({ mode });
      return;
    }
    set({ mode });
  },

  objects: [],
  addObject: (modelType, position) => {
    const id = createId("obj");
    const def = getAssetDefinition(modelType);
    const object: SceneObjectState = {
      id,
      modelType,
      name: def?.label ?? modelType,
      position,
      rotation: DEFAULT_ROTATION,
      scale: DEFAULT_SCALE,
    };
    set((state) => ({ objects: [...state.objects, object] }));
    return id;
  },
  updateObject: (id, patch) =>
    set((state) => ({
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, ...patch } : obj)),
    })),
  removeObject: (id) =>
    set((state) => {
      const restScripts = { ...state.scripts };
      delete restScripts[id];
      return {
        objects: state.objects.filter((obj) => obj.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
        scriptTargetId: state.scriptTargetId === id ? null : state.scriptTargetId,
        scripts: restScripts,
      };
    }),
  duplicateObject: (id) =>
    set((state) => {
      const source = state.objects.find((obj) => obj.id === id);
      if (!source) return {};
      const newId = createId("obj");
      const clone: SceneObjectState = {
        ...source,
        id: newId,
        position: [source.position[0] + 0.75, source.position[1], source.position[2] + 0.75],
      };
      const sourceScript = state.scripts[id];
      const nextScripts = sourceScript
        ? { ...state.scripts, [newId]: cloneBlocks(sourceScript) }
        : state.scripts;
      return {
        objects: [...state.objects, clone],
        selectedId: newId,
        scripts: nextScripts,
      };
    }),

  selectedId: null,
  select: (id) => set({ selectedId: id, activeQuickPanel: null }),
  transformTool: "translate",
  setTransformTool: (tool) => set({ transformTool: tool }),

  contextMenu: null,
  openContextMenu: (objectId, x, y) => set({ contextMenu: { objectId, x, y }, selectedId: objectId }),
  closeContextMenu: () => set({ contextMenu: null }),

  activeQuickPanel: null,
  setActiveQuickPanel: (panel) => set({ activeQuickPanel: panel }),

  toggleLock: (id) =>
    set((state) => ({
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, locked: !obj.locked } : obj)),
    })),

  attachPickingForId: null,
  startAttachPicking: (id) => set({ attachPickingForId: id, selectedId: null }),
  cancelAttachPicking: () => set({ attachPickingForId: null }),
  attachObjectTo: (childId, parentId) =>
    set((state) => ({
      objects: state.objects.map((obj) => (obj.id === childId ? { ...obj, parentId } : obj)),
      attachPickingForId: null,
      selectedId: childId,
    })),
  detachObject: (id) =>
    set((state) => ({
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, parentId: null } : obj)),
    })),

  scripts: {},
  scriptTargetId: null,
  setScriptTarget: (id) => set({ scriptTargetId: id }),
  setScript: (objectId, blocks) =>
    set((state) => ({ scripts: { ...state.scripts, [objectId]: blocks } })),

  isPlaying: false,
  snapshotBeforePlay: null,
  enterPlayMode: () => {
    const { objects } = get();
    const snapshot: Record<string, PlaySnapshotEntry> = {};
    for (const obj of objects) {
      snapshot[obj.id] = {
        position: obj.position,
        rotation: obj.rotation,
        scale: obj.scale,
      };
    }
    set({ isPlaying: true, mode: "play", snapshotBeforePlay: snapshot, selectedId: null });
  },
  exitPlayMode: () => {
    const { snapshotBeforePlay, objects } = get();
    if (snapshotBeforePlay) {
      const restored = objects.map((obj) =>
        snapshotBeforePlay[obj.id] ? { ...obj, ...snapshotBeforePlay[obj.id] } : obj
      );
      set({ objects: restored });
    }
    set({ isPlaying: false, snapshotBeforePlay: null });
  },

  exportedId: null,
  isExportModalOpen: false,
  openExportModal: () =>
    set((state) => ({
      exportedId: state.exportedId ?? createId("scene"),
      isExportModalOpen: true,
    })),
  closeExportModal: () => set({ isExportModalOpen: false }),
}));

// Auto-persist scene edits to the owning project. Skipped while Play Mode is
// actively animating (isPlaying) since transform updates there are transient
// tween frames, not authored edits — the pre-play snapshot is what gets saved.
let previousObjects = useEditorStore.getState().objects;
let previousScripts = useEditorStore.getState().scripts;
let previousScenes = useEditorStore.getState().scenes;
useEditorStore.subscribe((state) => {
  if (state.isPlaying) return;
  if (
    state.objects !== previousObjects ||
    state.scripts !== previousScripts ||
    state.scenes !== previousScenes
  ) {
    previousObjects = state.objects;
    previousScripts = state.scripts;
    previousScenes = state.scenes;
    state.saveProject();
  }
});

function cloneBlocks(blocks: BlockNode[]): BlockNode[] {
  return blocks.map((block) => ({
    ...block,
    uid: createId("blk"),
    params: { ...block.params },
    children: cloneBlocks(block.children),
  }));
}
