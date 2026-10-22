"use client";

import type { CallPhase } from "@/lib/call/useCallSignaling";

interface CallStatusOverlayProps {
  phase: CallPhase;
  remoteAccountId: string | null;
  onCancel: () => void;
}

/** Small "Calling…" banner with a cancel/hang-up action, shown while ringing. */
export function CallStatusOverlay({ phase, remoteAccountId, onCancel }: CallStatusOverlayProps) {
  if (phase !== "calling") return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/85 p-6 text-center text-white">
      <div className="h-14 w-14 animate-pulse rounded-full bg-brand-500" />
      <div>
        <p className="text-lg font-semibold">Calling…</p>
        <p className="mt-1 font-mono text-xs text-white/40">{remoteAccountId}</p>
      </div>
      <button
        onClick={onCancel}
        className="rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold shadow-soft-lg"
      >
        Cancel
      </button>
    </div>
  );
}
