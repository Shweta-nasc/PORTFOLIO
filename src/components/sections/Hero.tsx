"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Send, Sparkles, MapPin } from "lucide-react";
import { personal, socials } from "@/data/config";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LinkButton } from "@/components/ui/Button";
import { HeroPortrait } from "./HeroPortrait";

export function Hero() {
  const typed = useTypewriter(personal.roles as unknown as string[]);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden section-padding pt-28 pb-16"
    >
      {/* Readability wash — darkens the copy side, reveals the landscape on the right */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background/85" />
      </div>

      <div className="container-max grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {personal.availability}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-muted-foreground"
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-1 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]"
          >
            <span className="text-gradient-soft">{personal.firstName}</span>{" "}
            <span className="aurora-text">{personal.lastName}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-4 flex h-9 items-center gap-2 text-xl font-medium sm:text-2xl"
          >
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-foreground/90">{typed}</span>
            <span className="inline-block h-6 w-0.5 animate-blink bg-accent" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {personal.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <MapPin className="h-4 w-4 text-accent" />
            {personal.location}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <LinkButton href="#projects" size="lg" iconRight={<ArrowDown className="h-4 w-4" />}>
              View Projects
            </LinkButton>
            <LinkButton
              href={personal.resumePath}
              download
              variant="outline"
              size="lg"
              icon={<Download className="h-4 w-4" />}
            >
              Download Resume
            </LinkButton>
            <LinkButton
              href="#contact"
              variant="ghost"
              size="lg"
              icon={<Send className="h-4 w-4" />}
            >
              Hire Me
            </LinkButton>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-10 flex items-center gap-3"
          >
            {socials.slice(0, 6).map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground transition-all hover:-translate-y-1 hover:border-accent/50 hover:text-accent hover:shadow-glow"
              >
                <s.icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right — portrait cutout blended into the landscape */}
        <HeroPortrait />
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-accent"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </span>
      </motion.a>
    </section>
  );
}
