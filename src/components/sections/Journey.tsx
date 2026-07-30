"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { moments } from "@/data/moments";

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <Section id="journey">
      <SectionHeading
        align="left"
        eyebrow="The Journey"
        title="From first lines of code to shipping AI"
        description="A short timeline of the moments that shaped how I build."
      />

      <div ref={containerRef} className="relative mt-14 pl-8 sm:pl-10">
        {/* Rail */}
        <div className="absolute left-[7px] top-0 h-full w-px bg-white/10 sm:left-[11px]" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-[7px] top-0 h-full w-px origin-top bg-gradient-to-b from-aurora-indigo via-accent to-aurora-cyan sm:left-[11px]"
        />

        <div className="flex flex-col gap-9">
          {moments.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Node */}
              <span className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center sm:-left-10">
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-accent/40" />
                <span className="h-3 w-3 rounded-full border-2 border-background bg-accent" />
              </span>

              <div className="group flex flex-col gap-1 rounded-2xl border border-transparent p-1 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-accent">{m.year}</span>
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    {m.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
