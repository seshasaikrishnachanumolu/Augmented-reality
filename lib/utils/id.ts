import { nanoid } from "nanoid";

export function createId(prefix?: string): string {
  const id = nanoid(10);
  return prefix ? `${prefix}-${id}` : id;
}
