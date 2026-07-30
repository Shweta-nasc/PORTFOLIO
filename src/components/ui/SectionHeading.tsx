"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  index?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  index,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground"
      >
        {index && <span className="font-mono text-accent">{index}</span>}
        <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
        {eyebrow}
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={fadeUp}
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
