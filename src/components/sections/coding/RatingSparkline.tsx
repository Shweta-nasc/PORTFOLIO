"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CodeforcesPoint } from "@/services/coding/types";

/**
 * Codeforces rating history as a compact area + line sparkline (pure SVG).
 * The line animates in via a stroke-dash reveal.
 */
export function RatingSparkline({
  points,
  accent,
  height = 76,
}: {
  points: CodeforcesPoint[];
  accent: string;
  height?: number;
}) {
  const gradientId = useId();

  if (points.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xs text-muted-foreground"
        style={{ height }}
      >
        Not enough contests for a graph yet
      </div>
    );
  }

  const width = 300;
  const pad = 6;
  const ratings = points.map((p) => p.rating);
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const span = max - min || 1;

  const x = (i: number) => pad + (i / (points.length - 1)) * (width - pad * 2);
  const y = (r: number) => pad + (1 - (r - min) / span) * (height - pad * 2);

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.rating).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${height - pad} L${x(0).toFixed(1)},${height - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Rating history across ${points.length} contests, from ${min} to ${max}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={accent}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
}
