"use client";

import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

interface ExpressionBubbleProps {
  emoji: string;
  yOffset: number;
}

/**
 * A small floating emoji cue shown above a character while a "Set
 * expression" block is active during Play Mode — a lightweight stand-in for
 * facial animation on primitive-geometry characters that don't have rigged faces.
 */
export function ExpressionBubble({ emoji, yOffset }: ExpressionBubbleProps) {
  return (
    <Html position={[0, yOffset, 0]} center distanceFactor={8} zIndexRange={[46, 0]}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 8 }}
        animate={{ opacity: 1, scale: 1.15, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="select-none text-3xl drop-shadow"
      >
        {emoji}
      </motion.div>
    </Html>
  );
}
