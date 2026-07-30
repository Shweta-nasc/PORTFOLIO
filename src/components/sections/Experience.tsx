"use client";

import { motion } from "framer-motion";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { experiences } from "@/data/experience";
import { fadeUp } from "@/lib/animations";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        index="04"
        eyebrow="Experience"
        title="Where I've contributed and led"
        description="Open source, team leadership, and full-stack delivery — the throughline is shipping things that work."
      />

      <div className="relative mt-16">
        {/* Spine */}
        <div className="absolute left-4 top-2 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent sm:left-1/2" />

        <div className="flex flex-col gap-10">
          {experiences.map((exp, i) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={exp.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                  left ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                }`}
              >
                {/* Node */}
                <span
                  className={`absolute top-2 flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 bg-background shadow-glow left-0 ${
                    left ? "sm:-right-4 sm:left-auto" : "sm:-left-4"
                  }`}
                >
                  <Briefcase className="h-4 w-4 text-accent" />
                </span>

                <div className="card-surface p-5 text-left hover:border-accent/30">
                  <div className={`flex flex-wrap items-center gap-2 ${left ? "sm:justify-end" : ""}`}>
                    <Badge variant="accent">{exp.type}</Badge>
                    <span className="text-xs text-muted-foreground">{exp.period}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{exp.role}</h3>
                  <p className="text-sm font-medium text-accent">{exp.organization}</p>
                  <p className="text-xs text-muted-foreground">{exp.location}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {exp.summary}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {exp.highlights.map((h) => (
                      <li
                        key={h}
                        className={`flex gap-2 text-sm text-muted-foreground ${
                          left ? "sm:flex-row-reverse sm:text-right" : ""
                        }`}
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className={`mt-4 flex flex-wrap gap-1.5 ${left ? "sm:justify-end" : ""}`}>
                    {exp.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-foreground/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
