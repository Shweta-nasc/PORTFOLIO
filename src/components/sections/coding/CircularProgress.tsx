"use client";

import { motion } from "framer-motion";
import { CountUp } from "./primitives";

/**
 * Animated circular progress ring for LeetCode's solved / total ratio.
 * The arc draws in on mount; the centre shows an animated solved count.
 */
export function CircularProgress({
  value,
  total,
  accent,
  size = 132,
  stroke = 10,
}: {
  value: number;
  total: number;
  accent: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? Math.min(value / total, 1) : 0;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value} of ${total} problems solved`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - ratio) }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${accent}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp
          value={value}
          className="font-display text-2xl font-bold leading-none"
        />
        <span className="mt-0.5 text-[11px] text-muted-foreground">Solved</span>
      </div>
    </div>
  );
}
