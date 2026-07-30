"use client";

import { SiCodeforces } from "react-icons/si";
import { useAsync } from "@/hooks/useAsync";
import { fetchCodeforcesStats } from "@/services/coding/codeforces";
import type { PlatformMeta } from "@/config/profile";
import { PlatformCard } from "./PlatformCard";
import { RatingSparkline } from "./RatingSparkline";
import { StatTile, CountUp } from "./primitives";
import { CardLoading, CardNotice } from "./CardStates";

/** Textual rank tile (Codeforces ranks are titles like "Specialist"). */
function RankTile({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <p className="truncate font-display text-base font-bold capitalize leading-tight text-foreground/90">
        {value ?? "Unrated"}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function CodeforcesCard({ meta }: { meta: PlatformMeta }) {
  const s = useAsync((sig) => fetchCodeforcesStats(meta.username, sig), [meta.username]);

  return (
    <PlatformCard meta={meta} icon={SiCodeforces} className="lg:col-span-2">
      {s.status === "loading" && <CardLoading />}
      {s.status === "error" && <CardNotice title="Couldn't load Codeforces stats" hint={s.error} />}
      {s.status === "success" && s.data && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <StatTile label="Rating" value={s.data.rating ?? 0} accent={meta.accent} />
            <StatTile label="Max rating" value={s.data.maxRating ?? 0} accent={meta.accent} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RankTile label="Rank" value={s.data.rank} />
            <RankTile label="Max rank" value={s.data.maxRank} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Rating history</span>
              <span>
                <CountUp value={s.data.contestCount} className="font-semibold text-foreground/80" /> contests
              </span>
            </div>
            <RatingSparkline points={s.data.history} accent={meta.accent} />
          </div>
        </div>
      )}
    </PlatformCard>
  );
}
