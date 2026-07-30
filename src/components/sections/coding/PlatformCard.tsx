"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { IconComponent } from "@/types";
import type { PlatformMeta } from "@/config/profile";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for every coding-platform card: brand-accent glow, a header
 * with the platform icon / username / profile link, Framer Motion entrance +
 * hover, and a body slot the individual cards fill (with their own loading /
 * error / content states).
 */
export function PlatformCard({
  meta,
  icon: Icon,
  className,
  children,
}: {
  meta: PlatformMeta;
  icon: IconComponent;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/60 p-6 backdrop-blur-xl transition-colors hover:border-white/20",
        className,
      )}
    >
      {/* Brand-accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: meta.accent }}
      />

      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
            style={{ background: `${meta.accent}1f`, color: meta.accent }}
          >
            <Icon />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight">{meta.label}</h3>
            <a
              href={meta.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              @{meta.username}
            </a>
          </div>
        </div>
        <a
          href={meta.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${meta.label} profile`}
          className="rounded-full p-1.5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          <ArrowUpRight className="h-5 w-5" />
        </a>
      </header>

      <div className="mt-5 flex-1">{children}</div>
    </motion.article>
  );
}
