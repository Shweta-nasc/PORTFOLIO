/**
 * ─────────────────────────────────────────────────────────────────────────
 *  CODING PROFILE CONFIG — single source of truth for platform usernames
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Every coding-stats service, server route and card reads usernames ONLY
 *  from this file. Statistics themselves are NEVER hardcoded — they are
 *  fetched live at runtime (see `src/services/coding/*`). This module only
 *  holds identity (username) + presentation (label / brand accent / URL).
 *
 *  Usernames can be overridden per-environment via NEXT_PUBLIC_* vars; the
 *  literals here are the committed defaults.
 */

export type PlatformId = "github" | "leetcode" | "codeforces" | "geeksforgeeks";

/** The one place usernames live. */
export const profile: Record<PlatformId, string> = {
  github: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "Shweta-nasc",
  leetcode: process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? "Rookie_engicoder",
  codeforces: process.env.NEXT_PUBLIC_CODEFORCES_USERNAME ?? "RookieCodes_0805",
  geeksforgeeks: process.env.NEXT_PUBLIC_GEEKSFORGEEKS_USERNAME ?? "shwetasi85do",
};

export interface PlatformMeta {
  id: PlatformId;
  label: string;
  /** Brand-colored accent used for the card's identity. */
  accent: string;
  username: string;
  profileUrl: string;
}

/** Presentation metadata + resolved profile URLs (order = render order). */
export const codingPlatforms: PlatformMeta[] = [
  {
    id: "github",
    label: "GitHub",
    accent: "#a371f7",
    username: profile.github,
    profileUrl: `https://github.com/${profile.github}`,
  },
  {
    id: "leetcode",
    label: "LeetCode",
    accent: "#ffa116",
    username: profile.leetcode,
    profileUrl: `https://leetcode.com/u/${profile.leetcode}`,
  },
  {
    id: "codeforces",
    label: "Codeforces",
    accent: "#1f8acb",
    username: profile.codeforces,
    profileUrl: `https://codeforces.com/profile/${profile.codeforces}`,
  },
  {
    id: "geeksforgeeks",
    label: "GeeksforGeeks",
    accent: "#2f8d46",
    username: profile.geeksforgeeks,
    profileUrl: `https://www.geeksforgeeks.org/user/${profile.geeksforgeeks}/`,
  },
];

export function platformMeta(id: PlatformId): PlatformMeta {
  const found = codingPlatforms.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown coding platform: ${id}`);
  return found;
}
