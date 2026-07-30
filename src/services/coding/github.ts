/**
 * GitHub service — OFFICIAL REST API (api.github.com), fetched client-side.
 * api.github.com sends permissive CORS headers, so the browser can read
 * public profile + repo data directly (unauthenticated: 60 req/hr per IP,
 * which is plenty for a portfolio).
 *
 * The contribution calendar is NOT available from REST, so it is fetched from
 * our own /api/github/contributions route (official GraphQL + token, with a
 * tokenless proxy fallback).
 */

import { fetchJson } from "./http";
import type {
  GitHubStats,
  GitHubContributions,
  GitHubRepo,
  GitHubLanguage,
} from "./types";

const API = "https://api.github.com";

interface RawUser {
  avatar_url: string;
  name: string | null;
  login: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

interface RawRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  pushed_at: string;
}

export async function fetchGitHubStats(
  username: string,
  signal?: AbortSignal,
): Promise<GitHubStats> {
  const [user, repos] = await Promise.all([
    fetchJson<RawUser>(`${API}/users/${username}`, signal),
    // Up to 100 most-recently-pushed owned repos (enough to summarise a profile).
    fetchJson<RawRepo[]>(
      `${API}/users/${username}/repos?per_page=100&sort=pushed&type=owner`,
      signal,
    ),
  ]);

  const owned = repos.filter((r) => !r.fork);

  const totalStars = owned.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  // Most-used languages by repo count.
  const counts = new Map<string, number>();
  owned.forEach((r) => {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  });
  const langTotal = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;
  const languages: GitHubLanguage[] = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, percent: Math.round((count / langTotal) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const recentRepos: GitHubRepo[] = [...owned]
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, 4)
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      stars: r.stargazers_count || 0,
      language: r.language,
    }));

  return {
    avatarUrl: user.avatar_url,
    name: user.name || user.login,
    login: user.login,
    htmlUrl: user.html_url,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars,
    languages,
    recentRepos,
  };
}

export async function fetchGitHubContributions(
  username: string,
  signal?: AbortSignal,
): Promise<GitHubContributions> {
  return fetchJson<GitHubContributions>(
    `/api/github/contributions?username=${encodeURIComponent(username)}`,
    signal,
  );
}
