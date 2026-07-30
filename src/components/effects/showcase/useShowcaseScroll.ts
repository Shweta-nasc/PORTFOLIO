"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import { clamp } from "@/lib/utils";

interface Options {
  /** The Live Preview block — progress is measured as it scrolls through the viewport. */
  sectionRef: RefObject<HTMLElement>;
  /** The live iframe whose scroll we drive (same-origin). */
  iframeRef: MutableRefObject<HTMLIFrameElement | null>;
  /** Shared progress in [0,1] read by the 3D scene for device motion. */
  progressRef: MutableRefObject<number>;
  /** Wire up only once the showcase is mounted / near the viewport. */
  enabled: boolean;
}

/**
 * Syncs the embedded mini-site's scroll to how far the visitor has scrolled
 * through the Live Preview section: progress 0 = top of page (hero), 1 =
 * footer. The mapping runs from the moment the Live Preview block enters the
 * viewport (progress 0) to the moment the page's footer reaches it (progress
 * 1) — so the mini-site finishes on its own footer right as the real footer
 * arrives, exactly as the section ends.
 *
 * The window scroll handler is throttled with requestAnimationFrame so work
 * happens at most once per frame.
 */
export function useShowcaseScroll({ sectionRef, iframeRef, progressRef, enabled }: Options) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let rafId = 0;
    let queued = false;
    let innerObserver: ResizeObserver | null = null;
    let observedDoc: Element | null = null;

    /** Drive the mini-site's scroll to `progress`, and watch its height so late
     *  content (images / fonts) can't leave us short of its footer. */
    const applyInner = (progress: number) => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      try {
        const doc = win.document.documentElement;
        const max = Math.max(0, doc.scrollHeight - win.innerHeight);
        win.scrollTo(0, progress * max);

        // Re-sync if the embedded document changes size after we last scrolled.
        if (doc !== observedDoc && typeof ResizeObserver !== "undefined") {
          innerObserver?.disconnect();
          observedDoc = doc;
          innerObserver = new ResizeObserver(() => schedule());
          innerObserver.observe(doc);
        }
      } catch {
        /* iframe not ready yet — a later frame will catch up */
      }
    };

    const update = () => {
      queued = false;
      const el = sectionRef.current;
      if (!el) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // 0 when the Live Preview block first enters from the bottom of the viewport.
      const startY = el.getBoundingClientRect().top + scrollY - vh;

      // 1 exactly when the footer reaches the viewport ("the page reaches the
      // footer"). Falls back to the document bottom if no footer is present.
      const footer = document.querySelector("footer");
      const endY = footer
        ? footer.getBoundingClientRect().top + scrollY - vh
        : document.documentElement.scrollHeight - vh;

      const progress = clamp((scrollY - startY) / Math.max(1, endY - startY), 0, 1);
      progressRef.current = progress;

      applyInner(progress);
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Prime it (and again after late layout / iframe load settle).
    update();
    const t1 = window.setTimeout(update, 400);
    const t2 = window.setTimeout(update, 1400);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
      innerObserver?.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [enabled, sectionRef, iframeRef, progressRef]);
}
