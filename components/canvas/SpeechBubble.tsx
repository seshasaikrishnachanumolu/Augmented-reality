"use client";

import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

interface SpeechBubbleProps {
  text: string;
  yOffset: number;
}

/**
 * A speech-bubble overlay anchored above an object in 3D space, shown while
 * a "Say" block's text is active during Play Mode.
 */
export function SpeechBubble({ text, yOffset }: SpeechBubbleProps) {
  return (
    <Html position={[0, yOffset, 0]} center distanceFactor={8} zIndexRange={[45, 0]}>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="relative max-w-[200px] select-none rounded-2xl bg-white px-3.5 py-2 text-center text-xs font-medium text-surface-900 shadow-soft-lg"
      >
        {text}
        <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-white" />
      </motion.div>
    </Html>
  );
}
