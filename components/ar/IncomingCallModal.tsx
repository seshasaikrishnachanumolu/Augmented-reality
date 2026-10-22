"use client";

import type { IncomingCallInfo } from "@/lib/call/useCallSignaling";

interface IncomingCallModalProps {
  call: IncomingCallInfo;
  onAccept: () => void;
  onDecline: () => void;
}

/** Full-screen "someone is calling" prompt shown to the callee. */
export function IncomingCallModal({ call, onAccept, onDecline }: IncomingCallModalProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/85 p-6 text-center text-white">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-3xl">
        📞
      </div>
      <div>
        <p className="text-lg font-semibold">{call.fromName}</p>
        <p className="text-sm text-white/60">wants to join your AR space</p>
        <p className="mt-1 font-mono text-xs text-white/40">{call.fromAccountId}</p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onDecline}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-coral-500 text-xl shadow-soft-lg"
          aria-label="Decline call"
        >
          ✕
        </button>
        <button
          onClick={onAccept}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-xl shadow-soft-lg"
          aria-label="Accept call"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
