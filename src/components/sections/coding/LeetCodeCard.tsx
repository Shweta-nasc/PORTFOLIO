"use client";

import { motion } from "framer-motion";
import { SiLeetcode } from "react-icons/si";
import { useAsync } from "@/hooks/useAsync";
import { fetchLeetCodeStats } from "@/services/coding/leetcode";
import type { PlatformMeta } from "@/config/profile";
import { PlatformCard } from "./PlatformCard";
import { CircularProgress } from "./CircularProgress";
import { StatTile, CountUp } from "./primitives";
import { CardLoading, CardNotice } from "./CardStates";

/** Easy/Medium/Hard breakdown row with an animated fill. */
function DifficultyRow({
  label,
  solved,
  total,
  color,
}: {
  label: string;
  solved: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span style={{ color }}>{label}</span>
        <span className="text-muted-foreground">
          <CountUp value={solved} /> / {total}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="block h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/** Placeholder tile when an optional metric isn't available (e.g. no contests). */
function MutedTile({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
      <p className="font-display text-xl font-bold leading-none text-muted-foreground/50">—</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function LeetCodeCard({ meta }: { meta: PlatformMeta }) {
  const s = useAsync((sig) => fetchLeetCodeStats(meta.username, sig), [meta.username]);

  return (
    <PlatformCard meta={meta} icon={SiLeetcode} className="lg:col-span-2">
      {s.status === "loading" && <CardLoading />}
      {s.status === "error" && <CardNotice title="Couldn't load LeetCode stats" hint={s.error} />}
      {s.status === "success" && s.data && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <CircularProgress
              value={s.data.totalSolved}
              total={s.data.totalQuestions}
              accent={meta.accent}
            />
            <div className="flex flex-1 flex-col gap-2.5">
              <DifficultyRow label="Easy" solved={s.data.easySolved} total={s.data.easyTotal} color="#00b8a3" />
              <DifficultyRow label="Medium" solved={s.data.mediumSolved} total={s.data.mediumTotal} color="#ffb800" />
              <DifficultyRow label="Hard" solved={s.data.hardSolved} total={s.data.hardTotal} color="#ff375f" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <StatTile label="Acceptance" value={s.data.acceptanceRate} accent={meta.accent} decimals={1} suffix="%" />
            {s.data.contestRating != null ? (
              <StatTile label="Contest rating" value={s.data.contestRating} accent={meta.accent} />
            ) : (
              <MutedTile label="Contest rating" />
            )}
            {s.data.contestGlobalRanking != null ? (
              <StatTile label="Contest rank" value={s.data.contestGlobalRanking} accent={meta.accent} prefix="#" />
            ) : (
              <MutedTile label="Contest rank" />
            )}
            {s.data.ranking != null ? (
              <StatTile label="Global rank" value={s.data.ranking} accent={meta.accent} prefix="#" />
            ) : (
              <MutedTile label="Global rank" />
            )}
          </div>
        </div>
      )}
    </PlatformCard>
  );
}
