import { NextResponse, type NextRequest } from "next/server";
import type { GfgStats } from "@/services/coding/types";

/**
 * GeeksforGeeks has NO official public API. We make a best-effort attempt at a
 * community stats endpoint server-side (avoids CORS + keeps the client simple).
 * If it is unreachable or the payload can't be validated, we return 503 so the
 * card shows "Live statistics unavailable" rather than any fabricated numbers.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

function toNum(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v.replace(/[^\d.]/g, "")) : Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://geeks-for-geeks-stats-api.vercel.app/?userName=${encodeURIComponent(username)}`,
      { signal: AbortSignal.timeout(8000), cache: "no-store", headers: { Accept: "application/json" } },
    );
    if (!res.ok) throw new Error(`GfG upstream ${res.status}`);

    const raw = (await res.json()) as Record<string, unknown>;

    // The community API is loosely typed; validate defensively.
    const totalSolved = toNum(raw.totalProblemsSolved ?? raw.totalSolved);
    if (totalSolved == null) throw new Error("Unrecognised GfG payload");

    const stats: GfgStats = {
      totalSolved,
      codingScore: toNum(raw.codingScore ?? raw.score),
      instituteRank: toNum(raw.instituteRank),
      currentStreak: toNum(raw.currentStreak ?? raw.streak),
    };
    return NextResponse.json(stats, { headers: { "Cache-Control": CACHE } });
  } catch {
    return NextResponse.json({ error: "Live statistics unavailable" }, { status: 503 });
  }
}
