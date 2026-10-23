"use client";

import { useEffect, useRef, useState } from "react";
import { FilesetResolver, ImageSegmenter, type ImageSegmenterResult } from "@mediapipe/tasks-vision";

const WASM_BASE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";

let sharedSegmenterPromise: Promise<ImageSegmenter> | null = null;

/** Lazily creates one shared ImageSegmenter instance (loading the model is
 *  expensive, so both the local and remote feed in a call reuse it). */
function getSegmenter(): Promise<ImageSegmenter> {
  if (!sharedSegmenterPromise) {
    sharedSegmenterPromise = FilesetResolver.forVisionTasks(WASM_BASE_URL).then((vision) =>
      ImageSegmenter.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      })
    );
  }
  return sharedSegmenterPromise;
}

interface UseSelfieSegmentationOptions {
  /** The source video element to read frames from (local camera or remote WebRTC stream). */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Turns the segmentation loop on/off, e.g. only run while an AR call is active. */
  enabled: boolean;
}

/**
 * Runs MediaPipe's selfie segmentation model on a <video> element each
 * frame and paints a background-removed (alpha-masked) version of it onto
 * an offscreen canvas, which is exposed for use as a Three.js texture or
 * direct <canvas> render. The person silhouette keeps its real camera
 * pixels — only the confidence mask is used, so there's no cartoon/avatar
 * substitution, matching the "realistic" presence requirement.
 */
export function useSelfieSegmentation({ videoRef, enabled }: UseSelfieSegmentationOptions) {
  // Lazily create the offscreen output canvas exactly once via useState's
  // initializer (render-safe), rather than assigning into a ref during
  // render.
  const [canvas] = useState<HTMLCanvasElement | null>(() =>
    typeof document !== "undefined" ? document.createElement("canvas") : null
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(canvas);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let rafId = 0;
    let segmenter: ImageSegmenter | null = null;
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

    getSegmenter()
      .then((instance) => {
        if (cancelled) return;
        segmenter = instance;
        setReady(true);
        rafId = requestAnimationFrame(renderLoop);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Couldn't load background segmentation.");
        }
      });

    // Working canvas for the raw (un-feathered) alpha mask, kept separate
    // from the video-frame canvas so a blur filter can be applied to just
    // the alpha channel without blurring the person's actual pixels.
    const alphaCanvas = document.createElement("canvas");
    const alphaCtx = alphaCanvas.getContext("2d", { willReadFrequently: true });

    function handleSegmentResult(result: ImageSegmenterResult, video: HTMLVideoElement) {
      const output = canvasRef.current;
      const confidenceMask = result.confidenceMasks?.[0];
      if (!output || !confidenceMask || !maskCtx || !alphaCtx) return;

      const width = video.videoWidth;
      const height = video.videoHeight;
      if (width === 0 || height === 0) return;

      output.width = width;
      output.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;
      alphaCanvas.width = width;
      alphaCanvas.height = height;

      // Build a thresholded, contrast-boosted alpha mask from the raw
      // per-pixel confidence values (0..1): values below ~0.4 are
      // background noise (treated as fully transparent), values above
      // ~0.75 are confidently "person" (fully opaque), and the narrow band
      // between is a smooth ramp. This avoids the semi-transparent noisy
      // speckle a raw 1:1 confidence-to-alpha mapping produces around
      // hair, fingers, and motion blur.
      const maskData = confidenceMask.getAsFloat32Array();
      const alphaImage = alphaCtx.createImageData(width, height);
      const LOW = 0.4;
      const HIGH = 0.75;
      for (let i = 0; i < maskData.length; i++) {
        const raw = maskData[i];
        let a: number;
        if (raw <= LOW) a = 0;
        else if (raw >= HIGH) a = 255;
        else a = Math.round(((raw - LOW) / (HIGH - LOW)) * 255);
        const offset = i * 4;
        alphaImage.data[offset] = a;
        alphaImage.data[offset + 1] = a;
        alphaImage.data[offset + 2] = a;
        alphaImage.data[offset + 3] = 255;
      }
      alphaCtx.putImageData(alphaImage, 0, 0);

      // Feather the mask edges with a small blur so the cutout blends
      // into its new background instead of showing a razor-sharp,
      // sticker-like edge — a few pixels of softness reads as a natural
      // silhouette edge instead of a pasted graphic.
      alphaCtx.filter = "blur(2px)";
      alphaCtx.drawImage(alphaCanvas, 0, 0);
      alphaCtx.filter = "none";

      const feathered = alphaCtx.getImageData(0, 0, width, height);

      // Composite: draw the real video pixels, then apply the feathered
      // mask as the alpha channel.
      maskCtx.drawImage(video, 0, 0, width, height);
      const frame = maskCtx.getImageData(0, 0, width, height);
      for (let i = 0; i < maskData.length; i++) {
        frame.data[i * 4 + 3] = feathered.data[i * 4];
      }

      const outputCtx = output.getContext("2d");
      outputCtx?.putImageData(frame, 0, 0);
      confidenceMask.close();
    }

    function renderLoop() {
      const video = videoRef.current;
      if (!segmenter || !video || video.readyState < 2) {
        rafId = requestAnimationFrame(renderLoop);
        return;
      }
      segmenter.segmentForVideo(video, performance.now(), (result) => handleSegmentResult(result, video));
      rafId = requestAnimationFrame(renderLoop);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [enabled, videoRef]);

  return { canvasRef, ready, error };
}
