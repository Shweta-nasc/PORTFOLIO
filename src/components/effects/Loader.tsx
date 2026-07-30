"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personal } from "@/data/config";

/**
 * Full-screen intro loader. Counts to 100 then reveals the site.
 * Runs once per page load and locks scroll while visible.
 */
export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 16 + 6;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 130);
    return () => {
      clearInterval(interval);
      // Always release the scroll lock, even if we unmount before completing
      // (e.g. inside the embedded ?embed=1 preview, where the Loader is skipped).
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setDone(true);
        document.body.style.overflow = "";
      }, 550);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-radial-fade opacity-60" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-8"
          >
            <div className="relative flex h-24 w-24 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-2xl border border-accent/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-2 rounded-xl border border-aurora-cyan/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <span className="font-display text-2xl font-bold aurora-text">
                {personal.initials}
              </span>
            </div>

            <div className="w-56">
              <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                <span>Loading</span>
                <span className="font-mono text-accent">
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </div>
              <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-aurora-indigo via-accent to-aurora-cyan"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
