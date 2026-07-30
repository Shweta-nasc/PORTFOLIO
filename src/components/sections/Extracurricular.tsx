"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { extracurriculars } from "@/data/extracurricular";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function Extracurricular() {
  return (
    <Section id="beyond" spacing="tight">
      <SectionHeading
        eyebrow="Beyond the Code"
        title="Life off the keyboard"
        description="Sport, stage, and problem-solving — the pursuits that keep the engineering sharp."
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {extracurriculars.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] p-6"
          >
            <div
              className="pointer-events-none absolute inset-x-0 -bottom-16 h-32 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ background: item.accent }}
            />
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              style={{ background: `${item.accent}1f`, color: item.accent }}
            >
              <item.icon />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {item.category}
            </p>
            <h3 className="mt-0.5 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {item.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-foreground/70"
                >
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
