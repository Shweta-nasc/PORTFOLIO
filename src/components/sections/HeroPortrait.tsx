"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { personal } from "@/data/config";

/**
 * Transparent-PNG portrait that blends into the 3D scene — no card, no circle.
 * Reacts to the cursor with a max 3° tilt, a slight translate, a soft
 * silhouette-accurate ground shadow, and warm rim lighting from the sun side.
 */
export function HeroPortrait() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Cached-image race guard: if the browser already had the portrait cached and
  // it finished loading before React attached `onLoad`, the opacity gate would
  // otherwise leave it invisible until a refresh. Mark it loaded on ref attach.
  const setImgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });

  // Max 3° tilt.
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3, 3]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const translateX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const translateY = useTransform(sy, [-0.5, 0.5], [-6, 6]);
  const shadowX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const shadowScale = useTransform(sx, [-0.5, 0, 0.5], [0.92, 1, 0.92]);
  const glowX = useTransform(sx, [-0.5, 0.5], [12, -12]);

  useEffect(() => {
    if (isMobile || reduced) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile, reduced, mx, my]);

  return (
    <div className="relative mx-auto hidden h-[540px] w-full max-w-sm md:block [perspective:1200px]">
      {/* Warm ambient / rim glow from the sun side (upper-left) */}
      <motion.div
        style={{ x: glowX }}
        className="pointer-events-none absolute left-[42%] top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/25 blur-[80px]"
      />

      {/* Portrait */}
      <motion.div
        style={{ rotateX, rotateY, x: translateX, y: translateY, transformStyle: "preserve-3d" }}
        className="relative z-10 flex h-full items-end justify-center"
      >
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={setImgRef}
            src={personal.portrait}
            alt={personal.name}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className="h-full w-auto object-contain object-bottom drop-shadow-[0_28px_38px_rgba(0,0,0,0.55)]"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
          />
        ) : (
          <PortraitPlaceholder />
        )}

        {/* Rim light hugging the sun-facing edge */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-100/15 via-transparent to-transparent mix-blend-screen" />
      </motion.div>

      {/* Soft ground shadow (follows tilt) */}
      <motion.div
        style={{ x: shadowX, scaleX: shadowScale }}
        className="pointer-events-none absolute bottom-3 left-1/2 h-9 w-64 -translate-x-1/2 rounded-[100%] bg-black/45 blur-2xl"
      />
    </div>
  );
}

function PortraitPlaceholder() {
  return (
    <div className="relative flex h-full w-64 items-end justify-center">
      {/* shoulders */}
      <div className="absolute bottom-0 h-[64%] w-52 rounded-t-[7rem] bg-gradient-to-b from-white/[0.12] to-white/[0.03] backdrop-blur-sm" />
      {/* head */}
      <div className="absolute bottom-[52%] h-24 w-24 rounded-full bg-white/[0.12]" />
      <span className="absolute bottom-5 z-10 text-[11px] tracking-wide text-muted-foreground/70">
        Add {personal.portrait}
      </span>
    </div>
  );
}
