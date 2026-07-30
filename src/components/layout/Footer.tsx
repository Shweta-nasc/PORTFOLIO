"use client";

import { Download, ArrowUpRight, Heart } from "lucide-react";
import { navItems, personal, socials, links } from "@/data/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 section-padding pt-16 pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-max">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ember-from to-ember-to text-sm font-bold text-white shadow-glow">
                {personal.initials}
              </span>
              <span className="font-display text-lg font-bold">
                {personal.name}
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {personal.tagline}
            </p>
            <a
              href={personal.resumePath}
              download
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigate
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Connect
            </h3>
            <ul className="flex flex-col gap-2.5">
              {socials.slice(0, 5).map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <s.icon className="h-4 w-4" />
                    {s.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p className="flex items-center gap-1.5">
            © {year} {personal.name}. Built with
            <Heart className="h-3.5 w-3.5 fill-accent text-accent" />
            and Next.js.
          </p>
          <div className="flex items-center gap-5">
            <a href={links.email} className="transition-colors hover:text-foreground">
              {personal.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
