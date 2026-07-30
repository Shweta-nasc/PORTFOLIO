"use client";

import { useEffect, useState } from "react";

/**
 * Embed protocol for the Live Preview.
 *
 * The device screen loads the site's own root route with `?embed=1`. When that
 * param is present the site skips the heavy chrome that would otherwise run
 * inside the laptop — most importantly the Live Preview section itself, so it
 * can never embed itself recursively.
 */
export const EMBED_PARAM = "embed";

/** iframe src — the real site, flagged as embedded. */
export const EMBED_SRC = `/?${EMBED_PARAM}=1`;

/** Read synchronously on the client (SSR-safe: false until mounted). */
function readEmbedded(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get(EMBED_PARAM) === "1";
  } catch {
    return false;
  }
}

/**
 * `true` when the current document is the copy rendered inside the device
 * screen. Starts `false` on the server and first client render (so hydration
 * matches), then resolves after mount.
 */
export function useIsEmbedded(): boolean {
  const [embedded, setEmbedded] = useState(false);
  useEffect(() => {
    setEmbedded(readEmbedded());
  }, []);
  return embedded;
}

/**
 * Synchronous embed check for client-only branches (e.g. gating a lazily
 * mounted, `ssr:false` WebGL scene). Safe to use for content that never
 * server-renders — it deterministically prevents the embedded copy from
 * mounting the device iframe (which would recurse) without waiting for an
 * effect, and without risking a hydration mismatch.
 */
export function isEmbeddedNow(): boolean {
  return readEmbedded();
}
