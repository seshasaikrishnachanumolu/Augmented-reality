"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { WebXRHitTestViewer } from "./WebXRHitTestViewer";
import { ARCallSession } from "./ARCallSession";
import { RemotePersonOverlay } from "./RemotePersonOverlay";
import { useClerkAuthUser } from "@/lib/store/useClerkAuthUser";

type PermissionState = "checking" | "granted" | "denied" | "unsupported" | "insecure";
type XrSupport = "checking" | "supported" | "unsupported";

const MODEL_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const POSTER_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.webp";

/**
 * Standalone camera-based AR entry point, launched directly from the
 * gallery (no shareable scene link needed first). Requests camera access
 * via getUserMedia for a live preview/permission gate, then hands off to
 * the WebXR hit-test session (same engine used on the per-scene /ar/[id]
 * page) for real surface detection and tap-to-place on Android Chrome.
 *
 * On browsers without WebXR immersive-ar support (desktop, iOS Safari,
 * etc.) this falls back to a `<model-viewer>` 3D viewer with orbit/pinch
 * controls, so "web" visitors still get a usable experience instead of a
 * dead-end error screen.
 */
/**
 * Reads environment support (secure context, getUserMedia availability).
 * Must only be called client-side, after mount — calling this during
 * render would make the component produce different markup on the server
 * (where `window`/`navigator` don't exist) than on the client, causing a
 * hydration mismatch.
 */
function detectEnvironmentSupport(): PermissionState {
  if (!window.isSecureContext) return "insecure";
  if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
  return "checking";
}

async function checkWebXrSupport(): Promise<boolean> {
  const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
  if (!xr) return false;
  try {
    return await xr.isSessionSupported("immersive-ar");
  } catch {
    return false;
  }
}

export function CameraARLauncher() {
  const router = useRouter();
  const { user } = useClerkAuthUser();
  const [permission, setPermission] = useState<PermissionState>("checking");
  const [arActive, setArActive] = useState(false);
  const [xrSupport, setXrSupport] = useState<XrSupport>("checking");
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  useEffect(() => {
    let cancelled = false;
    checkWebXrSupport().then((supported) => {
      if (!cancelled) setXrSupport(supported ? "supported" : "unsupported");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Environment checks (secure context, getUserMedia availability) must
    // run client-side only, after mount — doing this during render would
    // make the server and client produce different markup (SSR has no
    // window/navigator), causing a hydration mismatch. State always
    // starts as "checking" (matching the server-rendered markup); this
    // effect is the first thing to resolve it on the client.
    if (permission !== "checking") return;

    const envResult = detectEnvironmentSupport();
    if (envResult !== "checking") {
      // Deferred to a microtask so this is an async state update rather
      // than a synchronous one inside the effect body (avoids the
      // cascading-render footgun the lint rule warns about) — functionally
      // identical to the getUserMedia promise branches below.
      Promise.resolve().then(() => setPermission(envResult));
      return;
    }

    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setLocalStream(stream);
        setPermission("granted");
      })
      .catch(() => {
        if (!cancelled) setPermission("denied");
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    router.push("/gallery");
  };

  if (arActive && xrSupport === "supported") {
    return (
      <div className="relative h-screen w-screen">
        <WebXRHitTestViewer
          modelSrc={MODEL_SRC}
          onExit={() => setArActive(false)}
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

  if (arActive && xrSupport === "unsupported") {
    return (
      <div className="relative h-screen w-screen bg-surface-900">
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          strategy="afterInteractive"
          onLoad={() => customElements.whenDefined("model-viewer").then(() => setViewerLoaded(true))}
        />

        <button
          onClick={() => setArActive(false)}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          aria-label="Close 3D viewer"
        >
          ✕
        </button>

        {!viewerLoaded ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <p className="text-sm text-white/70">Loading 3D viewer…</p>
          </div>
        ) : (
          // @ts-expect-error -- model-viewer is a web component with no bundled React types
          <model-viewer
            src={MODEL_SRC}
            poster={POSTER_SRC}
            alt="3D preview of your Mesha Studio scene"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            shadow-intensity="1"
            auto-rotate
            style={{ width: "100%", height: "100%", backgroundColor: "#171327" }}
          />
        )}

        <div className="absolute inset-x-0 bottom-0 z-[5] flex flex-col items-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10 text-center text-white">
          <p className="text-xs text-white/70">
            Surface detection via your camera isn&apos;t available in this browser, so here&apos;s a 3D
            view instead. Drag to rotate, pinch or scroll to zoom.
          </p>
        </div>

        {/* The call feature doesn't need WebXR surface detection, so it's
            available here too — the remote person renders as a floating
            cutout overlay on top of the 3D viewer via plain 2D canvas,
            since model-viewer has no Three.js scene of ours to plug into. */}
        {user && (
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

  if (permission === "insecure") {
    return (
      <ArScreen onClose={handleClose} icon="🔒" title="Secure connection required">
        Camera-based AR needs HTTPS (or localhost). Open this page over a secure connection to
        continue.
      </ArScreen>
    );
  }

  if (permission === "unsupported") {
    return (
      <ArScreen onClose={handleClose} icon="📵" title="Camera isn&apos;t available">
        This browser doesn&apos;t support camera access from the web. Try opening this page on a
        phone with Chrome or Safari.
      </ArScreen>
    );
  }

  if (permission === "denied") {
    return (
      <ArScreen onClose={handleClose} icon="🚫" title="Camera access denied">
        Allow camera access in your browser settings, then reload this page to use camera-based AR.
      </ArScreen>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black">
      {permission === "checking" ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm text-white/70">Requesting camera access…</p>
        </div>
      ) : (
        <>
          {/* Live camera preview feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />

          <button
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
            aria-label="Close camera"
          >
            ✕
          </button>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10">
            <p className="text-center text-sm text-white/90">
              Point your camera at a surface, then start AR to detect it and place a 3D model.
            </p>
            <button
              onClick={() => setArActive(true)}
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-soft-lg"
            >
              🎯 Start Surface AR
            </button>
          </div>

          {/* Calling works straight from this plain camera preview too —
              no need to enter surface-AR mode first. */}
          {user && (
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
        </>
      )}
    </div>
  );
}

function ArScreen({
  icon,
  title,
  children,
  onClose,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-surface-900 p-6 text-center text-white">
      <span className="text-4xl">{icon}</span>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-xs text-sm text-white/60">{children}</p>
      <button
        onClick={onClose}
        className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-surface-900"
      >
        Back to Gallery
      </button>
    </div>
  );
}
