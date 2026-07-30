"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Github,
  ExternalLink,
  ArrowUpRight,
  X,
  Target,
  Lightbulb,
  Mountain,
  Trophy,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <Section id="projects">
      <SectionHeading
        index="03"
        eyebrow="Featured Projects"
        title="Systems built to solve a real problem"
        description="Each of these started as a hard constraint — a city, a spacecraft, a citizen. Open the case study for the full story."
      />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project, i) => (
          <motion.div key={project.id} variants={fadeUp} className={cn(i === 0 && "lg:col-span-2")}>
            <ProjectCard project={project} wide={i === 0} onOpen={() => setSelected(project)} />
          </motion.div>
        ))}
      </motion.div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

function ProjectCard({
  project,
  wide,
  onOpen,
}: {
  project: Project;
  wide?: boolean;
  onOpen: () => void;
}) {
  return (
    <TiltCard className="group h-full" intensity={7}>
      <article className="card-surface flex h-full flex-col overflow-hidden hover:border-accent/30 hover:shadow-glow">
        <div className={cn("relative overflow-hidden", wide ? "aspect-[2/1]" : "aspect-[16/10]")}>
          <SmartImage
            src={project.cover}
            alt={`${project.title} cover`}
            label={`Add ${project.id}-cover`}
            rounded="rounded-none"
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge variant="accent">{project.category}</Badge>
          </div>
          <div className="absolute right-4 top-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md",
                project.status === "Live"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-amber-500/15 text-amber-300",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {project.status}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.tagline}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{project.period}</span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, wide ? 6 : 4).map((s) => (
              <span
                key={s}
                className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-foreground/70"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-white/8 pt-4">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/15 hover:text-accent"
            >
              Case Study <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  const blocks = project
    ? [
        { icon: Target, label: "Problem", text: project.problem },
        { icon: Lightbulb, label: "Approach", text: project.approach },
        { icon: Mountain, label: "Challenges", text: project.challenges },
        { icon: Trophy, label: "Outcome", text: project.outcome },
      ]
    : [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-background/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative my-auto w-full max-w-3xl overflow-hidden rounded-t-3xl sm:rounded-3xl"
          >
            <div className="relative aspect-[2/1] w-full">
              <SmartImage
                src={project.cover}
                alt={`${project.title} cover`}
                label={`Add ${project.id}-cover`}
                rounded="rounded-none"
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:text-accent"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{project.category}</Badge>
                  <span className="text-xs text-muted-foreground">{project.period}</span>
                </div>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.tagline}</p>
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-6 sm:p-8">
              {/* Metrics */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center"
                  >
                    <p className="font-display text-xl font-bold text-accent">{m.value}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Case study blocks */}
              <div className="grid gap-5 sm:grid-cols-2">
                {blocks.map((b) => (
                  <div key={b.label}>
                    <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                      <b.icon className="h-4 w-4 text-accent" />
                      {b.label}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold">Key features</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack */}
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>

              {/* Links */}
              <div className="mt-7 flex flex-wrap gap-3">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ember-from to-ember-to px-4 py-2.5 text-sm font-medium text-white shadow-glow"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
