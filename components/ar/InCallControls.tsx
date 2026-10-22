"use client";

interface InCallControlsProps {
  remoteAccountId: string | null;
  connectionState: RTCPeerConnectionState;
  onHangUp: () => void;
}

const STATE_LABEL: Record<RTCPeerConnectionState, string> = {
  new: "Setting up…",
  connecting: "Connecting…",
  connected: "Connected",
  disconnected: "Reconnecting…",
  failed: "Connection failed",
  closed: "Call ended",
};

/** Bottom bar shown during an active AR call: who you're with, status, hang up. */
export function InCallControls({ remoteAccountId, connectionState, onHangUp }: InCallControlsProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10">
      <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 text-xs text-white/80 backdrop-blur">
        <span
          className={`h-2 w-2 rounded-full ${
            connectionState === "connected" ? "bg-teal-400" : "bg-amber-400"
          }`}
        />
        <span>{STATE_LABEL[connectionState]}</span>
        {remoteAccountId && <span className="font-mono text-white/40">· {remoteAccountId}</span>}
      </div>
      <button
        onClick={onHangUp}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-coral-500 text-xl shadow-soft-lg"
        aria-label="Hang up"
      >
        📵
      </button>
    </div>
  );
}
