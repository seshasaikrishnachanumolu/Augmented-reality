"use client";

import { useState } from "react";

interface CallInviteBarProps {
  myAccountId: string;
  connected: boolean;
  onCall: (accountId: string) => void;
  callError: string | null;
  onDismissError: () => void;
}

/**
 * The "call someone by account id" entry point shown on the camera AR
 * screen before any call is active. Deliberately minimal: paste in the
 * other person's account id (shown to them on their own profile/gallery)
 * and ring them.
 */
export function CallInviteBar({ myAccountId, connected, onCall, callError, onDismissError }: CallInviteBarProps) {
  const [targetId, setTargetId] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = targetId.trim();
    if (!trimmed) return;
    onCall(trimmed);
  };

  return (
    <div className="absolute inset-x-0 top-4 z-20 flex flex-col items-center gap-2 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-black/50 p-3 backdrop-blur">
        <p className="mb-2 text-center text-[11px] text-white/60">
          Your account ID (share this so others can call you):{" "}
          <span className="select-all font-mono text-white/90">{myAccountId}</span>
        </p>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
            placeholder="Enter their account ID"
            className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/20"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || !targetId.trim()}
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            📞 Call
          </button>
        </form>
        {!connected && (
          <p className="mt-2 text-center text-[11px] text-amber-300">Connecting to call service…</p>
        )}
      </div>

      {callError && (
        <div className="flex max-w-sm items-center gap-2 rounded-full bg-coral-500/90 px-4 py-2 text-xs text-white">
          <span>{callError}</span>
          <button onClick={onDismissError} className="font-bold">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
