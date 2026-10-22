# Implementation Plan

- [ ] 1. Scaffold Next.js project (TypeScript, App Router, Tailwind, ESLint)
- [ ] 2. Install dependencies: three, @react-three/fiber, @react-three/drei, framer-motion, zustand, qrcode, nanoid
- [ ] 3. Define shared types (`types/scene.ts`, `lib/interpreter/types.ts`)
- [ ] 4. Implement Zustand editor store (`lib/store/editorStore.ts`) with objects/selection/mode/scripts/play snapshot/export state
- [ ] 5. Implement UI primitives (`components/ui/Button.tsx`, `IconButton.tsx`, `Panel.tsx`) and Tailwind theme tokens
- [ ] 6. Implement `EditorShell` + `TopNavbar` + `LeftSidebar` layout skeleton with entry animations
- [ ] 7. Implement asset catalog + `AssetCategory`/`AssetCard` with expand animation and native drag start
- [ ] 8. Implement `Stage` (R3F Canvas, lights, grid/floor, drop-to-place raycast) and `CameraRig` (OrbitControls)
- [ ] 9. Implement `SceneObject`/`PrimitiveModel` with selection highlight, click-select, context menu trigger
- [ ] 10. Implement `TransformGizmo` bound to selection with W/E/R keybinds and orbit-disable-while-dragging
- [ ] 11. Implement `ContextMenu` (Delete/Duplicate/Open Script) as HTML overlay
- [ ] 12. Implement block definitions + `BlockPalette` + `BlockWorkspace` + `BlockView` (drag-drop, params, nesting, delete)
- [ ] 13. Implement `BlockEditorPanel` slide-out wired to Code Mode + scriptTargetId
- [ ] 14. Implement interpreter (`lib/interpreter/runner.ts`) and wire Play Mode enter/exit + click execution in `SceneObject`
- [ ] 15. Implement `ExportModal` + `QRCode` + navbar Export button + store actions
- [ ] 16. Implement `/ar/[id]` route with `ARViewer` (model-viewer script load, secure-context guard, permission button, error states)
- [ ] 17. Add sample glTF/public assets or fallback primitive for AR route
- [ ] 18. Run `npm run build`, fix type/lint errors, smoke-test dev server
