import { NextResponse, type NextRequest } from "next/server";
import type { ContributionDay, GitHubContributions } from "@/services/coding/types";

/**
 * GitHub contribution calendar.
 *
 * The calendar is only exposed by the OFFICIAL GitHub GraphQL API, which needs
 * a token. We keep that token server-side (GITHUB_TOKEN) so it is never shipped
 * to the browser. If no token is configured, we fall back to a public tokenless
 * proxy of the same official calendar, so the heatmap still works out of the box.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const GQL = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }
`;

async function viaGraphQL(username: string, token: string): Promise<GitHubContributions> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GQL, variables: { login: username } }),
    signal: AbortSignal.timeout(9000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("No contribution calendar in response");

  const days: ContributionDay[] = [];
  for (const week of calendar.weeks as { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[]) {
    for (const d of week.contributionDays) {
      days.push({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 });
    }
  }
  return { total: calendar.totalContributions ?? 0, days };
}

interface ProxyResponse {
  total?: Record<string, number>;
  contributions?: { date: string; count: number; level: number }[];
}

async function viaProxy(username: string): Promise<GitHubContributions> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    { signal: AbortSignal.timeout(9000), cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Contributions proxy ${res.status}`);
  const json = (await res.json()) as ProxyResponse;
  const days: ContributionDay[] = (json.contributions ?? []).map((d) => ({
    date: d.date,
    count: d.count,
    level: d.level,
  }));
  const total = days.reduce((sum, d) => sum + d.count, 0);
  return { total, days };
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    try {
      const data = await viaGraphQL(username, token);
      return NextResponse.json(data, { headers: { "Cache-Control": CACHE } });
    } catch {
      // fall through to the public proxy
    }
  }

  try {
    const data = await viaProxy(username);
    return NextResponse.json(data, { headers: { "Cache-Control": CACHE } });
  } catch {
    return NextResponse.json({ error: "Contributions unavailable" }, { status: 502 });
  }
}
