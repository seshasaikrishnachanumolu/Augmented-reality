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
/** Which of the two Camera AR experiences the user has picked, if any. */
type LauncherMode = "choose" | "model" | "call";

const MODEL_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const POSTER_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.webp";

/**
 * Standalone camera-based AR entry point, launched directly from the
 * gallery (no shareable scene link needed first). Requests camera access
 * via getUserMedia for a live preview/permission gate, then presents two
 * distinct experiences to choose from:
 *
 *  - "model": place a 3D model in your space via WebXR hit-test (Android
 *    Chrome) or a `<model-viewer>` 3D fallback elsewhere.
 *  - "call": ring another account by ID and see them composited live into
 *    your own camera feed once they accept.
 *
 * These used to be tangled together on the same screen (the call UI was
 * overlaid on top of the model-placement UI); they're kept as separate
 * modes now since they're unrelated experiences with different UI needs.
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
  const [mode, setMode] = useState<LauncherMode>("choose");
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

  // Keeps whichever <video> element is currently mounted (choose screen or
  // the call mode's camera background) attached to the live stream — the
  // element itself gets unmounted/remounted as the user switches between
  // modes below, so srcObject needs to be re-applied each time rather than
  // set once.
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, mode]);

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    router.push("/gallery");
  };

  // ---- Mode: place a 3D model via AR (WebXR hit-test or 3D fallback) ----
  if (mode === "model" && xrSupport === "supported") {
    return <WebXRHitTestViewer modelSrc={MODEL_SRC} onExit={() => setMode("choose")} />;
  }

  if (mode === "model" && xrSupport === "unsupported") {
    return (
      <div className="relative h-screen w-screen bg-surface-900">
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          strategy="afterInteractive"
          onLoad={() => customElements.whenDefined("model-viewer").then(() => setViewerLoaded(true))}
        />

        <button
          onClick={() => setMode("choose")}
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

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10 text-center text-white">
          <p className="text-xs text-white/70">
            Surface detection via your camera isn&apos;t available in this browser, so here&apos;s a 3D
            view instead. Drag to rotate, pinch or scroll to zoom.
          </p>
        </div>
      </div>
    );
  }

  // ---- Mode: call another account, with them composited live into your
  // own camera feed ----
  if (mode === "call") {
    return (
      <div className="relative h-screen w-screen bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />

        <button
          onClick={() => setMode("choose")}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          aria-label="Close call"
        >
          ✕
        </button>

        <RemotePersonOverlay canvasRef={remotePerson.canvasRef} active={remotePerson.active} />

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

  // ---- Mode: choose (default) — camera preview + the two entry points ----
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

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pb-10">
            <p className="text-center text-sm text-white/90">What would you like to do?</p>

            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setMode("model")}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-brand-500 px-5 py-4 text-center shadow-soft-lg transition-transform hover:scale-[1.02]"
              >
                <span className="text-2xl">🦣</span>
                <span className="text-sm font-semibold text-white">Place a 3D Model</span>
                <span className="text-[11px] text-white/80">Scan a surface and drop a model into your space</span>
              </button>

              <button
                onClick={() => setMode("call")}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-teal-500 px-5 py-4 text-center shadow-soft-lg transition-transform hover:scale-[1.02]"
              >
                <span className="text-2xl">📞</span>
                <span className="text-sm font-semibold text-white">Call Someone</span>
                <span className="text-[11px] text-white/80">See another person live in your camera view</span>
              </button>
            </div>
          </div>
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
