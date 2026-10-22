# Requirements Document

## Introduction

This feature is a CoSpaces-inspired web application for creating interactive 3D and AR spaces. Users drag assets from a library onto a 3D stage, manipulate them with transform tools, attach visual block-based logic to them, preview the behavior in Play Mode, and export the finished scene as a WebAR experience viewable on a mobile device via a shareable link and QR code.

The application is built with Next.js (App Router), TypeScript, Tailwind CSS, React Three Fiber + drei, Framer Motion, Zustand for state, and `<model-viewer>` for the mobile AR route.

## Requirements

### Requirement 1: Application Shell & Layout

**User Story:** As a creator, I want a full-screen split layout with a navbar, asset sidebar, and 3D stage, so that I can access all editing tools without leaving the page.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL render a full-viewport layout with a fixed top navbar, a left sidebar, a center 3D stage, and a conditionally visible right sidebar.
2. WHEN the viewport is resized THEN the system SHALL keep the layout occupying 100% of width and height with no page-level scrollbars.
3. WHEN the layout mounts THEN the system SHALL animate the sidebar and navbar into view using Framer Motion entry transitions.
4. IF the user is on a mobile-width viewport for the editor route THEN the system SHALL still render the desktop editor layout (editor is desktop-first; AR viewing is the mobile-first route).

### Requirement 2: Mode Switching (Edit / Code / Play)

**User Story:** As a creator, I want to switch between Edit, Code, and Play modes, so that I can build the scene, script behavior, and preview it separately.

#### Acceptance Criteria

1. WHEN the user clicks a mode button in the top navbar THEN the system SHALL set the active mode to Edit, Code, or Play and visually indicate the active mode.
2. WHEN the active mode is "Code Mode" THEN the system SHALL slide out a right sidebar occupying approximately 40% of viewport width containing the block editor.
3. WHEN the active mode changes away from "Code Mode" THEN the system SHALL slide the right sidebar out of view.
4. WHEN the active mode is "Edit Mode" THEN the system SHALL allow object selection, transform manipulation, and context menu actions on canvas objects.
4. WHEN the active mode is "Play Mode" THEN the system SHALL disable transform controls and execute each object's attached block script via the interpreter.
5. WHEN the user switches out of "Play Mode" THEN the system SHALL stop all running scripts and reset objects to their pre-play transforms.

### Requirement 3: Asset Library (Left Sidebar)

**User Story:** As a creator, I want a categorized, searchable asset library with draggable cards, so that I can quickly find and place objects on the stage.

#### Acceptance Criteria

1. WHEN the left sidebar renders THEN the system SHALL display categories: Characters, Animals, Buildings, and Nature, each collapsed or expanded independently.
2. WHEN the user clicks a category header THEN the system SHALL toggle expand/collapse with an animated height/opacity transition.
3. WHEN a category is expanded THEN the system SHALL render asset cards with a preview icon/color, a label, and a drag handle.
4. WHEN the user starts dragging an asset card THEN the system SHALL initiate a native HTML5 drag operation carrying the asset's model type.
5. WHEN the user hovers an asset card THEN the system SHALL apply a Framer Motion hover scale/elevation effect.
6. WHEN the user drops a dragged asset card onto the 3D stage THEN the system SHALL create a new scene object of that model type at the corresponding drop position.

### Requirement 4: 3D Canvas & Environment

**User Story:** As a creator, I want a realistic, navigable 3D stage, so that I can view and arrange objects in a spatial context.

#### Acceptance Criteria

1. WHEN the center stage renders THEN the system SHALL display a full-size React Three Fiber `<Canvas>` with a ground-plane grid helper.
2. WHEN the scene renders THEN the system SHALL include an ambient light and a shadow-casting directional light, and all placed objects and the floor SHALL receive/cast shadows.
3. WHEN the user drags with the mouse on empty canvas space THEN the system SHALL orbit the camera via drei `OrbitControls`.
4. WHEN a transform gizmo is active and being dragged THEN the system SHALL disable `OrbitControls` to prevent conflicting camera/gizmo drag.
5. THE system SHALL maintain a single global state array of scene objects, where each object has `id`, `modelType`, `position [x,y,z]`, `rotation [x,y,z]`, and `scale [x,y,z]`.
6. WHEN an object is added, transformed, duplicated, or deleted THEN the system SHALL update the global scene objects array as the single source of truth driving the render.

### Requirement 5: Object Selection & Transformation

**User Story:** As a creator, I want to select an object and move/rotate/scale it directly in 3D, so that I can precisely compose my scene.

#### Acceptance Criteria

1. WHEN the user left-clicks an object on the canvas in Edit Mode THEN the system SHALL mark it as the selected object and render a visual highlight (outline/emissive cue) around it.
2. WHEN the user clicks empty canvas space THEN the system SHALL clear the current selection.
3. WHEN an object is selected in Edit Mode THEN the system SHALL attach a drei `TransformControls` gizmo to that object, defaulting to translate mode.
4. WHEN the user presses "W", "E", or "R" THEN the system SHALL switch the gizmo to translate, rotate, or scale mode respectively.
5. WHEN the user drags the gizmo THEN the system SHALL update that object's position/rotation/scale in the global state in real time.
6. IF no object is selected THEN the system SHALL NOT render a `TransformControls` gizmo.

### Requirement 6: Context Menu Actions

**User Story:** As a creator, I want to right-click an object for quick actions, so that I can delete, duplicate, or script it without extra clicks.

#### Acceptance Criteria

1. WHEN the user right-clicks an object on the canvas THEN the system SHALL prevent the native browser context menu and open a custom context menu at the cursor position.
2. WHEN the context menu is open THEN the system SHALL offer "Delete", "Duplicate", and "Open Script" actions.
3. WHEN the user selects "Delete" THEN the system SHALL remove the object from the global state and close the menu.
4. WHEN the user selects "Duplicate" THEN the system SHALL create a copy of the object offset slightly in position with a new unique id.
5. WHEN the user selects "Open Script" THEN the system SHALL switch the application to Code Mode and set the block editor's active target to that object.
6. WHEN the user clicks outside the open context menu THEN the system SHALL close it.

### Requirement 7: Block-Based Logic Editor (Code Mode)

**User Story:** As a creator, I want to compose behavior visually from blocks, so that I can script object interactivity without writing code.

#### Acceptance Criteria

1. WHEN Code Mode is active THEN the system SHALL render a right sidebar with a block palette grouped into "Events", "Actions", and "Control" categories.
2. THE Events category SHALL include at least "When [Asset] is clicked".
3. THE Actions category SHALL include at least "Move [Asset] by X meters", "Rotate [Asset]", and "Play animation".
4. THE Control category SHALL include at least "Wait X seconds" and "Loop".
5. WHEN the user drags a block from the palette into the workspace THEN the system SHALL add it to the script for the currently targeted object, nested under an event block if dropped inside one.
6. WHEN a block has configurable parameters (asset target, distance, axis, duration, seconds, loop count) THEN the system SHALL render inline inputs for those parameters on the block.
7. WHEN the user removes a block from the workspace THEN the system SHALL delete it and any of its nested child blocks.
8. THE system SHALL persist each object's block script keyed by object id in the global state so switching the targeted object shows that object's own script.

### Requirement 8: Script Interpreter & Play Mode Execution

**User Story:** As a creator, I want my block scripts to actually run when I hit Play, so that I can verify the interactive behavior.

#### Acceptance Criteria

1. WHEN the user activates Play Mode THEN the system SHALL compile each scene object's block script into an executable action sequence.
2. WHEN a compiled script contains a "When clicked" event THEN the system SHALL bind a click handler on that object during Play Mode that triggers the nested action sequence.
3. WHEN an action sequence executes a "Move by X" block THEN the system SHALL animate the object's position by the specified delta over a fixed duration.
4. WHEN an action sequence executes a "Rotate" block THEN the system SHALL animate the object's rotation on the specified axis by the specified degrees.
5. WHEN an action sequence executes a "Wait X seconds" block THEN the system SHALL pause that sequence's execution for X seconds before continuing.
6. WHEN an action sequence executes a "Loop N times" block THEN the system SHALL repeat its nested blocks N times sequentially (or indefinitely if configured as infinite) until Play Mode ends.
7. WHEN Play Mode is exited THEN the system SHALL cancel all pending timers/animations spawned by the interpreter and restore each object's original transform.
8. IF an object has no script THEN the system SHALL leave it static and unaffected during Play Mode.

### Requirement 9: WebAR Export

**User Story:** As a creator, I want to export my scene to a shareable AR link and QR code, so that others can view it in AR on their phones.

#### Acceptance Criteria

1. WHEN the user clicks "Export to WebAR" in the navbar THEN the system SHALL open a modal displaying a generated shareable URL of the form `/ar/[id]`.
2. WHEN the export modal renders THEN the system SHALL display a QR code image encoding that shareable URL.
3. WHEN the user clicks "Copy Link" THEN the system SHALL copy the URL to the clipboard and show a confirmation state.
4. WHEN the user closes the modal THEN the system SHALL animate it out and remove it from the DOM.
5. THE modal SHALL animate in/out using Framer Motion with a backdrop overlay.

### Requirement 10: Mobile AR Viewer Route

**User Story:** As an end viewer, I want to open the shared link on my phone and see the scene in AR, so that I can experience it in my physical space.

#### Acceptance Criteria

1. WHEN a user navigates to `/ar/[id]` THEN the system SHALL render a mobile-responsive full-screen page hosting a `<model-viewer>` element.
2. THE `<model-viewer>` element SHALL be configured with `ar`, `ar-modes="webxr scene-viewer quick-look"`, `camera-controls`, and `shadow-intensity="1"` attributes.
3. WHEN the page loads over a non-secure context (not HTTPS and not localhost) THEN the system SHALL display an error UI explaining that AR requires a secure context, without attempting to load the AR session.
4. WHEN device motion/orientation permission is required (iOS Safari) THEN the system SHALL request permission via a user-initiated button tap and show a helpful message if permission is denied.
5. IF the browser does not support WebXR, Scene Viewer, or Quick Look THEN the system SHALL show a fallback message indicating AR viewing is unavailable on this device while still allowing 3D model preview via camera-controls.
6. WHEN the `<model-viewer>` script fails to load or errors THEN the system SHALL display a friendly error state instead of a blank screen.

### Requirement 11: Multi-Scene Projects

**User Story:** As a creator, I want a project to contain multiple scenes, so that I can build a multi-part experience (like slides) within one CoSpace.

#### Acceptance Criteria

1. THE system SHALL model a project as a collection of one or more named scenes, each with its own independent objects array and per-object scripts.
2. WHEN a project is created THEN the system SHALL initialize it with exactly one default scene.
3. WHEN the editor loads a project THEN the system SHALL render a scene switcher strip listing all scenes in the project with the active scene highlighted.
4. WHEN the user clicks a scene tab THEN the system SHALL switch the stage, asset selection, and block editor to that scene's data.
5. WHEN the user adds a new scene THEN the system SHALL create it with an empty objects array and switch to it.
6. WHEN the user duplicates a scene THEN the system SHALL copy its objects and scripts into a new scene with a new id.
7. WHEN the user deletes a scene AND more than one scene remains THEN the system SHALL remove it and switch to an adjacent scene.
8. IF the user attempts to delete the only remaining scene THEN the system SHALL prevent the deletion.
9. WHEN the user renames a scene THEN the system SHALL persist the new name and reflect it in the scene switcher.

### Requirement 12: Templates Gallery

**User Story:** As a creator, I want to start a new CoSpace from a template, so that I don't always have to build from a blank stage.

#### Acceptance Criteria

1. WHEN the user opens the gallery page THEN the system SHALL offer a "Templates" section distinct from "My CoSpaces", showing a fixed set of starter templates with a name, description, and preview thumbnail.
2. WHEN the user selects a template THEN the system SHALL create a new project pre-populated with that template's scene(s), objects, and scripts, and navigate to its editor.
3. THE system SHALL include at least one template covering each of: an empty/blank starter, a simple interactive scene demonstrating click-to-move behavior, and a multi-scene example.

### Requirement 13: Speech Blocks

**User Story:** As a creator, I want an object to display a speech bubble with text, so that I can create dialogue-driven interactions.

#### Acceptance Criteria

1. THE Code Mode block palette SHALL include a "Speech" category with a "Say [text] for X seconds" block.
2. WHEN a "Say" block executes during Play Mode THEN the system SHALL render a speech-bubble overlay anchored above the object, containing the configured text.
3. WHEN the configured duration elapses THEN the system SHALL remove the speech bubble automatically.
4. WHEN Play Mode is exited while a speech bubble is visible THEN the system SHALL remove it immediately.
5. THE "Say" block SHALL support being sequenced after Wait/Loop control blocks like any other action block.

### Requirement 14: Physics Blocks

**User Story:** As a creator, I want basic physics behavior (gravity, falling, simple collisions), so that objects can interact more naturally without manual scripting of every movement.

#### Acceptance Criteria

1. THE Code Mode block palette SHALL include a "Physics" category with at least "Enable gravity" and "Set bounciness" blocks.
2. WHEN an object's script enables gravity AND Play Mode is active THEN the system SHALL continuously decrease the object's Y position over time until it reaches the ground plane (Y = 0 plus the object's resting offset).
3. WHEN a falling object reaches the ground plane THEN the system SHALL stop its fall and, if bounciness is greater than zero, apply a decaying bounce effect.
4. WHEN two objects with gravity/physics enabled occupy overlapping bounding volumes THEN the system SHALL treat this as a simple collision and stop further downward movement of the upper object at the point of contact (resting on top), without full rigid-body simulation.
5. WHEN Play Mode is exited THEN the system SHALL cancel all physics simulation and restore pre-play transforms, consistent with Requirement 8.7.

## Non-Functional Notes

- Styling: Tailwind CSS utility classes, playful rounded-corner + soft-shadow visual language, consistent color tokens.
- Animation: Framer Motion for all UI chrome transitions (sidebars, modal, hover, context menu); R3F's own render loop drives 3D animation.
- State: Zustand store(s) as the single source of truth for scene objects, selection, mode, and per-object scripts.
- Modularity: Component tree organized as Layout, Canvas (Stage/SceneObject/TransformGizmo), BlockEditor (Palette/Workspace/Block), ARView, and shared UI primitives.
