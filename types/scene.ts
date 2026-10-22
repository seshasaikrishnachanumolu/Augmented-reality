export type ModelType =
  | "character-explorer"
  | "character-robot"
  | "character-adventurer"
  | "character-wizard"
  | "character-knight"
  | "character-astronaut"
  | "character-pirate"
  | "character-ninja"
  | "character-chef"
  | "character-mermaid"
  | "character-genie"
  | "character-vampire"
  | "character-scientist"
  | "character-farmer"
  | "character-doctor"
  | "character-artist"
  | "character-firefighter"
  | "character-detective"
  | "character-skier"
  | "character-dancer"
  | "animal-fox"
  | "animal-bird"
  | "animal-cat"
  | "animal-rabbit"
  | "animal-turtle"
  | "animal-dog"
  | "animal-owl"
  | "animal-fish"
  | "animal-frog"
  | "animal-elephant"
  | "animal-panda"
  | "animal-squirrel"
  | "animal-penguin"
  | "animal-deer"
  | "animal-bear"
  | "animal-sheep"
  | "animal-horse"
  | "animal-snail"
  | "animal-butterfly"
  | "animal-bee"
  | "building-house"
  | "building-tower"
  | "building-bridge"
  | "building-fence"
  | "building-windmill"
  | "building-barn"
  | "building-lighthouse"
  | "building-tent"
  | "building-well"
  | "building-castle"
  | "building-cabin"
  | "building-greenhouse"
  | "building-silo"
  | "building-shed"
  | "building-gazebo"
  | "building-dock"
  | "building-chimney"
  | "building-gate"
  | "building-stable"
  | "building-treehouse"
  | "nature-tree"
  | "nature-rock"
  | "nature-bush"
  | "nature-flower"
  | "nature-mushroom"
  | "nature-cactus"
  | "nature-log"
  | "nature-pond"
  | "nature-campfire"
  | "nature-waterfall"
  | "nature-beehive"
  | "nature-vine"
  | "nature-grasstuft"
  | "nature-boulder"
  | "nature-palmtree"
  | "nature-snowpile"
  | "nature-puddle"
  | "nature-reed"
  | "nature-stump"
  | "nature-berrybush";

export type AssetCategoryId = "characters" | "animals" | "buildings" | "nature";

/** A primitive-geometry asset rendered procedurally (no external file). */
export interface PrimitiveModelSource {
  kind: "primitive";
}

/** A real glTF asset loaded from a URL, optionally with baked animation clips. */
export interface GltfModelSource {
  kind: "gltf";
  url: string;
  /** Uniform scale applied so the model fits roughly a 1-2m footprint. */
  fitScale: number;
  /** Names of baked animation clips this model exposes, if any. */
  clips?: string[];
  /** Clip to auto-play as a gentle idle loop while in Edit/Code mode, if any. */
  idleClip?: string;
  attribution: string;
}

export type ModelSource = PrimitiveModelSource | GltfModelSource;

export interface AssetDefinition {
  modelType: ModelType;
  category: AssetCategoryId;
  label: string;
  color: string;
  /** Small emoji preview shown on the asset card instead of a letter badge. */
  icon: string;
  description: string;
  source: ModelSource;
}

export type Vector3Tuple = [number, number, number];

export interface SceneObjectState {
  id: string;
  modelType: ModelType;
  name: string;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  /** Override color for primitive-geometry models (ignored by real glTF assets). */
  color?: string;
  /** Locked objects can't be selected/transformed on the stage until unlocked. */
  locked?: boolean;
  /** If set, this object's position/rotation is relative to its parent object. */
  parentId?: string | null;
  /** Physics: when true, the object falls under simulated gravity in Play Mode. */
  gravityEnabled?: boolean;
  /** Physics: 0 = no bounce, 1 = near-full-energy bounce on ground contact. */
  bounciness?: number;
}

export type QuickPanel = "animation" | "material" | null;

export interface SceneData {
  id: string;
  name: string;
  objects: SceneObjectState[];
  scripts: Record<string, import("@/lib/interpreter/types").BlockNode[]>;
}

export type EditorMode = "edit" | "code" | "play";

export type TransformTool = "translate" | "rotate" | "scale";

export interface ProjectSummary {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectSceneData {
  scenes: SceneData[];
  activeSceneId: string;
}

/** Pre-refactor shape, kept only so old localStorage data can be migrated on load. */
export interface LegacyProjectSceneData {
  objects: SceneObjectState[];
  scripts: Record<string, import("@/lib/interpreter/types").BlockNode[]>;
}
