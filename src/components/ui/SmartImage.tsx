"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Optional short label shown on the placeholder while no image exists. */
  label?: string;
  priority?: boolean;
  rounded?: string;
}

const GRADIENTS = [
  "from-emerald-500/25 via-teal-500/15 to-green-500/25",
  "from-amber-500/25 via-orange-500/15 to-rose-500/25",
  "from-teal-500/25 via-emerald-500/15 to-lime-500/25",
  "from-orange-500/25 via-amber-500/15 to-yellow-500/25",
  "from-green-500/25 via-teal-500/15 to-emerald-500/25",
  "from-rose-500/25 via-orange-500/15 to-amber-500/25",
];

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

/** Number of automatic retries before falling back to the placeholder. */
const MAX_RETRIES = 2;

/**
 * Image with a deterministic gradient placeholder. If the file doesn't exist
 * yet (or fails to load) the placeholder stays visible — so dropping real
 * images into /public later "just works" with zero code changes.
 *
 * Robustness:
 *  - Handles the cached-image race: if the browser already had the image and
 *    it `complete`d before React attached `onLoad` (the classic "sometimes the
 *    image doesn't show until I refresh" bug), a ref check marks it loaded.
 *  - Retries a failed load a couple of times (cache-busted) before giving up,
 *    so a transient dev-server / network hiccup doesn't silently blank it.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  label,
  priority,
  rounded = "rounded-2xl",
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const gradient = gradientFor(alt || src);

  // Reset whenever the source changes.
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setAttempt(0);
  }, [src]);

  // Catch images that finished loading from cache before onLoad was attached.
  const setImgRef = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const handleError = () => {
    setAttempt((prev) => {
      if (prev < MAX_RETRIES) {
        // Back off briefly, then retry with a cache-busted URL below.
        window.setTimeout(() => setAttempt(prev + 1), 250 * (prev + 1));
        return prev; // bump happens in the timeout so the retry re-requests
      }
      setFailed(true);
      return prev;
    });
  };

  // On retry, append a cache-buster so the browser actually re-requests.
  const resolvedSrc =
    attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return (
    <div className={cn("relative overflow-hidden bg-muted", rounded, className)}>
      {/* Gradient placeholder */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-700",
          gradient,
          loaded && !failed ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="absolute inset-0 bg-grid-pattern bg-[size:26px_26px] opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-foreground/50">
          <ImageIcon className="h-6 w-6" />
          {label && (
            <span className="px-4 text-xs font-medium tracking-wide">{label}</span>
          )}
        </div>
      </div>

      {/* Actual image (skipped when there's no src or it permanently failed) */}
      {!failed && Boolean(src) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={setImgRef}
          src={resolvedSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={cn(
            "h-full w-full object-cover transition-all duration-700",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
