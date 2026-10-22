"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createRemotePersonMesh, updateRemotePersonMesh } from "@/lib/call/remotePersonMesh";

type SessionState = "idle" | "starting" | "active" | "unsupported" | "error";

interface WebXRHitTestViewerProps {
  modelSrc: string;
  onExit: () => void;
  /**
   * When set, the AR scene also renders the other person on an active call
   * as a background-removed cutout standing a couple meters away — this is
   * the canvas produced by useSelfieSegmentation on the remote WebRTC
   * stream. Read every frame via a ref (not re-rendered as a prop) since it
   * updates far faster than React state should.
   */
  remotePersonCanvasRef?: React.RefObject<HTMLCanvasElement | null>;
  remotePersonActive?: boolean;
}

/**
 * A hand-rolled WebXR hit-test AR experience: requests an `immersive-ar`
 * session with the `hit-test` feature, raycasts against real-world surfaces
 * detected by the device, shows a reticle on the detected surface, and lets
 * the user tap to place the model there. This is the raw WebXR Device API
 * directly (no @react-three/xr dependency) since R3F 9 doesn't bundle an XR
 * helper itself.
 *
 * Support is narrow by nature of the API: Android Chrome 81+ over HTTPS is
 * the realistic baseline. iOS Safari and desktop browsers do not implement
 * WebXR's immersive-ar mode, so this path is a progressive enhancement
 * alongside the `<model-viewer>` "Quick AR" button, not a replacement for it.
 */
export function WebXRHitTestViewer({
  modelSrc,
  onExit,
  remotePersonCanvasRef,
  remotePersonActive = false,
}: WebXRHitTestViewerProps) {
  const [state, setState] = useState<SessionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasPlaced, setHasPlaced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<XRSession | null>(null);
  const remotePersonActiveRef = useRef(remotePersonActive);
  useEffect(() => {
    remotePersonActiveRef.current = remotePersonActive;
  }, [remotePersonActive]);

  const checkSupport = useCallback(async (): Promise<boolean> => {
    const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
    if (!xr) return false;
    try {
      return await xr.isSessionSupported("immersive-ar");
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    checkSupport().then((supported) => {
      if (!supported) setState("unsupported");
    });
  }, [checkSupport]);

  const startSession = useCallback(async () => {
    setState("starting");
    setErrorMessage(null);

    const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
    if (!xr) {
      setState("unsupported");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera();

      // Lighting good enough to read PBR materials without a full
      // environment map (WebXR AR sessions render the real camera feed as
      // the "background", so there's no skybox to light from).
      scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
      const directional = new THREE.DirectionalLight(0xffffff, 1.5);
      directional.position.set(1, 2, 1);
      scene.add(directional);

      // Reticle: a thin ring that snaps to the detected surface each frame,
      // showing the user exactly where tapping will place the model.
      const reticleGeometry = new THREE.RingGeometry(0.07, 0.09, 32).rotateX(-Math.PI / 2);
      const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x7c3aed });
      const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      // The other person on an active AR call, rendered as a background-
      // removed cutout standing a couple meters in front of the camera.
      const remotePersonMesh = createRemotePersonMesh();
      scene.add(remotePersonMesh);

      let placedModel: THREE.Object3D | null = null;
      const loader = new GLTFLoader();

      const placeModelAt = (matrix: THREE.Matrix4) => {
        if (!placedModel) return;
        matrix.decompose(placedModel.position, placedModel.quaternion, placedModel.scale);
        placedModel.scale.setScalar(1);
        placedModel.visible = true;
        setHasPlaced(true);
      };

      loader.load(
        modelSrc,
        (gltf) => {
          placedModel = gltf.scene;
          placedModel.visible = false;
          scene.add(placedModel);
        },
        undefined,
        () => setErrorMessage("Couldn't load the 3D model for placement.")
      );

      let hitTestSource: XRHitTestSource | null = null;
      let hitTestSourceRequested = false;

      const session = await xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: canvas.parentElement ? { root: canvas.parentElement } : undefined,
      });
      sessionRef.current = session;
      await renderer.xr.setSession(session);
      setState("active");

      session.addEventListener("end", () => {
        sessionRef.current = null;
        setState("idle");
        setHasPlaced(false);
      });

      // A tap/select in AR either places the model on the current reticle
      // position, or re-places it if it's already been placed once.
      session.addEventListener("select", () => {
        if (reticle.visible) {
          placeModelAt(reticle.matrix.clone());
        }
      });

      renderer.setAnimationLoop((_timestamp, frame) => {
        if (!frame) return;
        const referenceSpace = renderer.xr.getReferenceSpace();
        if (!referenceSpace) return;

        if (!hitTestSourceRequested) {
          hitTestSourceRequested = true;
          session.requestReferenceSpace("viewer").then((viewerSpace) => {
            const sourcePromise = session.requestHitTestSource?.({ space: viewerSpace });
            sourcePromise?.then((source) => {
              hitTestSource = source ?? null;
            });
          });
        }

        if (hitTestSource) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length > 0) {
            const pose = hitTestResults[0].getPose(referenceSpace);
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
            }
          } else {
            reticle.visible = false;
          }
        }

        const remoteCanvas = remotePersonCanvasRef?.current;
        if (remotePersonActiveRef.current && remoteCanvas) {
          updateRemotePersonMesh(remotePersonMesh, remoteCanvas);
          // Keep the person standing a fixed distance directly ahead of
          // wherever the camera is currently facing, on the floor, so they
          // read as "in the room with you" rather than fixed in empty
          // space you've since walked away from.
          const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
          forward.y = 0;
          if (forward.lengthSq() > 0.0001) forward.normalize();
          remotePersonMesh.position.x = camera.position.x + forward.x * 1.6;
          remotePersonMesh.position.z = camera.position.z + forward.z * 1.6;
          remotePersonMesh.quaternion.copy(camera.quaternion);
          // Cancel any tilt so the cutout stays upright like a person
          // standing on the floor instead of leaning with the camera pitch.
          const euler = new THREE.Euler().setFromQuaternion(remotePersonMesh.quaternion, "YXZ");
          euler.x = 0;
          euler.z = 0;
          remotePersonMesh.quaternion.setFromEuler(euler);
        } else {
          remotePersonMesh.visible = false;
        }

        renderer.render(scene, camera);
      });
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Couldn't start the AR session.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelSrc]);

  useEffect(() => {
    return () => {
      sessionRef.current?.end().catch(() => {});
    };
  }, []);

  const handleExit = useCallback(() => {
    sessionRef.current?.end().catch(() => {});
    onExit();
  }, [onExit]);

  if (state === "unsupported") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-surface-900 p-6 text-center text-white">
        <span className="text-4xl">📵</span>
        <h2 className="text-lg font-semibold">Surface placement isn&apos;t available here</h2>
        <p className="max-w-xs text-sm text-white/60">
          Custom surface detection needs WebXR with hit-testing, which is currently only supported in
          Chrome on Android. Use the regular AR button instead — it uses your device&apos;s built-in AR
          viewer.
        </p>
        <button
          onClick={onExit}
          className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-surface-900"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {state === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface-900/90 p-6 text-center text-white">
          <span className="text-4xl">📱</span>
          <h2 className="text-lg font-semibold">Place in your space</h2>
          <p className="max-w-xs text-sm text-white/60">
            Point your camera at a floor or table. We&apos;ll detect the surface in real time — tap
            where you want to place the model.
          </p>
          <button
            onClick={startSession}
            className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold shadow-soft-lg"
          >
            Start AR
          </button>
          <button onClick={onExit} className="text-xs text-white/50 underline">
            Cancel
          </button>
        </div>
      )}

      {state === "starting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-900/80">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      )}

      {state === "active" && !hasPlaced && (
        <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
          <span className="rounded-full bg-black/50 px-4 py-2 text-xs text-white backdrop-blur">
            🎯 Move your phone to find a surface, then tap to place
          </span>
        </div>
      )}

      {state === "active" && (
        <button
          onClick={handleExit}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          aria-label="Exit AR"
        >
          ✕
        </button>
      )}

      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-900/95 p-6 text-center text-white">
          <span className="text-4xl">⚠️</span>
          <p className="max-w-xs text-sm text-white/70">{errorMessage ?? "Something went wrong starting AR."}</p>
          <button onClick={onExit} className="rounded-full bg-white px-5 py-2 text-sm font-medium text-surface-900">
            Back
          </button>
        </div>
      )}
    </div>
  );
}
