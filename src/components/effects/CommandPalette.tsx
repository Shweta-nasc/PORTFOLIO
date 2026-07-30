"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, FileText, Github, Mail } from "lucide-react";
import { navItems, personal, links } from "@/data/config";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Command {
  id: string;
  label: string;
  hint: string;
  action: () => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const commands: Command[] = useMemo(() => {
    const nav = navItems.map((n) => ({
      id: `nav-${n.href}`,
      label: `Go to ${n.label}`,
      hint: "Section",
      action: () => {
        document.querySelector(n.href)?.scrollIntoView({ behavior: "smooth" });
        onOpenChange(false);
      },
    }));
    const actions: Command[] = [
      {
        id: "resume",
        label: "Download Resume",
        hint: "Action",
        action: () => {
          window.open(personal.resumePath, "_blank");
          onOpenChange(false);
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: "Link",
        action: () => {
          window.open(links.github, "_blank");
          onOpenChange(false);
        },
      },
      {
        id: "email",
        label: "Send an Email",
        hint: "Link",
        action: () => {
          window.location.href = links.email;
          onOpenChange(false);
        },
      },
    ];
    return [...nav, ...actions];
  }, [onOpenChange]);

  const filtered = useMemo(
    () =>
      query
        ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
        : commands,
    [commands, query],
  );

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIdx]?.action();
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  }

  const iconFor = (id: string) => {
    if (id === "resume") return <FileText className="h-4 w-4" />;
    if (id === "github") return <Github className="h-4 w-4" />;
    if (id === "email") return <Mail className="h-4 w-4" />;
    return <CornerDownLeft className="h-4 w-4" />;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-start justify-center bg-background/70 p-4 pt-[15vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl shadow-card"
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections and actions..."
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </li>
              )}
              {filtered.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={c.action}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      i === activeIdx ? "bg-accent/15 text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-accent">{iconFor(c.id)}</span>
                      {c.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
