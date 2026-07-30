"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import TerrainCanvas from "./TerrainCanvas";
import { useAmbientAudio } from "./useAmbientAudio";
import { seasonAt, phaseLabel } from "./season-config";
import { clamp } from "./terrain-noise";

/**
 * The living cinematic world behind all content. A scroll-driven React Three
 * Fiber scene that journeys through the seasons (spring → winter) and the day
 * (morning → night): procedural alpine terrain, seasonal particles, weather,
 * volumetric-style clouds, tone-mapped lighting. A soft scrim keeps foreground
 * text readable, and a small HUD + ambience toggle let visitors feel (and hear)
 * where they are in the journey.
 */
export function WorldBackground() {
  const [mounted, setMounted] = useState(false);
  const [hud, setHud] = useState({ name: "Spring", phase: "Morning", accent: "#f4a9c4" });
  const { enabled, toggle } = useAmbientAudio();

  useEffect(() => setMounted(true), []);

  // Lightweight DOM-side scroll read for the HUD (independent of the canvas).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      const s = seasonAt(p);
      const phase = phaseLabel(p);
      setHud((prev) =>
        prev.name === s.name && prev.phase === phase
          ? prev
          : { name: s.name, phase, accent: s.accent },
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {mounted && <TerrainCanvas />}

        {/* Readability scrim — kept light so the landscape stays visible */}
        <div className="absolute inset-0 bg-[hsl(var(--background))]/26" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, transparent 58%, hsl(var(--background) / 0.5) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: "linear-gradient(to bottom, transparent, hsl(var(--background) / 0.55))",
          }}
        />
      </motion.div>

      {/* Journey HUD + nature-ambience toggle */}
      {mounted && (
        <div className="pointer-events-none fixed bottom-5 left-5 z-40 flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Mute nature ambience" : "Play nature ambience"}
            className="glass pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-accent"
          >
            {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <div className="glass hidden items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-foreground/75 sm:flex">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: hud.accent, boxShadow: `0 0 8px ${hud.accent}` }}
            />
            <span>{hud.name}</span>
            <span className="text-foreground/35">·</span>
            <span className="text-foreground/55">{hud.phase}</span>
          </div>
        </div>
      )}
    </>
  );
}
