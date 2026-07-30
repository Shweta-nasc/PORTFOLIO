"use client";

import { AlertTriangle } from "lucide-react";
import { Skeleton } from "./primitives";

/** Generic loading placeholder used by every platform card. */
export function CardLoading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

/** Error / "unavailable" notice — never shows fabricated data. */
export function CardNotice({ title, hint }: { title: string; hint?: string }) {
  return (
    <div
      className="flex h-full min-h-[150px] flex-col items-center justify-center gap-2 text-center"
      role="status"
    >
      <AlertTriangle className="h-5 w-5 text-muted-foreground/70" />
      <p className="text-sm font-medium text-foreground/80">{title}</p>
      {hint ? <p className="max-w-[16rem] text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
