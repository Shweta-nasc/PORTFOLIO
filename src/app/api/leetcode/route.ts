import { NextResponse, type NextRequest } from "next/server";
import type { LeetCodeStats } from "@/services/coding/types";

/**
 * LeetCode stats via the OFFICIAL leetcode.com/graphql endpoint, called
 * server-side to bypass the browser CORS restriction. No auth required for
 * public profile data.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE = "public, s-maxage=1800, stale-while-revalidate=86400";

const QUERY = `
  query userData($username: String!) {
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
    }
    allQuestionsCount { difficulty count }
    userContestRanking(username: $username) {
      rating
      globalRanking
      attendedContestsCount
    }
  }
`;

interface DiffCount {
  difficulty: string;
  count: number;
  submissions: number;
}

function pick(list: DiffCount[] | undefined, difficulty: string): DiffCount | undefined {
  return list?.find((d) => d.difficulty === difficulty);
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  let json: {
    data?: {
      matchedUser: {
        profile: { ranking: number | null };
        submitStatsGlobal: {
          acSubmissionNum: DiffCount[];
          totalSubmissionNum: DiffCount[];
        };
      } | null;
      allQuestionsCount: { difficulty: string; count: number }[];
      userContestRanking: {
        rating: number | null;
        globalRanking: number | null;
        attendedContestsCount: number | null;
      } | null;
    };
  };

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/u/${username}/`,
        "User-Agent": "Mozilla/5.0 (portfolio coding dashboard)",
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`LeetCode GraphQL ${res.status}`);
    json = await res.json();
  } catch {
    return NextResponse.json({ error: "LeetCode is unavailable" }, { status: 502 });
  }

  const mu = json.data?.matchedUser;
  if (!mu) {
    return NextResponse.json({ error: "LeetCode user not found" }, { status: 404 });
  }

  const ac = mu.submitStatsGlobal.acSubmissionNum;
  const totalSub = mu.submitStatsGlobal.totalSubmissionNum;
  const totals = json.data?.allQuestionsCount ?? [];
  const totalBy = (d: string) => totals.find((t) => t.difficulty === d)?.count ?? 0;

  const acAll = pick(ac, "All");
  const totAll = pick(totalSub, "All");
  const acceptanceRate =
    acAll && totAll && totAll.submissions > 0
      ? Math.round((acAll.submissions / totAll.submissions) * 1000) / 10
      : 0;

  const contest = json.data?.userContestRanking;

  const stats: LeetCodeStats = {
    totalSolved: acAll?.count ?? 0,
    totalQuestions: totalBy("All"),
    easySolved: pick(ac, "Easy")?.count ?? 0,
    easyTotal: totalBy("Easy"),
    mediumSolved: pick(ac, "Medium")?.count ?? 0,
    mediumTotal: totalBy("Medium"),
    hardSolved: pick(ac, "Hard")?.count ?? 0,
    hardTotal: totalBy("Hard"),
    acceptanceRate,
    ranking: mu.profile.ranking ?? null,
    contestRating: contest?.rating != null ? Math.round(contest.rating) : null,
    contestGlobalRanking: contest?.globalRanking ?? null,
    contestsAttended: contest?.attendedContestsCount ?? null,
  };

  return NextResponse.json(stats, { headers: { "Cache-Control": CACHE } });
}
