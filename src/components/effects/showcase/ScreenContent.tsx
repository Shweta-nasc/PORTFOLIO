"use client";

import { type MutableRefObject } from "react";
import { Html } from "@react-three/drei";
import { EMBED_SRC } from "./embed";

/**
 * drei renders `<Html transform>` through a CSS-3D layer. Its on-screen size is
 * governed by `distanceFactor` via the library's internal `(distanceFactor||10)/400`
 * term — NOT by a raw scale. So to make a `pixelWidth`-wide document exactly
 * fill a `worldWidth`-wide screen we solve for the factor below.
 */
const DREI_HTML_UNIT = 400;

interface ScreenContentProps {
  /** Active-display size in world units (local to the lid). */
  screenWidth: number;
  screenHeight: number;
  /** Intrinsic CSS width of the embedded document (drives its responsive breakpoints). */
  pixelWidth: number;
  /** CSS corner radius (px) for the rounded display. */
  cornerRadius?: number;
  /** The live iframe — the parent drives its scroll position directly. */
  iframeRef: MutableRefObject<HTMLIFrameElement | null>;
  /** Shared scroll progress in [0,1]; used to sync the iframe once it loads. */
  progressRef: MutableRefObject<number>;
}

/**
 * Mounts the live site (`/?embed=1`) onto the device's display plane via a
 * CSS-3D `<Html transform>` layer, so the real, crisp website is corner-pinned
 * to the screen's actual four corners and shares its full 3D perspective.
 *
 * How the corners pin exactly:
 *  - `transform` renders the document through drei's CSS-3D layer using the
 *    host group's `matrixWorld`, so the content inherits the lid's exact
 *    position, rotation (tilt) and scale — never a flat, straight-on overlay.
 *  - The host group is seated coplanar with the emissive display plane (see
 *    MacBook/Phone models), so there's no z-parallax gap that would reveal the
 *    bezel glow at an angle.
 *  - `distanceFactor` is solved so a `pixelWidth`-wide document maps to exactly
 *    `screenWidth` world units (drei sizes transform-mode HTML by the internal
 *    `(distanceFactor/400)` term), so the content is precisely the active-area
 *    size — its corners land on the screen's corners.
 *
 * We intentionally do NOT pass `occlude`: `occlude="blending"` needs a
 * transparent canvas to show the DOM through depth "holes", but this scene's
 * canvas is opaque (required for Bloom/DoF/Vignette to composite correctly),
 * and raycast `occlude` would flicker the whole iframe off at grazing angles.
 * Because the content is exactly screen-sized and coplanar it never overhangs
 * the bezel, so occlusion isn't needed for a seated look.
 *
 * A glass overlay adds screen reflections. Scrolling is driven from the parent
 * through {@link iframeRef}.
 */
export function ScreenContent({
  screenWidth,
  screenHeight,
  pixelWidth,
  cornerRadius = 10,
  iframeRef,
  progressRef,
}: ScreenContentProps) {
  const pixelHeight = Math.round(pixelWidth * (screenHeight / screenWidth));
  const distanceFactor = (screenWidth * DREI_HTML_UNIT) / pixelWidth;

  function syncOnLoad() {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      const max = Math.max(0, win.document.documentElement.scrollHeight - win.innerHeight);
      win.scrollTo(0, progressRef.current * max);
    } catch {
      /* not ready / cross-origin — the scroll handler will retry */
    }
  }

  return (
    <Html
      transform
      distanceFactor={distanceFactor}
      position={[0, 0, 0]}
      zIndexRange={[9, 0]}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div
        style={{
          width: pixelWidth,
          height: pixelHeight,
          borderRadius: cornerRadius,
          overflow: "hidden",
          position: "relative",
          background: "#050506",
          backfaceVisibility: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <iframe
          ref={iframeRef}
          src={EMBED_SRC}
          title="Live portfolio preview"
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          onLoad={syncOnLoad}
          style={{
            width: "100%",
            height: "100%",
            border: "0",
            display: "block",
            pointerEvents: "none",
            colorScheme: "dark",
          }}
        />

        {/* Glass sheen — diagonal reflection across the display */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 18%, rgba(255,255,255,0) 42%, rgba(255,255,255,0) 100%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Cool top glow + soft edge vignette for depth */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(120% 60% at 50% -10%, rgba(169,199,255,0.12), rgba(0,0,0,0) 60%), inset 0 0 40px rgba(0,0,0,0.45)",
          }}
        />
      </div>
    </Html>
  );
}
