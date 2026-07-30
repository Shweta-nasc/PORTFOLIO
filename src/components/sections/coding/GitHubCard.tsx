"use client";

import { FaGithub } from "react-icons/fa6";
import { Star } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { fetchGitHubStats, fetchGitHubContributions } from "@/services/coding/github";
import type { PlatformMeta } from "@/config/profile";
import { PlatformCard } from "./PlatformCard";
import { StatTile, CountUp, Skeleton, Avatar } from "./primitives";
import { CardLoading, CardNotice } from "./CardStates";
import { LanguageBar } from "./LanguageBar";
import { ContributionHeatmap } from "./ContributionHeatmap";

export function GitHubCard({ meta }: { meta: PlatformMeta }) {
  const stats = useAsync((s) => fetchGitHubStats(meta.username, s), [meta.username]);
  const contrib = useAsync((s) => fetchGitHubContributions(meta.username, s), [meta.username]);

  return (
    <PlatformCard meta={meta} icon={FaGithub} className="md:col-span-2 lg:col-span-6">
      {stats.status === "loading" && <CardLoading />}
      {stats.status === "error" && (
        <CardNotice title="Couldn't load GitHub stats" hint={stats.error} />
      )}
      {stats.status === "success" && stats.data && (
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-6">
          {/* Left column: identity, stats, languages */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <Avatar src={stats.data.avatarUrl} alt={stats.data.name} size={56} accent={meta.accent} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{stats.data.name}</p>
                {stats.data.bio && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{stats.data.bio}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatTile label="Followers" value={stats.data.followers} accent={meta.accent} />
              <StatTile label="Following" value={stats.data.following} accent={meta.accent} />
              <StatTile label="Repos" value={stats.data.publicRepos} accent={meta.accent} />
              <StatTile label="Total stars" value={stats.data.totalStars} accent={meta.accent} />
            </div>

            {stats.data.languages.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Most-used languages</p>
                <LanguageBar languages={stats.data.languages} accent={meta.accent} />
              </div>
            )}
          </div>

          {/* Right column: recent repos */}
          {stats.data.recentRepos.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Recent repositories</p>
              <ul className="grid gap-2">
                {stats.data.recentRepos.map((r) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{r.name}</span>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />
                          {r.stars}
                        </span>
                      </span>
                      {r.description && (
                        <span className="line-clamp-1 text-xs text-muted-foreground">{r.description}</span>
                      )}
                      {r.language && (
                        <span className="text-[11px]" style={{ color: meta.accent }}>{r.language}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contribution heatmap spans both columns */}
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Contributions</p>
              {contrib.status === "success" && contrib.data && (
                <p className="text-xs text-muted-foreground">
                  <CountUp value={contrib.data.total} className="font-semibold text-foreground/80" />{" "}
                  in the last year
                </p>
              )}
            </div>
            {contrib.status === "loading" && <Skeleton className="h-[104px] w-full" />}
            {contrib.status === "error" && (
              <p className="text-xs text-muted-foreground">Contribution heatmap unavailable right now.</p>
            )}
            {contrib.status === "success" && contrib.data && (
              <ContributionHeatmap days={contrib.data.days} accent={meta.accent} />
            )}
          </div>
        </div>
      )}
    </PlatformCard>
  );
}
