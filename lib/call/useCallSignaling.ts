"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ClientToServerMessage,
  ServerToClientMessage,
} from "@/types/call";

export type CallPhase =
  | "idle" // no call in progress
  | "calling" // we invited someone, waiting for their response
  | "incoming" // someone invited us, waiting for our response
  | "connected" // call accepted, WebRTC should be (or is being) set up
  | "ended"; // call just ended/declined/errored (transient, UI should reset after showing it)

export interface IncomingCallInfo {
  callId: string;
  fromAccountId: string;
  fromName: string;
}

interface UseCallSignalingOptions {
  accountId: string;
  name: string;
  /** Called whenever the other side sends a WebRTC SDP offer/answer. */
  onRemoteDescription: (callId: string, description: RTCSessionDescriptionInit) => void;
  /** Called whenever the other side sends a WebRTC ICE candidate. */
  onRemoteCandidate: (callId: string, candidate: RTCIceCandidateInit) => void;
  /** Called when a call is accepted, telling the caller side to start the WebRTC offer. */
  onCallAccepted: (callId: string, remoteAccountId: string) => void;
}

/**
 * Connects to the standalone signaling WebSocket server and exposes the
 * account-id-based call flow (invite / incoming / accept / decline / hang
 * up) plus pass-throughs for relaying WebRTC SDP and ICE messages. This
 * hook only handles *signaling* — the actual audio/video never passes
 * through it, see useWebRtcCall for the peer connection itself.
 */
export function useCallSignaling({
  accountId,
  name,
  onRemoteDescription,
  onRemoteCandidate,
  onCallAccepted,
}: UseCallSignalingOptions) {
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [remoteAccountId, setRemoteAccountId] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const callbacksRef = useRef({ onRemoteDescription, onRemoteCandidate, onCallAccepted });
  useEffect(() => {
    callbacksRef.current = { onRemoteDescription, onRemoteCandidate, onCallAccepted };
  }, [onRemoteDescription, onRemoteCandidate, onCallAccepted]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SIGNALING_URL ?? "ws://localhost:4001";
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setConnected(true);
      const register: ClientToServerMessage = { type: "register", accountId, name };
      socket.send(JSON.stringify(register));
    });

    socket.addEventListener("close", () => {
      setConnected(false);
    });

    socket.addEventListener("message", (event) => {
      let message: ServerToClientMessage;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (message.type) {
        case "incoming-call":
          setIncomingCall({
            callId: message.callId,
            fromAccountId: message.fromAccountId,
            fromName: message.fromName,
          });
          setPhase("incoming");
          break;

        case "call-result":
          if (message.accepted) {
            setPhase("connected");
            setActiveCallId(message.callId);
            callbacksRef.current.onCallAccepted(message.callId, remoteAccountId ?? "");
          } else {
            setPhase("ended");
            setActiveCallId(null);
            setRemoteAccountId(null);
          }
          break;

        case "signal-description":
          callbacksRef.current.onRemoteDescription(message.callId, message.description);
          break;

        case "signal-candidate":
          callbacksRef.current.onRemoteCandidate(message.callId, message.candidate);
          break;

        case "hang-up":
          setPhase("ended");
          setActiveCallId(null);
          setRemoteAccountId(null);
          setIncomingCall(null);
          break;

        case "call-error":
          setCallError(message.message);
          setPhase("idle");
          setActiveCallId(null);
          setRemoteAccountId(null);
          break;
      }
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
    // Intentionally only reconnect if the account identity changes — the
    // callback refs are read live via callbacksRef so they don't need to
    // retrigger the socket lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, name]);

  const send = useCallback((message: ClientToServerMessage) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(message));
  }, []);

  const callAccountId = useCallback(
    (toAccountId: string) => {
      setCallError(null);
      setRemoteAccountId(toAccountId);
      setPhase("calling");
      send({ type: "call-invite", toAccountId });
    },
    [send]
  );

  const acceptIncomingCall = useCallback(() => {
    if (!incomingCall) return;
    setActiveCallId(incomingCall.callId);
    setRemoteAccountId(incomingCall.fromAccountId);
    setPhase("connected");
    send({ type: "call-response", callId: incomingCall.callId, accepted: true });
    setIncomingCall(null);
  }, [incomingCall, send]);

  const declineIncomingCall = useCallback(() => {
    if (!incomingCall) return;
    send({ type: "call-response", callId: incomingCall.callId, accepted: false });
    setIncomingCall(null);
    setPhase("idle");
  }, [incomingCall, send]);

  const hangUp = useCallback(() => {
    if (activeCallId) {
      send({ type: "hang-up", callId: activeCallId });
    }
    setPhase("idle");
    setActiveCallId(null);
    setRemoteAccountId(null);
    setIncomingCall(null);
  }, [activeCallId, send]);

  const sendDescription = useCallback(
    (callId: string, description: RTCSessionDescriptionInit) => {
      send({ type: "signal-description", callId, description });
    },
    [send]
  );

  const sendCandidate = useCallback(
    (callId: string, candidate: RTCIceCandidateInit) => {
      send({ type: "signal-candidate", callId, candidate });
    },
    [send]
  );

  const clearCallError = useCallback(() => setCallError(null), []);
  const resetEndedPhase = useCallback(() => {
    setPhase((current) => (current === "ended" ? "idle" : current));
  }, []);

  return {
    connected,
    phase,
    incomingCall,
    callError,
    activeCallId,
    remoteAccountId,
    callAccountId,
    acceptIncomingCall,
    declineIncomingCall,
    hangUp,
    sendDescription,
    sendCandidate,
    clearCallError,
    resetEndedPhase,
  };
}
