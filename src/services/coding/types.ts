/**
 * Normalized result shapes for the coding-stats services. Every card renders
 * from these types; the raw upstream API responses never leak into the UI.
 */

/* ------------------------------- GitHub ---------------------------------- */

export interface GitHubLanguage {
  name: string;
  count: number;
  /** Share of the top-language set, 0–100. */
  percent: number;
}

export interface GitHubRepo {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
}

export interface GitHubStats {
  avatarUrl: string;
  name: string;
  login: string;
  htmlUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  languages: GitHubLanguage[];
  recentRepos: GitHubRepo[];
}

export interface ContributionDay {
  date: string;
  count: number;
  /** 0–4 intensity bucket. */
  level: number;
}

export interface GitHubContributions {
  total: number;
  days: ContributionDay[];
}

/* ------------------------------ LeetCode --------------------------------- */

export interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  /** Accepted submissions / total submissions, 0–100. */
  acceptanceRate: number;
  ranking: number | null;
  contestRating: number | null;
  contestGlobalRanking: number | null;
  contestsAttended: number | null;
}

/* ----------------------------- Codeforces -------------------------------- */

export interface CodeforcesPoint {
  /** epoch ms */
  t: number;
  rating: number;
}

export interface CodeforcesStats {
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  maxRank: string | null;
  contestCount: number;
  history: CodeforcesPoint[];
}

/* ---------------------------- GeeksforGeeks ------------------------------ */

export interface GfgStats {
  totalSolved: number | null;
  codingScore: number | null;
  instituteRank: number | null;
  currentStreak: number | null;
}
