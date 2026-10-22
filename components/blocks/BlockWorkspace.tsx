"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";
import { BlockView } from "./BlockView";
import { BLOCK_TEMPLATES } from "@/lib/interpreter/blockDefinitions";
import type { BlockNode, BlockType } from "@/lib/interpreter/types";
import { createId } from "@/lib/utils/id";

export function BlockWorkspace() {
  const objects = useEditorStore((s) => s.objects);
  const scriptTargetId = useEditorStore((s) => s.scriptTargetId);
  const setScriptTarget = useEditorStore((s) => s.setScriptTarget);
  const scripts = useEditorStore((s) => s.scripts);
  const setScript = useEditorStore((s) => s.setScript);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const target = objects.find((o) => o.id === scriptTargetId) ?? objects[0] ?? null;
  const blocks = target ? scripts[target.id] ?? [] : [];

  if (!target) {
    return (
      <div className="flex h-full flex-1 items-center justify-center p-6 text-center text-sm text-surface-900/50">
        Add an asset to the stage to start scripting its behavior.
      </div>
    );
  }

  const updateBlocks = (next: BlockNode[]) => setScript(target.id, next);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropTarget(false);
    const blockType = event.dataTransfer.getData("application/x-block-type") as BlockType;
    if (!blockType) return;
    const templ = BLOCK_TEMPLATES[blockType];
    const newBlock: BlockNode = {
      uid: createId("blk"),
      type: blockType,
      params: { ...templ.defaultParams },
      children: [],
    };
    updateBlocks([...blocks, newBlock]);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-surface-900/40">Scripting</p>
          <h3 className="text-sm font-semibold text-surface-900">{target.name}</h3>
        </div>
        {objects.length > 1 && (
          <select
            value={target.id}
            onChange={(e) => setScriptTarget(e.target.value)}
            className="rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs"
          >
            {objects.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDropTarget(true);
        }}
        onDragLeave={() => setIsDropTarget(false)}
        onDrop={handleDrop}
        className={`flex min-h-[240px] flex-1 flex-col gap-3 rounded-2xl border-2 border-dashed p-3 transition-colors ${
          isDropTarget ? "border-brand-400 bg-brand-50" : "border-surface-200 bg-surface-50"
        }`}
      >
        {blocks.length === 0 && (
          <p className="py-8 text-center text-sm text-surface-900/40">
            Drag an <strong>Event</strong> block here to start, then nest Actions and Control blocks
            inside it.
          </p>
        )}
        <AnimatePresence initial={false}>
          {blocks.map((block, index) => (
            <BlockView
              key={block.uid}
              block={block}
              targetLabel={target.name}
              targetModelType={target.modelType}
              currentObjectId={target.id}
              onChange={(updated) => {
                const next = [...blocks];
                next[index] = updated;
                updateBlocks(next);
              }}
              onRemove={() => updateBlocks(blocks.filter((_, i) => i !== index))}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
