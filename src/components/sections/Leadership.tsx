"use client";

import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { leadershipRoles } from "@/data/leadership";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function Leadership() {
  return (
    <Section id="leadership" spacing="tight">
      <SectionHeading
        index="07"
        eyebrow="Leadership"
        title="Leading teams, events, and communities"
        description="Ownership beyond code — from directing a squad to representing events to industry."
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-14 grid gap-5 md:grid-cols-3"
      >
        {leadershipRoles.map((role) => (
          <motion.div
            key={role.id}
            variants={fadeUp}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all hover:border-accent/30"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
              <role.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{role.period}</span>
            <h3 className="mt-1 text-lg font-semibold leading-snug">{role.title}</h3>
            <p className="text-sm font-medium text-accent">{role.organization}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {role.description}
            </p>
            <ul className="mt-4 space-y-2 border-t border-white/8 pt-4">
              {role.impact.map((im) => (
                <li key={im} className="flex gap-2 text-sm text-muted-foreground">
                  <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  {im}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
