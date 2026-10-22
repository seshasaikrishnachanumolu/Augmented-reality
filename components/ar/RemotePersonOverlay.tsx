"use client";

import { useEffect, useRef } from "react";

interface RemotePersonOverlayProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  active: boolean;
}

/**
 * Non-WebXR fallback for showing the other person on an AR call: a plain
 * 2D canvas that continuously mirrors the background-removed remote video
 * (from useSelfieSegmentation) as a floating cutout over whatever's
 * currently on screen — the `<model-viewer>` 3D fallback or the plain
 * camera preview. This is used on browsers without WebXR immersive-ar
 * support (desktop, iOS Safari), where WebXRHitTestViewer's Three.js scene
 * compositing isn't available.
 */
export function RemotePersonOverlay({ canvasRef, active }: RemotePersonOverlayProps) {
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    let rafId = 0;
    const draw = () => {
      const source = canvasRef.current;
      const display = displayCanvasRef.current;
      if (source && display && source.width > 0 && source.height > 0) {
        if (display.width !== source.width || display.height !== source.height) {
          display.width = source.width;
          display.height = source.height;
        }
        const ctx = display.getContext("2d");
        ctx?.clearRect(0, 0, display.width, display.height);
        ctx?.drawImage(source, 0, 0);
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafId);
  }, [active, canvasRef]);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[6] flex justify-center">
      <canvas ref={displayCanvasRef} className="h-[55vh] w-auto drop-shadow-2xl" />
    </div>
  );
}
