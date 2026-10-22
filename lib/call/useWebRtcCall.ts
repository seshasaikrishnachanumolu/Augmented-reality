"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ICE_SERVERS: RTCIceServer[] = [
  // Public STUN server for NAT traversal. No TURN server is configured, so
  // calls between two devices on restrictive/symmetric NATs (common on
  // mobile carrier networks) may fail to connect peer-to-peer. Adding a
  // TURN server is the fix for that, but requires separate (often paid)
  // infrastructure and is out of scope here.
  { urls: "stun:stun.l.google.com:19302" },
];

interface UseWebRtcCallOptions {
  localStream: MediaStream | null;
  onSendDescription: (callId: string, description: RTCSessionDescriptionInit) => void;
  onSendCandidate: (callId: string, candidate: RTCIceCandidateInit) => void;
}

/**
 * Owns the RTCPeerConnection for one call. The caller side kicks things off
 * with `startAsCaller`, the callee side waits for `handleRemoteDescription`
 * to be fed the incoming offer (startAsCallee is called first to prep the
 * connection and attach local tracks). Signaling messages are handed off to
 * the caller via the onSendDescription/onSendCandidate callbacks — actual
 * transport is the caller's responsibility (useCallSignaling).
 */
export function useWebRtcCall({ localStream, onSendDescription, onSendCandidate }: UseWebRtcCallOptions) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const callIdRef = useRef<string | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const createPeerConnection = useCallback(
    (callId: string) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      callIdRef.current = callId;

      if (localStream) {
        for (const track of localStream.getTracks()) {
          pc.addTrack(track, localStream);
        }
      }

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0] ?? null);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          onSendCandidate(callId, event.candidate.toJSON());
        }
      };

      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState);
      };

      return pc;
    },
    [localStream, onSendCandidate]
  );

  const startAsCaller = useCallback(
    async (callId: string) => {
      const pc = createPeerConnection(callId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      onSendDescription(callId, offer);
    },
    [createPeerConnection, onSendDescription]
  );

  const startAsCallee = useCallback(
    (callId: string) => {
      createPeerConnection(callId);
    },
    [createPeerConnection]
  );

  const handleRemoteDescription = useCallback(
    async (callId: string, description: RTCSessionDescriptionInit) => {
      let pc = pcRef.current;
      if (!pc || callIdRef.current !== callId) {
        pc = createPeerConnection(callId);
      }

      await pc.setRemoteDescription(description);

      // Drain any ICE candidates that arrived before the remote description
      // was set (they can't be applied until setRemoteDescription resolves).
      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(candidate).catch(() => {});
      }
      pendingCandidatesRef.current = [];

      if (description.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        onSendDescription(callId, answer);
      }
    },
    [createPeerConnection, onSendDescription]
  );

  const handleRemoteCandidate = useCallback(async (callId: string, candidate: RTCIceCandidateInit) => {
    const pc = pcRef.current;
    if (!pc || callIdRef.current !== callId || !pc.remoteDescription) {
      pendingCandidatesRef.current.push(candidate);
      return;
    }
    await pc.addIceCandidate(candidate).catch(() => {});
  }, []);

  const endCall = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    callIdRef.current = null;
    pendingCandidatesRef.current = [];
    setRemoteStream(null);
    setConnectionState("closed");
  }, []);

  useEffect(() => {
    return () => {
      pcRef.current?.close();
    };
  }, []);

  return {
    remoteStream,
    connectionState,
    startAsCaller,
    startAsCallee,
    handleRemoteDescription,
    handleRemoteCandidate,
    endCall,
  };
}
