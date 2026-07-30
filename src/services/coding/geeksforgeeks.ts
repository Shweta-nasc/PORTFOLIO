/**
 * GeeksforGeeks service. GfG has no official public API, so we attempt to read
 * public stats server-side via /api/gfg. If the upstream is unavailable or the
 * shape can't be trusted, the route returns a non-2xx and the card shows a
 * clear "Live statistics unavailable" message — never fabricated numbers.
 */

import { fetchJson } from "./http";
import type { GfgStats } from "./types";

export async function fetchGfgStats(
  username: string,
  signal?: AbortSignal,
): Promise<GfgStats> {
  return fetchJson<GfgStats>(
    `/api/gfg?username=${encodeURIComponent(username)}`,
    signal,
  );
}
