"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { WebXRHitTestViewer } from "./WebXRHitTestViewer";
import { ARCallSession } from "./ARCallSession";
import { RemotePersonOverlay } from "./RemotePersonOverlay";
import { useClerkAuthUser } from "@/lib/store/useClerkAuthUser";

type LoadState = "loading" | "ready" | "script-error";
type MotionPermission = "unknown" | "not-required" | "needed" | "granted" | "denied";
type ViewMode = "quick" | "surface";

interface ARViewerProps {
  sceneId: string;
}

const MODEL_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const POSTER_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.webp";

export function ARViewer({ sceneId }: ARViewerProps) {
  const { user } = useClerkAuthUser();
  const [viewMode, setViewMode] = useState<ViewMode>("quick");
  const [isSecureContext] = useState<boolean | null>(() =>
    typeof window !== "undefined" ? window.isSecureContext : true
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remotePerson, setRemotePerson] = useState<{
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    active: boolean;
  }>({ canvasRef: { current: null }, active: false });

  const handleRemotePersonChange = useCallback(
    (canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) => {
      setRemotePerson({ canvasRef, active });
    },
    []
  );

  // The call feature needs its own raw camera stream for WebRTC (separate
  // from whatever model-viewer/WebXR does internally for rendering the
  // camera feed as the AR background). Requested for any signed-in viewer,
  // in both "quick" (desktop/iOS 3D-viewer fallback) and "surface" (WebXR)
  // modes, since calling doesn't actually require WebXR surface detection.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: true })
      .then((result) => {
        if (cancelled) {
          result.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = result;
        setLocalStream(result);
      })
      .catch(() => {
        /* Call feature simply won't be available without camera/mic access. */
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    };
  }, [user]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [motionPermission, setMotionPermission] = useState<MotionPermission>(() => {
    const needsMotionPermission =
      typeof window !== "undefined" &&
      typeof (window as unknown as { DeviceMotionEvent?: { requestPermission?: unknown } })
        .DeviceMotionEvent?.requestPermission === "function";
    return needsMotionPermission ? "needed" : "not-required";
  });
  const [arSupportChecked, setArSupportChecked] = useState(false);
  const [modelError, setModelError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSecureContext === false) return;
    let cancelled = false;
    customElements
      .whenDefined("model-viewer")
      .then(() => {
        if (!cancelled) {
          setLoadState("ready");
          setArSupportChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState("script-error");
      });
    return () => {
      cancelled = true;
    };
  }, [isSecureContext]);

  const requestMotionPermission = async () => {
    try {
      const DeviceMotionEventTyped = (
        window as unknown as {
          DeviceMotionEvent?: { requestPermission?: () => Promise<"granted" | "denied"> };
        }
      ).DeviceMotionEvent;
      const result = await DeviceMotionEventTyped?.requestPermission?.();
      setMotionPermission(result === "granted" ? "granted" : "denied");
    } catch {
      setMotionPermission("denied");
    }
  };

  if (isSecureContext === false) {
    return (
      <ErrorScreen
        icon="🔒"
        title="Secure connection required"
        message="AR viewing needs HTTPS (or localhost). Open this link over a secure connection to continue."
      />
    );
  }

  if (viewMode === "surface") {
    return (
      <div className="relative h-screen w-screen">
        <WebXRHitTestViewer
          modelSrc={MODEL_SRC}
          onExit={() => setViewMode("quick")}
          remotePersonCanvasRef={remotePerson.canvasRef}
          remotePersonActive={remotePerson.active}
        />
        {user && (
          <ARCallSession
            myAccountId={user.id}
            myName={user.name}
            localStream={localStream}
            onRemotePersonChange={handleRemotePersonChange}
          />
        )}
      </div>
    );
  }

  if (loadState === "script-error") {
    return (
      <ErrorScreen
        icon="⚠️"
        title="Couldn't load the AR viewer"
        message="The 3D viewer failed to load. Check your connection and try reloading the page."
      />
    );
  }

  return (
    <div ref={containerRef} className="relative h-screen w-screen bg-surface-900">
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        strategy="afterInteractive"
        onError={() => setLoadState("script-error")}
      />

      {loadState === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface-900 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm text-white/70">Loading AR scene…</p>
        </div>
      )}

      {loadState === "ready" && motionPermission === "needed" && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center p-4">
          <button
            onClick={requestMotionPermission}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-surface-900 shadow-soft-lg"
          >
            🧭 Enable motion &amp; orientation access
          </button>
        </div>
      )}

      {loadState === "ready" && motionPermission === "denied" && (
        <div className="absolute inset-x-4 top-4 z-10 rounded-2xl bg-amber-100 px-4 py-3 text-xs text-amber-900 shadow-soft">
          Motion access was denied. Camera-based AR tracking may not work correctly — you can still view
          the 3D model with touch controls.
        </div>
      )}

      {loadState === "ready" && (
        // @ts-expect-error -- model-viewer is a web component with no bundled React types
        <model-viewer
          src={MODEL_SRC}
          poster={POSTER_SRC}
          alt="AR preview of your Mesha Studio scene"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          shadow-intensity="1"
          auto-rotate
          style={{ width: "100%", height: "100%", backgroundColor: "#171327" }}
          onError={() => setModelError(true)}
        />
      )}

      {loadState === "ready" && modelError && (
        <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl bg-coral-500/90 px-4 py-3 text-xs text-white shadow-soft">
          This model couldn&apos;t be loaded. AR viewing is unavailable for scene{" "}
          <span className="font-mono">{sceneId}</span> right now.
        </div>
      )}

      {loadState === "ready" && arSupportChecked && (
        <div className="absolute bottom-20 left-1/2 z-10 w-[92%] max-w-sm -translate-x-1/2 rounded-2xl bg-black/40 px-4 py-2 text-center text-[11px] text-white/80 backdrop-blur">
          Tap the AR icon to view in your space. If AR isn&apos;t available on this device, you can still
          rotate and pinch to explore the 3D model.
        </div>
      )}

      {loadState === "ready" && (
        <button
          onClick={() => setViewMode("surface")}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-brand-500 px-5 py-2.5 text-xs font-semibold text-white shadow-soft-lg"
        >
          🎯 Place on a detected surface
        </button>
      )}

      {/* Calling works in the plain 3D-viewer mode too — the remote
          person renders as a floating cutout overlay since model-viewer
          has no Three.js scene of ours to composite into directly. */}
      {loadState === "ready" && user && (
        <>
          <RemotePersonOverlay canvasRef={remotePerson.canvasRef} active={remotePerson.active} />
          <ARCallSession
            myAccountId={user.id}
            myName={user.name}
            localStream={localStream}
            onRemotePersonChange={handleRemotePersonChange}
          />
        </>
      )}
    </div>
  );
}

function ErrorScreen({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-surface-900 p-6 text-center text-white">
      <span className="text-4xl">{icon}</span>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-xs text-sm text-white/60">{message}</p>
    </div>
  );
}
