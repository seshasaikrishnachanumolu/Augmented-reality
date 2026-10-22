# Design Document

## Overview

A Next.js App Router application implementing a CoSpaces-style 3D/AR scene editor. The editor route (`/`) renders a desktop shell with navbar, asset sidebar, R3F canvas, and a conditional block-coding sidebar. A separate mobile route (`/ar/[id]`) renders a minimal `<model-viewer>`-based AR viewer.

State is centralized in a Zustand store so the Canvas, BlockEditor, and Navbar all read/write the same source of truth without prop drilling.

## Architecture

```
app/
  layout.tsx                 Root layout (fonts, global CSS)
  page.tsx                   Editor page -> <EditorShell />
  ar/[id]/page.tsx           Mobile AR viewer route
  globals.css

components/
  layout/
    EditorShell.tsx          Top-level grid: Navbar + Sidebar + Stage + BlockEditor
    TopNavbar.tsx             Mode switch + Export button
    LeftSidebar.tsx           Asset library container
  assets/
    AssetCategory.tsx         Expandable category
    AssetCard.tsx              Draggable card
    assetLibrary.ts            Static asset catalog data
  canvas/
    Stage.tsx                  <Canvas> wrapper, lights, grid, drop target
    SceneObjects.tsx            Maps store objects -> <SceneObject>
    SceneObject.tsx              Mesh + selection outline + click/context handlers
    TransformGizmo.tsx           TransformControls bound to selected object
    PrimitiveModel.tsx           Switch on modelType -> primitive geometry
    ContextMenu.tsx               Right click menu (delete/duplicate/script)
    CameraRig.tsx                 OrbitControls wrapper w/ gizmo-drag disable
  blocks/
    BlockEditorPanel.tsx         Right sidebar shell (slide in/out)
    BlockPalette.tsx              Categorized draggable block templates
    BlockWorkspace.tsx            Drop target rendering the script tree
    BlockView.tsx                  Single block renderer (recursive for children)
    blockDefinitions.ts           Block type metadata (label, category, params)
  webar/
    ExportModal.tsx               Modal w/ link + QR
    QRCode.tsx                    Lightweight QR renderer
  ar/
    ARViewer.tsx                  model-viewer wrapper + permission/error states
  ui/
    Button.tsx, IconButton.tsx, Panel.tsx  Shared primitives

lib/
  store/
    editorStore.ts              Zustand store: objects, selection, mode, scripts
  interpreter/
    types.ts                     Block + Script type defs
    runner.ts                     compile + execute engine for Play Mode
  utils/
    id.ts                        id generator
    export.ts                     mock export id / URL builder

types/
  scene.ts                       SceneObject, ModelType
```

## Component Tree (runtime)

```
EditorShell
├── TopNavbar (mode buttons, Export button -> ExportModal)
├── LeftSidebar
│   └── AssetCategory × 4
│       └── AssetCard × N (draggable)
├── Stage (R3F Canvas)
│   ├── lights (ambient + directional w/ shadow)
│   ├── gridHelper / <Grid>
│   ├── CameraRig (OrbitControls)
│   ├── SceneObjects
│   │   └── SceneObject × N (mesh, outline, onClick, onContextMenu)
│   │       └── TransformGizmo (only for selected, Edit Mode)
│   └── ContextMenu (HTML overlay, positioned absolutely)
└── BlockEditorPanel (visible when mode === 'code', animated width)
    ├── BlockPalette (Events / Actions / Control)
    └── BlockWorkspace (per-object script tree)

app/ar/[id]/page.tsx -> ARViewer (model-viewer, permission gate, error states)
```

## State Model (Zustand)

```ts
type Mode = 'edit' | 'code' | 'play';

interface SceneObjectState {
  id: string;
  modelType: ModelType;       // 'character' | 'animal' | 'building' | 'nature-tree' | etc
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface EditorStore {
  mode: Mode;
  setMode(mode: Mode): void;

  objects: SceneObjectState[];
  addObject(modelType: ModelType, position: [number,number,number]): string; // returns new id
  updateObject(id: string, patch: Partial<SceneObjectState>): void;
  removeObject(id: string): void;
  duplicateObject(id: string): void;

  selectedId: string | null;
  select(id: string | null): void;

  transformTool: 'translate' | 'rotate' | 'scale';
  setTransformTool(tool): void;

  scripts: Record<string, BlockNode[]>;   // objectId -> top-level blocks (events)
  scriptTargetId: string | null;           // which object's script BlockEditor shows
  setScriptTarget(id: string | null): void;
  setScript(objectId: string, blocks: BlockNode[]): void;

  // play mode snapshot/restore
  snapshotBeforePlay: Record<string, Pick<SceneObjectState,'position'|'rotation'|'scale'>> | null;
  enterPlayMode(): void;
  exitPlayMode(): void;

  exportedId: string | null;
  isExportModalOpen: boolean;
  openExportModal(): void;
  closeExportModal(): void;
}
```

Rationale: a single store avoids sync issues between the canvas (which needs live object transforms) and the block editor (which needs to know which object is targeted and its script). `scripts` is keyed by object id so switching selection/target swaps the visible workspace content per requirement 7.8.

## Block / Script Data Model

```ts
type BlockCategory = 'event' | 'action' | 'control';

type BlockType =
  | 'event.onClick'
  | 'action.moveBy'
  | 'action.rotate'
  | 'action.playAnimation'
  | 'control.wait'
  | 'control.loop';

interface BlockNode {
  uid: string;
  type: BlockType;
  params: Record<string, string | number>;
  children: BlockNode[]; // nested blocks (event bodies, loop bodies)
}
```

Palette defines a template per `BlockType` (label, category, default params, param field specs, whether it accepts children). `BlockWorkspace` renders the persisted `BlockNode[]` tree for `scriptTargetId`, allowing drag-from-palette-to-append and delete-with-children.

## Interpreter Design

`lib/interpreter/runner.ts` exposes:

```ts
function compileScript(blocks: BlockNode[]): CompiledEvent[];
function runObjectScript(
  object: SceneObjectState,
  compiled: CompiledEvent[],
  handlers: { getLive: () => SceneObjectState; applyTransform: (patch) => void }
): { dispose(): void; triggerClick(): void };
```

- `compileScript` walks top-level `event.onClick` blocks and returns their action-block children as an executable list (the interpreter itself walks `children` directly rather than compiling to a separate IR, since the tree is already declarative — "compile" here means validating + flattening wait/loop semantics).
- Execution is driven by an async generator/recursive-timeout walker per event trigger: `moveBy`/`rotate` use `requestAnimationFrame` tweening over a fixed duration (default 500ms) via lerp; `wait` uses `setTimeout`; `loop` re-runs its children N times (or while a `running` flag is true for infinite loop), storing every timer/RAF handle in a disposer bag.
- `enterPlayMode()` snapshots current transforms; for each object with a non-empty script, `runObjectScript` is invoked and its `triggerClick` wired to the mesh's `onClick` in `SceneObject` when `mode === 'play'`.
- `exitPlayMode()` calls every `dispose()` (clearing timers/RAFs) then writes `snapshotBeforePlay` back into `objects`, satisfying requirement 8.7.

This keeps the interpreter decoupled from React rendering: it only calls `applyTransform` (which dispatches to the Zustand store), so SceneObject components re-render reactively like any other state-driven update.

## 3D Canvas Details

- `Stage.tsx`: `<Canvas shadows camera={{ position: [6,6,6], fov: 50 }}>`, wrapped in a `<div>` with `onDragOver`/`onDrop` HTML handlers (drag-drop from the asset sidebar is native HTML5 DnD over the canvas DOM element; drop position is computed via a raycast from normalized pointer coords against the ground plane using `THREE.Raycaster`).
- Lighting: `<ambientLight intensity={0.6} />` + `<directionalLight position={[5,8,5]} castShadow intensity={1.2} shadow-mapSize={[2048,2048]} />`.
- Floor: `<Grid>` from drei (infiniteGrid look) plus an invisible large plane (`receiveShadow`) for raycast drop-targeting and shadow catching.
- `CameraRig`: drei `<OrbitControls makeDefault enabled={!isDraggingGizmo} />`. `isDraggingGizmo` is local state toggled by `TransformControls`' `onMouseDown`/`onMouseUp` (or `dragging-changed` event), addressing requirement 4.4.
- `SceneObject`: primitive meshes (box/cone/sphere/cylinder color-coded per modelType, since no external GLB assets are required by the prompt) with `castShadow`/`receiveShadow`; selection highlight via drei `<Outlines>` or an emissive color swap; `onPointerDown` (select), `onContextMenu` (open ContextMenu, `e.nativeEvent.preventDefault()`).
- `TransformGizmo`: drei `<TransformControls object={meshRef} mode={transformTool} onObjectChange={...updateObject}/>`, only mounted when `mode === 'edit' && selectedId`.

## UI / Styling System

- Tailwind config extends a small playful palette (`brand` purple/teal, soft `surface` neutrals), rounded-2xl cards, soft shadows (`shadow-soft`).
- Framer Motion: `EditorShell` fades/slides navbar+sidebar in on mount; `AssetCategory` animates `height`/`opacity` on expand; `AssetCard` has `whileHover={{ scale: 1.04, y: -2 }}`; `ExportModal` and `ContextMenu` use `AnimatePresence` + scale/opacity variants; `BlockEditorPanel` animates `width`/`x` for the slide-out.

## WebAR Export

- `openExportModal()` generates (or reuses) an `exportedId` via `nanoid`-style short id, building URL `${origin}/ar/${exportedId}`.
- `ExportModal` shows the URL in a read-only input with a "Copy Link" button (Clipboard API) and a QR code. QR is generated client-side with a small dependency-free matrix renderer (`qrcode` package) rendered as an SVG/canvas — avoids needing a remote QR API call (no third-party data transmission).
- No backend persistence exists in this prototype; `/ar/[id]` renders a demo AR scene (a placeholder glTF or a primitive fallback) regardless of `id`, since there's no server-side scene storage layer requested. This is called out as a mock in the UI copy ("shareable link", "mock QR").

## Mobile AR Route (`/ar/[id]`)

- Client component; loads `@google/model-viewer` via dynamic `next/script` (module type) since it's a web component with no React types needed.
- Guards, in order: (1) secure-context check (`window.isSecureContext`), (2) `<model-viewer>` custom element definition check after script load (`customElements.whenDefined('model-viewer')`), (3) iOS motion permission button (`DeviceMotionEvent.requestPermission` when present) triggered by explicit tap, per requirement 10.4.
- `<model-viewer>` attributes: `src` (a bundled sample glTF under `/public/models/`), `ar ar-modes="webxr scene-viewer quick-look" camera-controls shadow-intensity="1" alt="AR preview"`.
- Error states rendered as friendly full-screen cards instead of blank output, satisfying 10.3/10.5/10.6.

## Multi-Scene Projects

A project (CoSpace) now contains one or more scenes, each an independent `{ objects, scripts }` pair. Data model shift:

```ts
interface SceneData {
  id: string;
  name: string;
  objects: SceneObjectState[];
  scripts: Record<string, BlockNode[]>;
}

interface ProjectSceneData {
  scenes: SceneData[];
  activeSceneId: string;
}
```

`projectsStore` keeps this shape per project id (replacing the old flat `{ objects, scripts }`). `editorStore` gains `sceneId`/`scenes` state and `switchScene`, `addScene`, `duplicateScene`, `removeScene`, `renameScene` actions; `loadProject`/`saveProject` read/write the whole `scenes` array instead of a single pair. A `SceneSwitcher` tab strip renders under the navbar.

Migration note: existing single-scene projects saved under the old shape are upgraded on load (wrapped into a single `"Scene 1"` entry) so previously created projects don't break.

## Templates Gallery

`lib/templates.ts` defines a small static list of `ProjectTemplate` entries (id, name, description, thumbnail color/icon, and a `scenes: SceneData[]` seed). The gallery page renders a "Templates" section above "My CoSpaces"; selecting one calls `projectsStore.createProjectFromTemplate(template)`, which creates a new project whose scenes are a deep clone of the template's seed data (fresh ids throughout so template instances don't share state), then navigates to its editor.

## Speech Blocks

New block category `speech` with `speech.say` (`text`, `seconds`). Execution: the interpreter's `runBlock` gains a `speech.say` case that calls a new `showSpeech(text, durationMs)` hook (parallel to `playClip`) and awaits its promise; `SceneObject` renders a `SpeechBubble` (`<Html>`-anchored, similar to the quick-panels) while a piece of local state `speechText` is non-null, clearing it via timeout matching Requirement 13.

## Physics Blocks

New block category `physics` with `physics.enableGravity` (`enabled: boolean`) and `physics.setBounciness` (`value: 0-1`). Rather than a full physics engine dependency, gravity is simulated per-object inside the existing RAF-driven interpreter loop: once triggered, a persistent per-object simulation step (separate from the click-triggered action sequence) decrements Y velocity each frame, checks against the ground plane (Y=0) and against other physics-enabled objects' current bounding boxes (simple AABB overlap in XZ to decide "resting on top of"), and applies a bounce impulse scaled by `bounciness` on impact. This runs as its own `disposer`-tracked loop per object, independent of (but coexisting with) click-triggered action sequences, and is torn down on `exitPlayMode` like everything else.

## Testing Strategy (manual, since no test framework requested)

- `npm run build` for type/compile correctness.
- Manual verification checklist executed post-build: mode switching, drag asset onto canvas, transform gizmo modes (W/E/R), context menu actions, block drag-and-append, Play Mode click-trigger behavior + restore-on-exit, export modal copy/QR, `/ar/[id]` renders without a runtime error in a Node/browser preview.
