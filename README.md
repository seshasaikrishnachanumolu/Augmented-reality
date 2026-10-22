# CospaceStudio

A CoSpaces-inspired web app for building interactive 3D and AR spaces: drag assets onto a 3D stage, transform them, script their behavior with visual blocks, preview it in Play Mode, and export a shareable WebAR link.

Built with Next.js (App Router), TypeScript, Tailwind CSS, React Three Fiber + drei, Framer Motion, and Zustand.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the editor. Open `/ar/<any-id>` on a phone (over HTTPS) to preview the mobile AR viewer.

## Project structure

```
app/
  page.tsx              Editor route
  ar/[id]/page.tsx       Mobile AR viewer route
components/
  layout/                 TopNavbar, LeftSidebar, EditorShell
  assets/                  Asset library (categories + draggable cards)
  canvas/                  R3F Stage, SceneObject, TransformGizmo, ContextMenu
  blocks/                  Block palette, workspace, per-object script editor
  webar/                   Export modal + QR code
  ar/                      Mobile <model-viewer> AR viewer
  ui/                      Shared Button/IconButton/Panel primitives
lib/
  store/editorStore.ts     Zustand store — single source of truth
  interpreter/             Block script types, definitions, and runner
  assetLibrary.ts          Static asset catalog
types/scene.ts             Shared scene/object types
.kiro/specs/ar-editor/     Requirements (EARS), design, and task docs
```

## Modes

- **Edit Mode** — drag assets from the left sidebar onto the stage, click to select, use the gizmo (W translate / E rotate / R scale) to transform, right-click for Delete / Duplicate / Open Script.
- **Code Mode** — opens a 40%-width block workspace. Drag Event, Action, and Control blocks to build a script for the selected asset.
- **Play Mode** — runs each asset's script; click a scripted asset to trigger its "on click" behavior. Exiting Play Mode restores original transforms.

## Notes on scope

This is a prototype: 3D assets are stylized primitive geometry (no external GLB pipeline), and the WebAR route renders a bundled sample model rather than a persisted per-scene export, since there's no backend/storage layer in this build.
