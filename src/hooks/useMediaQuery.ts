"use client";

import { useEffect, useState } from "react";

/** Returns whether the given media query currently matches. SSR-safe. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Convenience hook: true when the user prefers reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Convenience hook: true on touch / small viewports. */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
