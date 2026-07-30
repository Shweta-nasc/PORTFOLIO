"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A soft glow plus a precise ring that trail the cursor. The ring snaps to
 * interactive elements for an "aware" feel. Disabled on touch / reduced-motion.
 */
export function CursorGlow() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28 });
  const glowX = useSpring(x, { stiffness: 120, damping: 20 });
  const glowY = useSpring(y, { stiffness: 120, damping: 20 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobile || reduced) return;

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(
        Boolean(target.closest("a, button, [data-cursor-hover], input, textarea")),
      );
    }

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isMobile, reduced, x, y]);

  if (isMobile || reduced || !mounted) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[80px]"
        style={{
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.5), transparent 60%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70 mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: hovering ? 44 : 26,
          height: hovering ? 44 : 26,
          opacity: hovering ? 1 : 0.7,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
}
