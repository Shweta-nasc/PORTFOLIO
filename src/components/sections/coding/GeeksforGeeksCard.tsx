"use client";

import { SiGeeksforgeeks } from "react-icons/si";
import { useAsync } from "@/hooks/useAsync";
import { fetchGfgStats } from "@/services/coding/geeksforgeeks";
import type { PlatformMeta } from "@/config/profile";
import { PlatformCard } from "./PlatformCard";
import { StatTile } from "./primitives";
import { CardLoading, CardNotice } from "./CardStates";

const GFG_UNAVAILABLE = "Live statistics unavailable";
const GFG_HINT = "GeeksforGeeks has no official public API — showing nothing rather than fabricated numbers.";

export function GeeksforGeeksCard({ meta }: { meta: PlatformMeta }) {
  const s = useAsync((sig) => fetchGfgStats(meta.username, sig), [meta.username]);

  return (
    <PlatformCard meta={meta} icon={SiGeeksforgeeks} className="lg:col-span-2">
      {s.status === "loading" && <CardLoading />}

      {/* Upstream unreachable / 503 → honest message, never fake data. */}
      {s.status === "error" && <CardNotice title={GFG_UNAVAILABLE} hint={GFG_HINT} />}

      {s.status === "success" && s.data && (
        s.data.totalSolved == null ? (
          <CardNotice title={GFG_UNAVAILABLE} hint={GFG_HINT} />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <StatTile label="Problems solved" value={s.data.totalSolved} accent={meta.accent} />
            {s.data.codingScore != null && (
              <StatTile label="Coding score" value={s.data.codingScore} accent={meta.accent} />
            )}
            {s.data.currentStreak != null && (
              <StatTile label="Streak" value={s.data.currentStreak} accent={meta.accent} suffix="d" />
            )}
            {s.data.instituteRank != null && (
              <StatTile label="Institute rank" value={s.data.instituteRank} accent={meta.accent} prefix="#" />
            )}
          </div>
        )
      )}
    </PlatformCard>
  );
}
