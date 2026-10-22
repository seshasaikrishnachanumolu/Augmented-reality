import type { SceneData } from "@/types/scene";
import type { BlockNode } from "@/lib/interpreter/types";
import { createId } from "@/lib/utils/id";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  scenes: SceneData[];
}

function block(type: BlockNode["type"], params: BlockNode["params"], children: BlockNode[] = []): BlockNode {
  return { uid: createId("blk"), type, params, children };
}

const BLANK_SCENE: SceneData = {
  id: createId("scn"),
  name: "Scene 1",
  objects: [],
  scripts: {},
};

const explorerId = createId("obj");
const foxId = createId("obj");

const CLICK_TO_MOVE_SCENE: SceneData = {
  id: createId("scn"),
  name: "Scene 1",
  objects: [
    {
      id: explorerId,
      modelType: "character-explorer",
      name: "Explorer",
      position: [-1.5, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      id: foxId,
      modelType: "animal-fox",
      name: "Fox",
      position: [1.5, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ],
  scripts: {
    [explorerId]: [
      block("event.onClick", {}, [
        block("speech.say", { text: "Let's explore!", seconds: 1.5 }),
        block("action.moveBy", { axis: "x", distance: 1 }),
        block("action.playAnimation", { animation: "bounce" }),
      ]),
    ],
    [foxId]: [
      block("event.onClick", {}, [
        block("action.playAnimation", { animation: "Run" }),
        block("control.wait", { seconds: 0.5 }),
        block("action.rotate", { axis: "y", degrees: 180 }),
      ]),
    ],
  },
};

const introScene: SceneData = {
  id: createId("scn"),
  name: "Intro",
  objects: [
    {
      id: createId("obj"),
      modelType: "building-house",
      name: "House",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ],
  scripts: {},
};

const outroScene: SceneData = {
  id: createId("scn"),
  name: "Outro",
  objects: [
    {
      id: createId("obj"),
      modelType: "building-tower",
      name: "Tower",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ],
  scripts: {},
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Blank CoSpace",
    description: "Start from an empty stage with a single scene.",
    icon: "✨",
    color: "#8b5cf6",
    scenes: [BLANK_SCENE],
  },
  {
    id: "click-to-move",
    name: "Click to Interact",
    description: "An explorer and a fox with click-triggered movement, speech, and animation already scripted.",
    icon: "🕹️",
    color: "#14b8a6",
    scenes: [CLICK_TO_MOVE_SCENE],
  },
  {
    id: "multi-scene-tour",
    name: "Two-Scene Tour",
    description: "A starter project with two linked scenes, demonstrating the scene switcher.",
    icon: "🎬",
    color: "#f59e0b",
    scenes: [introScene, outroScene],
  },
];

export function getTemplate(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((t) => t.id === id);
}
