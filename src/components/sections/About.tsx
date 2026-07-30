"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Award, Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { StatsBand } from "./StatsBand";
import { bio, mission, coreValues, funFacts, interests } from "@/data/about";
import { education, personal } from "@/data/config";
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        index="01"
        eyebrow="About"
        title="Curious by default, engineer by discipline"
        description="I turn open-ended problems into systems that ship — with a bias for AI, clean architecture, and measurable outcomes."
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* Left — portrait + education */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-6"
        >
          <div className="group relative">
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-aurora-indigo/40 via-accent/20 to-aurora-cyan/40 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-90" />
            <SmartImage
              src="/images/profile/portrait.jpg"
              alt={`${personal.name} portrait`}
              label="Add profile/portrait.jpg"
              rounded="rounded-[1.75rem]"
              className="relative aspect-[4/5] w-full"
            />
            <div className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold">{personal.name}</p>
                <p className="text-xs text-muted-foreground">{personal.title}</p>
              </div>
              <Badge variant="accent">AI Major</Badge>
            </div>
          </div>

          {/* Education card */}
          <div className="card-surface p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-5 w-5 text-accent" />
              Education
            </div>
            <p className="font-medium leading-snug">{education.institute}</p>
            <p className="text-sm text-muted-foreground">{education.university}</p>
            <p className="mt-2 text-sm text-foreground/80">{education.degree}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Award className="h-4 w-4 text-accent" /> SGPA {education.sgpa}
              </span>
              <span className="text-muted-foreground">{education.duration}</span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" /> {education.location}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/8 pt-4">
              {education.school.map((s) => (
                <span
                  key={s.level}
                  className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {s.level} · <span className="text-foreground">{s.score}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — bio + mission + values */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-8"
        >
          <div className="space-y-4">
            {bio.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Mission */}
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/[0.06] p-6">
            <Quote className="absolute -right-2 -top-2 h-16 w-16 text-accent/10" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Mission
            </p>
            <p className="mt-2 text-lg font-medium leading-relaxed text-foreground/90">
              {mission}
            </p>
          </div>

          {/* Core values */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {coreValues.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-accent/30 hover:bg-white/[0.04]"
              >
                <v.icon className="mb-2 h-5 w-5 text-accent" />
                <p className="font-medium">{v.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Interests + fun facts */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold">Interests</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <Badge key={i}>{i}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">Fun facts</p>
              <ul className="space-y-2">
                {funFacts.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <Reveal className="mt-16">
        <StatsBand />
      </Reveal>
    </Section>
  );
}
