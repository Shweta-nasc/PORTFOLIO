/**
 * LeetCode service. LeetCode's GraphQL endpoint blocks cross-origin browser
 * requests (CORS), so we proxy through our own /api/leetcode route which calls
 * the official leetcode.com/graphql server-side.
 */

import { fetchJson } from "./http";
import type { LeetCodeStats } from "./types";

export async function fetchLeetCodeStats(
  username: string,
  signal?: AbortSignal,
): Promise<LeetCodeStats> {
  return fetchJson<LeetCodeStats>(
    `/api/leetcode?username=${encodeURIComponent(username)}`,
    signal,
  );
}
