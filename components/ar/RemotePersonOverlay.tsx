"use client";

import { useEffect, useRef } from "react";

interface RemotePersonOverlayProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  active: boolean;
}

/**
 * Non-WebXR fallback for showing the other person on an AR call: a 2D
 * canvas that mirrors the background-removed remote video (from
 * useSelfieSegmentation), drawn large and anchored to the bottom of the
 * frame like someone standing in the room, with a soft contact shadow at
 * their feet to ground them in the scene instead of reading as a flat
 * cutout floating over the background. Used on browsers without WebXR
 * immersive-ar support (desktop, iOS Safari), where
 * WebXRHitTestViewer's Three.js scene compositing isn't available.
 */
export function RemotePersonOverlay({ canvasRef, active }: RemotePersonOverlayProps) {
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active) return;

    let rafId = 0;
    const draw = () => {
      const source = canvasRef.current;
      const display = displayCanvasRef.current;
      const container = containerRef.current;

      if (source && display && container && source.width > 0 && source.height > 0) {
        if (display.width !== source.width || display.height !== source.height) {
          display.width = source.width;
          display.height = source.height;
        }

        const ctx = display.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, display.width, display.height);

          // Soft contact shadow at the person's feet (bottom ~12% of the
          // frame), drawn before the person so it sits "under" them — this
          // single cue does more to sell "standing in the room" than any
          // amount of mask cleanup alone.
          const shadowY = display.height * 0.9;
          const shadowGradient = ctx.createRadialGradient(
            display.width / 2,
            shadowY,
            0,
            display.width / 2,
            shadowY,
            display.width * 0.38
          );
          shadowGradient.addColorStop(0, "rgba(0,0,0,0.38)");
          shadowGradient.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = shadowGradient;
          ctx.fillRect(0, display.height * 0.78, display.width, display.height * 0.22);

          ctx.drawImage(source, 0, 0);
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafId);
  }, [active, canvasRef]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] flex justify-center"
    >
      {/* Anchored to the bottom of the screen (feet at the frame's edge,
          like someone standing on the floor just in view) rather than
          floating mid-frame. Height is a large fraction of the viewport
          so they read as present-sized, not a small sticker. */}
      <canvas ref={displayCanvasRef} className="h-[78vh] w-auto max-w-full object-contain" />
    </div>
  );
}
