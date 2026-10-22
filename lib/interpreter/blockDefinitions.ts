import type { BlockTemplate, BlockType } from "./types";

export const BLOCK_TEMPLATES: Record<BlockType, BlockTemplate> = {
  "event.onClick": {
    type: "event.onClick",
    category: "event",
    label: "When [Asset] is clicked",
    description: "Fires whenever this asset is clicked in Play Mode.",
    acceptsChildren: true,
    defaultParams: {},
    paramSpecs: [],
  },
  "action.moveBy": {
    type: "action.moveBy",
    category: "action",
    label: "Move [Asset] by X meters",
    description: "Slides the asset along an axis.",
    acceptsChildren: false,
    defaultParams: { axis: "x", distance: 1 },
    paramSpecs: [
      {
        key: "axis",
        label: "Axis",
        type: "select",
        options: [
          { value: "x", label: "X" },
          { value: "y", label: "Y" },
          { value: "z", label: "Z" },
        ],
      },
      { key: "distance", label: "Distance", type: "number", suffix: "m", step: 0.5 },
    ],
  },
  "action.rotate": {
    type: "action.rotate",
    category: "action",
    label: "Rotate [Asset]",
    description: "Spins the asset around an axis.",
    acceptsChildren: false,
    defaultParams: { axis: "y", degrees: 90 },
    paramSpecs: [
      {
        key: "axis",
        label: "Axis",
        type: "select",
        options: [
          { value: "x", label: "X" },
          { value: "y", label: "Y" },
          { value: "z", label: "Z" },
        ],
      },
      { key: "degrees", label: "Degrees", type: "number", suffix: "°", step: 15 },
    ],
  },
  "action.playAnimation": {
    type: "action.playAnimation",
    category: "action",
    label: "Play animation",
    description: "Plays a bounce/spin flourish animation on the asset.",
    acceptsChildren: false,
    defaultParams: { animation: "bounce" },
    paramSpecs: [
      {
        key: "animation",
        label: "Animation",
        type: "select",
        options: [
          { value: "bounce", label: "Bounce" },
          { value: "spin", label: "Spin" },
          { value: "pulse", label: "Pulse" },
        ],
      },
    ],
  },
  "control.wait": {
    type: "control.wait",
    category: "control",
    label: "Wait X seconds",
    description: "Pauses this sequence before continuing.",
    acceptsChildren: false,
    defaultParams: { seconds: 1 },
    paramSpecs: [{ key: "seconds", label: "Seconds", type: "number", suffix: "s", step: 0.5, min: 0 }],
  },
  "control.loop": {
    type: "control.loop",
    category: "control",
    label: "Loop",
    description: "Repeats the nested blocks a number of times (0 = forever).",
    acceptsChildren: true,
    defaultParams: { times: 3 },
    paramSpecs: [{ key: "times", label: "Times (0 = forever)", type: "number", min: 0, step: 1 }],
  },
  "speech.say": {
    type: "speech.say",
    category: "speech",
    label: "Say [Asset] speech bubble",
    description: "Shows a speech bubble with text above the asset for a set duration.",
    acceptsChildren: false,
    defaultParams: { text: "Hello!", seconds: 2 },
    paramSpecs: [
      { key: "text", label: "Text", type: "text" },
      { key: "seconds", label: "Duration", type: "number", suffix: "s", step: 0.5, min: 0.5 },
    ],
  },
  "physics.enableGravity": {
    type: "physics.enableGravity",
    category: "physics",
    label: "Enable gravity on [Asset]",
    description: "Turns on falling/gravity simulation for this asset in Play Mode.",
    acceptsChildren: false,
    defaultParams: { enabled: "on" },
    paramSpecs: [
      {
        key: "enabled",
        label: "Gravity",
        type: "select",
        options: [
          { value: "on", label: "On" },
          { value: "off", label: "Off" },
        ],
      },
    ],
  },
  "physics.setBounciness": {
    type: "physics.setBounciness",
    category: "physics",
    label: "Set bounciness of [Asset]",
    description: "Controls how much the asset bounces when it lands (0 = none, 1 = very bouncy).",
    acceptsChildren: false,
    defaultParams: { value: 0.4 },
    paramSpecs: [{ key: "value", label: "Bounciness", type: "number", min: 0, max: 1, step: 0.1 }],
  },
  "character.walkTo": {
    type: "character.walkTo",
    category: "character",
    label: "Walk [Asset] to [Target]",
    description: "Walks the character toward another object's position, using its Walk clip if it has one.",
    acceptsChildren: false,
    defaultParams: { targetId: "", speed: 1 },
    paramSpecs: [
      { key: "targetId", label: "Target", type: "select", options: [] },
      { key: "speed", label: "Speed", type: "number", suffix: "m/s", step: 0.5, min: 0.5 },
    ],
  },
  "character.faceTarget": {
    type: "character.faceTarget",
    category: "character",
    label: "Turn [Asset] to face [Target]",
    description: "Rotates the character in place to look toward another object.",
    acceptsChildren: false,
    defaultParams: { targetId: "" },
    paramSpecs: [{ key: "targetId", label: "Target", type: "select", options: [] }],
  },
  "character.greet": {
    type: "character.greet",
    category: "character",
    label: "[Asset] waves hello",
    description: "Plays a friendly waving/greeting gesture.",
    acceptsChildren: false,
    defaultParams: {},
    paramSpecs: [],
  },
  "character.setExpression": {
    type: "character.setExpression",
    category: "character",
    label: "[Asset] shows expression",
    description: "Gives the character a quick mood cue (happy, sad, surprised, angry).",
    acceptsChildren: false,
    defaultParams: { expression: "happy" },
    paramSpecs: [
      {
        key: "expression",
        label: "Expression",
        type: "select",
        options: [
          { value: "happy", label: "Happy 😊" },
          { value: "sad", label: "Sad 😢" },
          { value: "surprised", label: "Surprised 😲" },
          { value: "angry", label: "Angry 😠" },
        ],
      },
    ],
  },
  "character.changeOutfitColor": {
    type: "character.changeOutfitColor",
    category: "character",
    label: "Change [Asset]'s outfit color",
    description: "Recolors the character (stylized-primitive characters only).",
    acceptsChildren: false,
    defaultParams: { color: "#8b5cf6" },
    paramSpecs: [{ key: "color", label: "Color", type: "select", options: [] }],
  },
};

export const BLOCK_CATEGORY_ORDER: {
  category: "event" | "action" | "control" | "speech" | "physics" | "character";
  label: string;
}[] = [
  { category: "event", label: "Events" },
  { category: "action", label: "Actions" },
  { category: "control", label: "Control" },
  { category: "character", label: "Character" },
  { category: "speech", label: "Speech" },
  { category: "physics", label: "Physics" },
];

export function getTemplatesByCategory(
  category: "event" | "action" | "control" | "speech" | "physics" | "character"
): BlockTemplate[] {
  return Object.values(BLOCK_TEMPLATES).filter((t) => t.category === category);
}
