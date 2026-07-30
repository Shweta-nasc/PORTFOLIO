"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/stats";
import { useCounter } from "@/hooks/useCounter";
import { staggerContainer, fadeUp } from "@/lib/animations";

function StatCard({
  value,
  suffix,
  prefix,
  label,
  Icon,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  Icon: (typeof stats)[number]["icon"];
}) {
  const [ref, animated] = useCounter(value);
  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-center transition-colors hover:border-accent/30"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/0 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:from-accent/5 group-hover:opacity-100" />
      <Icon className="mx-auto mb-2 h-5 w-5 text-accent" />
      <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {prefix}
        <span ref={ref}>{animated}</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
    </motion.div>
  );
}

export function StatsBand() {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      {stats.map((s) => (
        <StatCard
          key={s.id}
          value={s.value}
          suffix={s.suffix}
          prefix={s.prefix}
          label={s.label}
          Icon={s.icon}
        />
      ))}
    </motion.div>
  );
}
