"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, X, BookOpen, Feather } from "lucide-react";
import { journalPages, journalMeta } from "@/data/journal";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const pages = journalPages;

/**
 * Leather journal that flips open on its spine.
 *
 * Reliability notes:
 *  - The click target is a flat, full-area `<button>` overlay (never itself
 *    3D-transformed). Earlier the cover *was* the button and a `whileHover`
 *    rotateY tilted it in perspective, which destabilised hit-testing and made
 *    "click to open" miss. Decoupling the hit target from the animated cover
 *    makes both mouse clicks and touch taps land every time.
 *  - `animating` locks the trigger for the duration of the flip so rapid taps
 *    can't desync the open/closed state.
 *  - `prefers-reduced-motion` falls back to an instant cross-fade.
 */
export function InteractiveBook({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const reduced = usePrefersReducedMotion();

  const page = pages[index];

  // Open/close, locked while the cover is mid-flip.
  function toggle() {
    if (animating) return;
    setAnimating(true);
    setHovered(false);
    setOpen((o) => !o);
  }

  function go(next: number, direction: number) {
    if (next < 0 || next >= pages.length) return;
    setDir(direction);
    setIndex(next);
  }

  // Keyboard: arrows flip pages, Escape closes (respecting the lock).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowRight") {
        setDir(1);
        setIndex((i) => Math.min(i + 1, pages.length - 1));
      } else if (e.key === "ArrowLeft") {
        setDir(-1);
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape" && !animating) {
        setAnimating(true);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, animating]);

  const pageVariants: Variants = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({ rotateY: d > 0 ? 38 : -38, x: d > 0 ? 44 : -44, opacity: 0 }),
        center: { rotateY: 0, x: 0, opacity: 1 },
        exit: (d: number) => ({ rotateY: d > 0 ? -38 : 38, x: d > 0 ? -44 : 44, opacity: 0 }),
      };

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-sm select-none [perspective:2200px]",
        className,
      )}
    >
      <div className="relative h-[480px] w-full [transform-style:preserve-3d] sm:h-[540px]">
        {/* ---------------- Journal content (revealed behind the cover) ---------------- */}
        <div
          aria-hidden={!open}
          className={cn(
            "absolute inset-0 overflow-hidden rounded-lg bg-[#f4ecdd] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{
            transition: `opacity ${reduced ? "0.25s" : "0.45s"} ${
              open && !reduced ? "0.2s" : "0s"
            } ease`,
          }}
        >
          {/* Paper grain + spine shadow */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(circle_at_20%_10%,rgba(120,90,50,0.08),transparent_40%),radial-gradient(circle_at_85%_90%,rgba(120,90,50,0.1),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#d8caae]/70 to-transparent" />
          {/* Margin line */}
          <div className="pointer-events-none absolute inset-y-6 left-10 w-px bg-[#c9613f]/30" />

          {/* Close */}
          <button
            type="button"
            onClick={toggle}
            disabled={animating}
            aria-label="Close journal"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 touch-manipulation items-center justify-center rounded-full bg-[#2c2418]/10 text-[#5b4a33] transition-colors hover:bg-[#2c2418]/20 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Flipping content */}
          <div className="relative h-full [perspective:1600px]">
            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={page.id}
                custom={dir}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduced ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center" }}
                className="absolute inset-0 flex flex-col px-8 pb-16 pt-9"
              >
                <div className="mb-5 flex items-center gap-3 border-b border-[#c9613f]/20 pb-4 pl-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c2418]/8 text-[#7a4a24]">
                    <page.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#a9906a]">
                      Entry {index + 1}
                    </p>
                    <h3 className="font-display text-xl font-bold text-[#2c2012]">
                      {page.title}
                    </h3>
                  </div>
                </div>

                <ul className="flex-1 space-y-3.5 pl-6">
                  {page.entries.map((entry) => (
                    <li key={entry.label} className="flex gap-3">
                      <Feather className="mt-0.5 h-4 w-4 shrink-0 text-[#a56a34]" />
                      <div>
                        <p className="font-medium leading-snug text-[#2c2418]">
                          {entry.label}
                        </p>
                        {entry.note && (
                          <p className="text-sm italic text-[#7c6a4e]">{entry.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-[#c9613f]/15 bg-[#efe6d4]/60 px-5 py-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              disabled={index === 0}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#5b4a33] transition-colors enabled:hover:bg-[#2c2418]/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {pages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Go to ${p.title}`}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? "w-5 bg-[#a56a34]"
                      : "w-1.5 bg-[#2c2418]/25 hover:bg-[#2c2418]/40",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              disabled={index === pages.length - 1}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#5b4a33] transition-colors enabled:hover:bg-[#2c2418]/10 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ---------------- Cover: flips open on its left spine ---------------- */}
        <motion.div
          aria-hidden
          initial={false}
          animate={
            reduced
              ? { opacity: open ? 0 : 1 }
              : {
                  rotateY: open ? -158 : 0,
                  scale: hovered && !open ? 1.03 : 1,
                  y: hovered && !open ? -4 : 0,
                }
          }
          transition={
            reduced
              ? { duration: 0.25, ease: "easeInOut" }
              : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
          }
          onAnimationComplete={() => setAnimating(false)}
          style={{ transformOrigin: "left center", pointerEvents: "none" }}
          className="absolute inset-0 overflow-hidden rounded-l-sm rounded-r-lg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] [backface-visibility:hidden] [transform-style:preserve-3d]"
        >
          {/* Leather */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4a2f1c] via-[#3a2416] to-[#231307]" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_20%,rgba(255,220,170,0.12),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.35),transparent_50%)]" />
          {/* Spine */}
          <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-[#180d04] to-transparent" />
          {/* Stitched border */}
          <div className="absolute inset-3 rounded-md border border-dashed border-[#7a5533]/50" />

          <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c8a86a]/40 bg-[#2a1a0d]/60 text-[#e7c884]">
              <BookOpen className="h-7 w-7" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-[#ecd39a] [text-shadow:0_1px_1px_rgba(0,0,0,0.5)]">
                {journalMeta.title}
              </h3>
              <p className="mt-2 text-sm text-[#c9a877]">{journalMeta.subtitle}</p>
            </div>
            <span
              className={cn(
                "mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition-colors",
                hovered && !open
                  ? "border-[#c8a86a]/70 text-[#ecd39a]"
                  : "border-[#7a5533]/50 text-[#c9a877]",
              )}
            >
              Click to open
            </span>
          </div>

          {/* Right page-edges */}
          <div className="absolute inset-y-2 right-0 w-2 rounded-r-lg bg-[repeating-linear-gradient(180deg,#efe6d4_0px,#efe6d4_2px,#cdbfa4_3px,#cdbfa4_4px)]" />

          {/* Hover glow */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-r-lg transition-opacity duration-300",
              hovered && !open ? "opacity-100" : "opacity-0",
            )}
            style={{
              boxShadow:
                "0 0 55px -8px rgba(240,168,87,0.55), inset 0 0 42px rgba(240,168,87,0.14)",
            }}
          />
        </motion.div>

        {/* ---------------- Trigger: flat, stable hit target while closed ---------------- */}
        {!open && (
          <button
            type="button"
            onClick={toggle}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            disabled={animating}
            aria-label="Open the engineering journal"
            className="absolute inset-0 z-20 cursor-pointer touch-manipulation rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7c884]/70"
          />
        )}
      </div>
    </div>
  );
}
