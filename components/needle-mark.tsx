"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Needl's signature device: a single unbroken line, drawn like a stencil
 * pass, that resolves into an "N" formed from one continuous needle stroke.
 * Reused at hero scale, as the header wordmark glyph, and as a thin
 * horizontal section divider (see `variant`).
 */
export function NeedleMark({
  className,
  variant = "mark",
  delay = 0,
}: {
  className?: string;
  variant?: "mark" | "divider";
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 1.5;

  if (variant === "divider") {
    return (
      <svg
        viewBox="0 0 400 12"
        fill="none"
        className={cn("w-full", className)}
        aria-hidden
      >
        <motion.path
          d="M0 6 Q 40 0, 80 6 T 160 6 T 240 6 T 320 6 T 400 6"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: duration * 0.8, ease: [0.65, 0, 0.35, 1], delay }}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <motion.path
        d="M22 96 L22 26 L96 96 L96 26 M84 14 L108 38"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, ease: [0.65, 0, 0.35, 1], delay }}
      />
    </svg>
  );
}
