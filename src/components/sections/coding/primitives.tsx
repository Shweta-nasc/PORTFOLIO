"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  CountUp — animates a numeric value (incl. decimals) once it scrolls into   */
/*  view, and re-animates when the value changes (e.g. when live data lands).  */
/* -------------------------------------------------------------------------- */

export function CountUp({
  value,
  duration = 1400,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skeleton — shimmering placeholder for loading states.                      */
/* -------------------------------------------------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-lg bg-white/10",
        className,
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  StatTile — a labelled metric with an animated value + brand accent.        */
/* -------------------------------------------------------------------------- */

export function StatTile({
  label,
  value,
  accent,
  decimals = 0,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  accent: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <p
        className="font-display text-xl font-bold leading-none tracking-tight sm:text-2xl"
        style={{ color: accent }}
      >
        <CountUp value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Avatar — external image (e.g. GitHub) with a graceful initials fallback.   */
/*  The ONLY external image on the site; if it 404s/blocks/times out we swap   */
/*  to an accent initials circle instead of showing a broken-image icon.       */
/* -------------------------------------------------------------------------- */

export function Avatar({
  src,
  alt,
  size = 56,
  accent,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  accent?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = (alt.trim()[0] ?? "?").toUpperCase();

  if (failed || !src) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ring-2 ring-white/10",
          className,
        )}
        style={{
          width: size,
          height: size,
          background: accent ? `${accent}26` : "rgba(255,255,255,0.08)",
          color: accent ?? "currentColor",
        }}
      >
        {initial}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("shrink-0 rounded-full object-cover ring-2 ring-white/10", className)}
      style={{ width: size, height: size }}
    />
  );
}
