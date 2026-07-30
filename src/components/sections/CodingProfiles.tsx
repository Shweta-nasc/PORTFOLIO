"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Flame } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { codingProfiles } from "@/data/coding-profiles";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function CodingProfiles() {
  return (
    <Section id="coding">
      <SectionHeading
        index="06"
        eyebrow="Competitive Programming"
        title="Sharpening problem-solving, daily"
        description="Consistent practice across the major judges — data structures, algorithms, and contest pressure."
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {codingProfiles.map((p) => (
          <motion.a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/20"
          >
            {/* Accent glow */}
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ background: p.accent }}
            />

            <div className="flex items-center justify-between">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                style={{ background: `${p.accent}1f`, color: p.accent }}
              >
                <p.icon />
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">{p.platform}</h3>
            <p className="text-sm text-muted-foreground">{p.handle}</p>

            <div className="mt-5 grid gap-3 border-t border-white/8 pt-4">
              {p.stats.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span
                    className="font-display text-sm font-bold"
                    style={{ color: p.accent }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {p.badges && p.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2 py-1 text-[10px] text-foreground/70"
                  >
                    <Flame className="h-2.5 w-2.5" style={{ color: p.accent }} />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </motion.a>
        ))}
      </motion.div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Stats reflect recent activity — tap a card to view the live profile.
      </p>
    </Section>
  );
}
