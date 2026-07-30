"use client";

import { useMemo } from "react";
import type { ContributionDay } from "@/services/coding/types";

/**
 * GitHub-style contribution calendar. Days are grouped into week columns
 * (Sun→Sat rows); each cell is tinted by its 0–4 intensity level using the
 * platform accent. Horizontally scrollable on small screens.
 */

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;

function levelAlpha(level: number): number {
  return [0, 0.28, 0.5, 0.75, 1][Math.max(0, Math.min(4, level))];
}

export function ContributionHeatmap({
  days,
  accent,
}: {
  days: ContributionDay[];
  accent: string;
}) {
  const columns = useMemo(() => {
    const cols: (ContributionDay | null)[][] = [];
    let col: (ContributionDay | null)[] = new Array(7).fill(null);
    let started = false;
    for (const d of days) {
      const weekday = new Date(`${d.date}T00:00:00Z`).getUTCDay();
      if (weekday === 0 && started) {
        cols.push(col);
        col = new Array(7).fill(null);
      }
      col[weekday] = d;
      started = true;
    }
    cols.push(col);
    return cols;
  }, [days]);

  const width = columns.length * STEP;
  const height = 7 * STEP;

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-1 [scrollbar-width:thin]">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="GitHub contribution calendar for the last year"
          className="max-w-none"
        >
          {columns.map((col, ci) =>
            col.map((day, ri) =>
              day ? (
                <rect
                  key={`${ci}-${ri}`}
                  x={ci * STEP}
                  y={ri * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={day.level === 0 ? "rgba(255,255,255,0.06)" : accent}
                  fillOpacity={day.level === 0 ? 1 : levelAlpha(day.level)}
                >
                  <title>{`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}</title>
                </rect>
              ) : null,
            ),
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span
            key={l}
            className="h-2.5 w-2.5 rounded-[3px]"
            style={{
              backgroundColor: l === 0 ? "rgba(255,255,255,0.06)" : accent,
              opacity: l === 0 ? 1 : levelAlpha(l),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
