"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "@/lib/utils/clsx";

export interface IconButtonProps extends HTMLMotionProps<"button"> {
  active?: boolean;
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, active, label, children, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={clsx(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
        active
          ? "bg-brand-500 text-white shadow-soft"
          : "bg-surface-0 text-surface-900 border border-surface-200 hover:bg-surface-50",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
