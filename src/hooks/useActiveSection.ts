"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view using IntersectionObserver.
 * Powers the navbar scroll-spy highlight.
 */
export function useActiveSection(sectionIds: string[], offset = 0.4): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          // Pick the most-visible section.
          let best = active;
          let bestRatio = 0;
          visible.forEach((ratio, key) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = key;
            }
          });
          if (bestRatio > 0) setActive(best);
        },
        { threshold: [0, offset, 0.6, 1], rootMargin: "-10% 0px -35% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(","), offset]);

  return active;
}
