export type BlockCategory = "event" | "action" | "control" | "speech" | "physics" | "character";

export type BlockType =
  | "event.onClick"
  | "action.moveBy"
  | "action.rotate"
  | "action.playAnimation"
  | "control.wait"
  | "control.loop"
  | "speech.say"
  | "physics.enableGravity"
  | "physics.setBounciness"
  | "character.walkTo"
  | "character.faceTarget"
  | "character.greet"
  | "character.setExpression"
  | "character.changeOutfitColor";

export type BlockParamValue = string | number;

export interface BlockParamSpec {
  key: string;
  label: string;
  type: "number" | "select" | "text";
  options?: { value: string; label: string }[];
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface BlockTemplate {
  type: BlockType;
  category: BlockCategory;
  label: string;
  description: string;
  acceptsChildren: boolean;
  defaultParams: Record<string, BlockParamValue>;
  paramSpecs: BlockParamSpec[];
}

export interface BlockNode {
  uid: string;
  type: BlockType;
  params: Record<string, BlockParamValue>;
  children: BlockNode[];
}
