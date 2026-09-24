"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The N is traced from the supplied blackletter reference (not reconstructed
 * from three generic stems). The section divider stays the fine needle line.
 */
const GLYPH_OUTLINE_D = "M85.25 0 Q88 -1 90.75 -1.5 L90.75 1.5 C85 2 83.75 7 83.75 13.5 L84.25 50.25 86 80.5 88 90.25 92.5 92.5 93 94 C79 93.5 67.5 103.5 65 116 L63.25 116 64 111.25 61 101.75 57.25 96 51.25 91.75 58 88.75 61.75 84.5 63.5 76.75 63 69 57.75 57.25 48 40 36 25.25 37 67.75 38 71.25 40.75 75 35.25 77.75 34.75 79.5 44.25 89 49 97.25 50.25 101.5 49.75 104.5 41 112.5 C40 102 25 83 13 83 C18 79 22 74 25.25 73.5 L24 53.5 22.5 50.5 19.5 49 20 48 24 47.25 23.25 32.75 19.5 26.5 23.75 23.75 35.25 8.25 41.25 4.25 40.5 6 41.25 9.25 C55 27 66 46 72 59.25 L71 36.25 69 27 66 21.75 71 18 78.25 6.25Z";
const GLYPH_CUTOUT_D = "M72 67.5 67 74 64.25 82.75 71.75 92 73.75 93 73 67.75Z";
const GLYPH_D = `${GLYPH_OUTLINE_D} ${GLYPH_CUTOUT_D}`;

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
      viewBox="0 -3 112 120"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <motion.path
        d={GLYPH_OUTLINE_D}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.85"
        initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, ease: [0.65, 0, 0.35, 1], delay }}
      />
      <motion.path
        d={GLYPH_D}
        fill="currentColor"
        fillRule="evenodd"
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.85, ease: "easeOut", delay: delay + (shouldReduceMotion ? 0 : 0.5) }}
      />
    </svg>
  );
}
