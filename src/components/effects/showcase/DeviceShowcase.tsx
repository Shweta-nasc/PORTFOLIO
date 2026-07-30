"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { Loader2, MonitorSmartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useShowcaseScroll } from "./useShowcaseScroll";
import { useIsEmbedded, isEmbeddedNow } from "./embed";
import type { ShowcaseDevice } from "./DeviceShowcaseScene";

const DeviceShowcaseScene = dynamic(() => import("./DeviceShowcaseScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs uppercase tracking-[0.24em]">Preparing preview</span>
      </div>
    </div>
  );
}

/**
 * Premium 3D device showcase for the Contact section. Renders a photorealistic
 * MacBook Pro (desktop / tablet) or smartphone (mobile) in a dark cinematic
 * studio whose screen shows the live portfolio, scrolling Hero → Footer in
 * sync with the page.
 *
 * Purely additive: it mounts lazily when scrolled near, pauses its render loop
 * off-screen, and renders `null` when the portfolio is itself embedded on the
 * screen (prevents infinite recursion).
 */
export function DeviceShowcase({ className }: { className?: string }) {
  const embedded = useIsEmbedded();
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const progressRef = useRef(0);
  const inView = useInView(ref, { margin: "300px 0px 300px 0px" });
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (inView) setActivated(true);
  }, [inView]);

  const device: ShowcaseDevice = isMobile ? "phone" : "laptop";
  const paused = activated && !inView;

  useShowcaseScroll({
    sectionRef: ref,
    iframeRef,
    progressRef,
    enabled: activated && !embedded,
  });

  // Rendered inside the device screen? Render nothing so we never recurse.
  // (Placed after all hooks so hook order stays stable.)
  if (embedded) return null;

  return (
    <div className={cn("relative mt-16 lg:mt-24", className)}>
      <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Framing copy — deliberately quiet so the device leads */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4"
        >
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-accent">
            <MonitorSmartphone className="h-4 w-4" />
            Live preview
          </span>
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            This very site, in your hands
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            The screen mirrors the real portfolio. Keep scrolling and it glides
            from the hero to the footer, finishing right as you arrive.
          </p>
        </motion.div>

        {/* Device stage */}
        <div ref={ref} className="relative">
          {/* Ambient halo — spills around the studio so it belongs to the section */}
          <HaloGlow />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none relative h-[420px] w-full overflow-hidden rounded-[2rem] bg-[#07070d] shadow-card ring-1 ring-inset ring-white/10 sm:h-[480px] md:h-[520px] lg:h-[600px] xl:h-[660px]"
          >
            <div className="absolute inset-0 z-0">
              {activated && !isEmbeddedNow() ? (
                <DeviceShowcaseScene
                  device={device}
                  progressRef={progressRef}
                  iframeRef={iframeRef}
                  reduced={reduced}
                  paused={paused}
                />
              ) : (
                <SceneFallback />
              )}
            </div>

            {/* Very subtle floating particles, above the canvas */}
            <Particles reduced={reduced} />

            {/* Soft vignette + top sheen so the studio melts into the section */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-[2rem]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 42%, transparent 58%, rgba(0,0,0,0.55) 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ambient halo (behind / around the studio card)                           */
/* -------------------------------------------------------------------------- */

function HaloGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10">
      <div className="absolute left-1/2 top-1/2 h-[75%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,hsl(var(--accent)/0.20),transparent_70%)] blur-3xl" />
      {/* Warm ember pool (campfire) */}
      <div className="absolute left-0 top-2 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(240,168,87,0.22),transparent_70%)] blur-3xl" />
      {/* Aurora teal pool */}
      <div className="absolute bottom-0 right-2 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(78,186,140,0.20),transparent_70%)] blur-3xl" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating particles (subtle, above the canvas)                            */
/* -------------------------------------------------------------------------- */

function Particles({ reduced }: { reduced: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${(i * 61) % 100}%`,
        top: `${(i * 37) % 100}%`,
        size: 1 + ((i * 7) % 3),
        delay: (i % 8) * 0.4,
        duration: 5 + ((i * 3) % 5),
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[2rem]">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={reduced ? undefined : { y: [0, -14, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={
            reduced
              ? undefined
              : { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }
          }
        />
      ))}
    </div>
  );
}
