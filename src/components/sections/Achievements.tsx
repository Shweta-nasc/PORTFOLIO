"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { achievements } from "@/data/achievements";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(achievements.map((a) => a.category)))];

export function Achievements() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () => (filter === "All" ? achievements : achievements.filter((a) => a.category === filter)),
    [filter],
  );

  return (
    <Section id="achievements">
      <SectionHeading
        index="05"
        eyebrow="Achievements"
        title="Recognition earned along the way"
        description="Hackathon podiums, national finals, and a habit of showing up on the court as well as the keyboard."
      />

      {/* Filters */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              filter === c
                ? "border-accent/50 bg-accent/15 text-accent"
                : "border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((a, i) => (
            <motion.article
              key={a.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="group card-surface relative flex flex-col overflow-hidden hover:border-accent/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                  src={a.image ?? ""}
                  alt={a.title}
                  label="Add achievement photo"
                  rounded="rounded-none"
                  className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-semibold text-accent backdrop-blur-md">
                  <Trophy className="h-3 w-3" />
                  {a.highlight}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-accent">{a.category}</span>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="text-base font-semibold leading-snug">{a.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.organization}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
                  >
                    View <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
