"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCallSignaling } from "@/lib/call/useCallSignaling";
import { useWebRtcCall } from "@/lib/call/useWebRtcCall";
import { useSelfieSegmentation } from "@/lib/call/useSelfieSegmentation";
import { CallInviteBar } from "./CallInviteBar";
import { IncomingCallModal } from "./IncomingCallModal";
import { CallStatusOverlay } from "./CallStatusOverlay";
import { InCallControls } from "./InCallControls";

interface ARCallSessionProps {
  myAccountId: string;
  myName: string;
  /** The local camera stream already being shown full-screen behind the AR view. */
  localStream: MediaStream | null;
  /**
   * Called every frame-worthy update with the background-removed remote
   * person canvas and whether a call is currently connected, so the parent
   * can feed it into the WebXR scene's remote-person mesh.
   */
  onRemotePersonChange: (canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) => void;
}

/**
 * Owns the full call lifecycle for the camera AR screen: connects to the
 * signaling server under the current account's id, lets the user ring
 * another account id, handles incoming calls, and once connected drives
 * the WebRTC peer connection + background segmentation on the remote
 * stream. Renders only the call UI chrome (invite bar / incoming call /
 * in-call controls) — the actual AR compositing happens in the parent via
 * onRemotePersonChange, since that's where the Three.js scene lives.
 */
export function ARCallSession({ myAccountId, myName, localStream, onRemotePersonChange }: ARCallSessionProps) {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // useCallSignaling and useWebRtcCall each need a stable callback into the
  // other, but neither can be constructed before the other exists. Break
  // the cycle with a ref to the latest webRtc value, updated via effect
  // (never during render) and read lazily inside the signaling callbacks.
  const webRtcRef = useRef<ReturnType<typeof useWebRtcCall> | null>(null);

  const handleRemoteDescription = useCallback((callId: string, description: RTCSessionDescriptionInit) => {
    webRtcRef.current?.handleRemoteDescription(callId, description);
  }, []);

  const handleRemoteCandidate = useCallback((callId: string, candidate: RTCIceCandidateInit) => {
    webRtcRef.current?.handleRemoteCandidate(callId, candidate);
  }, []);

  const handleCallAccepted = useCallback((callId: string) => {
    webRtcRef.current?.startAsCaller(callId);
  }, []);

  const signaling = useCallSignaling({
    accountId: myAccountId,
    name: myName,
    onRemoteDescription: handleRemoteDescription,
    onRemoteCandidate: handleRemoteCandidate,
    onCallAccepted: handleCallAccepted,
  });

  const webRtc = useWebRtcCall({
    localStream,
    onSendDescription: signaling.sendDescription,
    onSendCandidate: signaling.sendCandidate,
  });

  useEffect(() => {
    webRtcRef.current = webRtc;
  }, [webRtc]);

  // When accepting an incoming call, the callee side needs its peer
  // connection ready to receive the caller's offer (which arrives as a
  // "signal-description" message handled above).
  const acceptIncomingCall = useCallback(() => {
    if (signaling.incomingCall) {
      webRtc.startAsCallee(signaling.incomingCall.callId);
    }
    signaling.acceptIncomingCall();
  }, [signaling, webRtc]);

  const hangUp = useCallback(() => {
    signaling.hangUp();
    webRtc.endCall();
  }, [signaling, webRtc]);

  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video) return;
    video.srcObject = webRtc.remoteStream;
  }, [webRtc.remoteStream]);

  const isCallConnected = signaling.phase === "connected";
  const { canvasRef: remotePersonCanvasRef } = useSelfieSegmentation({
    videoRef: remoteVideoRef,
    enabled: isCallConnected && !!webRtc.remoteStream,
  });

  useEffect(() => {
    onRemotePersonChange(remotePersonCanvasRef, isCallConnected && !!webRtc.remoteStream);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCallConnected, webRtc.remoteStream]);

  useEffect(() => {
    if (signaling.phase === "ended") {
      webRtc.endCall();
      const timeout = setTimeout(() => signaling.resetEndedPhase(), 2000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signaling.phase]);

  return (
    <>
      {/* Hidden element feeding the remote WebRTC stream into the
          segmentation pipeline; nothing here is shown directly since the
          composited result is what gets rendered into the AR scene. */}
      <video ref={remoteVideoRef} autoPlay playsInline muted className="hidden" />

      {signaling.phase === "idle" && (
        <CallInviteBar
          myAccountId={myAccountId}
          connected={signaling.connected}
          onCall={signaling.callAccountId}
          callError={signaling.callError}
          onDismissError={signaling.clearCallError}
        />
      )}

      {signaling.phase === "calling" && (
        <CallStatusOverlay phase={signaling.phase} remoteAccountId={signaling.remoteAccountId} onCancel={hangUp} />
      )}

      {signaling.phase === "incoming" && signaling.incomingCall && (
        <IncomingCallModal
          call={signaling.incomingCall}
          onAccept={acceptIncomingCall}
          onDecline={signaling.declineIncomingCall}
        />
      )}

      {signaling.phase === "connected" && (
        <InCallControls
          remoteAccountId={signaling.remoteAccountId}
          connectionState={webRtc.connectionState}
          onHangUp={hangUp}
        />
      )}
    </>
  );
}
