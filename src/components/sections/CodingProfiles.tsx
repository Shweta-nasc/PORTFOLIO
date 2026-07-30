"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { platformMeta } from "@/config/profile";
import { staggerContainer } from "@/lib/animations";
import { GitHubCard } from "./coding/GitHubCard";
import { LeetCodeCard } from "./coding/LeetCodeCard";
import { CodeforcesCard } from "./coding/CodeforcesCard";
import { GeeksforGeeksCard } from "./coding/GeeksforGeeksCard";

export function CodingProfiles() {
  return (
    <Section id="coding" className="isolate">
      {/* Subtle dark gradient backdrop — lifts card/text readability above the
          animated 3D world without hiding it entirely. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(var(--background) / 0.72) 30%, hsl(var(--background) / 0.72) 70%, transparent)",
        }}
      />

      <SectionHeading
        index="06"
        eyebrow="Competitive Programming"
        title="Live coding footprint"
        description="Real-time stats pulled straight from each platform's API — nothing typed by hand."
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6"
      >
        <GitHubCard meta={platformMeta("github")} />
        <LeetCodeCard meta={platformMeta("leetcode")} />
        <CodeforcesCard meta={platformMeta("codeforces")} />
        <GeeksforGeeksCard meta={platformMeta("geeksforgeeks")} />
      </motion.div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Stats fetch live on load and are cached briefly — tap any card to open the profile.
      </p>
    </Section>
  );
}
