"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";

export function Skills() {
  const [active, setActive] = useState(skillCategories[0].id);
  const category = skillCategories.find((c) => c.id === active) ?? skillCategories[0];

  return (
    <Section id="skills">
      <SectionHeading
        index="02"
        eyebrow="Tech Stack"
        title="Tools I reach for, and how deep I go"
        description="A working toolkit across AI, full-stack, and cloud — grounded in daily use, not just tutorials."
      />

      {/* Marquee of everything */}
      <div className="mt-12">
        <Marquee speed={38} className="py-2">
          {skillCategories.flatMap((c) =>
            c.skills.map((s) => (
              <span
                key={`${c.id}-${s.name}`}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-muted-foreground"
              >
                {s.icon && <s.icon className="h-4 w-4" style={{ color: s.color }} />}
                {s.name}
              </span>
            )),
          )}
        </Marquee>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Category selector */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0">
          {skillCategories.map((c) => {
            const isActive = c.id === active;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c.id)}
                className={cn(
                  "group relative flex min-w-[220px] items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 lg:min-w-0",
                  isActive
                    ? "border-accent/40 bg-white/[0.05]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/15",
                )}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${c.accent}1a`,
                    color: c.accent,
                    boxShadow: isActive ? `0 0 24px -6px ${c.accent}` : undefined,
                  }}
                >
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{c.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.skills.length} skills
                  </span>
                </span>
                {isActive && (
                  <motion.span
                    layoutId="skill-active"
                    className="absolute inset-y-3 left-0 w-0.5 rounded-full"
                    style={{ background: c.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Skills panel */}
        <div className="card-surface p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold" style={{ color: category.accent }}>
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {category.skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {skill.icon && (
                          <skill.icon className="h-4 w-4" style={{ color: skill.color }} />
                        )}
                        {skill.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${category.accent}, ${category.accent}88)`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
