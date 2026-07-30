/**
 * Codeforces service — OFFICIAL public API (codeforces.com/api), fetched
 * client-side. The API is CORS-enabled, so the browser can call it directly.
 *   - user.info    → rating / maxRating / rank / maxRank
 *   - user.rating  → full rating history (→ contest count + graph)
 */

import { fetchJson } from "./http";
import type { CodeforcesStats, CodeforcesPoint } from "./types";

const API = "https://codeforces.com/api";

interface CfInfoResponse {
  status: "OK" | "FAILED";
  comment?: string;
  result?: {
    rating?: number;
    maxRating?: number;
    rank?: string;
    maxRank?: string;
  }[];
}

interface CfRatingResponse {
  status: "OK" | "FAILED";
  comment?: string;
  result?: { ratingUpdateTimeSeconds: number; newRating: number }[];
}

export async function fetchCodeforcesStats(
  handle: string,
  signal?: AbortSignal,
): Promise<CodeforcesStats> {
  const info = await fetchJson<CfInfoResponse>(
    `${API}/user.info?handles=${encodeURIComponent(handle)}`,
    signal,
  );
  if (info.status !== "OK" || !info.result?.length) {
    throw new Error(info.comment || "Codeforces profile not found");
  }
  const u = info.result[0];

  let history: CodeforcesPoint[] = [];
  let contestCount = 0;
  try {
    const rating = await fetchJson<CfRatingResponse>(
      `${API}/user.rating?handle=${encodeURIComponent(handle)}`,
      signal,
    );
    if (rating.status === "OK" && rating.result) {
      history = rating.result.map((r) => ({
        t: r.ratingUpdateTimeSeconds * 1000,
        rating: r.newRating,
      }));
      contestCount = rating.result.length;
    }
  } catch {
    // rating history is optional — an unrated user still has a valid profile
  }

  return {
    rating: u.rating ?? null,
    maxRating: u.maxRating ?? null,
    rank: u.rank ?? null,
    maxRank: u.maxRank ?? null,
    contestCount,
    history,
  };
}
