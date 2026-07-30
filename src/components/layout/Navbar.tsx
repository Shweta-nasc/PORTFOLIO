"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Download, Command } from "lucide-react";
import { navItems, personal } from "@/data/config";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = navItems.map((n) => n.href.replace("#", ""));

interface NavbarProps {
  onOpenCommand: () => void;
}

export function Navbar({ onOpenCommand }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled ? "glass-strong shadow-card" : "border border-transparent",
          )}
        >
          {/* Logo */}
          <a
            href="#home"
            className="group flex items-center gap-2.5"
            aria-label={`${personal.name} — home`}
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ember-from to-ember-to text-sm font-bold text-white shadow-glow">
              {personal.initials}
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              {personal.firstName}
              <span className="text-accent">.</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = active === id;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenCommand}
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground md:flex"
            >
              <Command className="h-3.5 w-3.5" />
              <span className="font-mono">K</span>
            </button>

            <ThemeToggle />

            <a
              href={personal.resumePath}
              download
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-ember-from to-ember-to px-4 py-2 text-sm font-medium text-white shadow-glow transition-all hover:brightness-110 sm:flex"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="font-display text-lg font-bold">
                {personal.firstName}
                <span className="text-accent">.</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.ul
              className="flex flex-1 flex-col justify-center gap-1 px-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-white/5 py-4 text-2xl font-semibold tracking-tight text-foreground/90 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <div className="px-6 pb-10">
              <a
                href={personal.resumePath}
                download
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember-from to-ember-to px-4 py-3.5 font-medium text-white shadow-glow"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
