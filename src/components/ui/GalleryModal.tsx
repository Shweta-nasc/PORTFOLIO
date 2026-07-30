"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { categoryEmoji } from "@/data/gallery";
import type { GalleryItem } from "@/types";

interface GalleryModalProps {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryModal({ items, index, onClose, onNavigate }: GalleryModalProps) {
  const open = index !== null;

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goNext, goPrev]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-background/85 p-4 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* warm ambience */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,150,80,0.12),transparent_60%)]" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="glass absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:text-accent"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous"
            className="glass absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground hover:text-accent sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next"
            className="glass absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground hover:text-accent sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative grid w-full max-w-4xl overflow-hidden rounded-3xl md:grid-cols-[1.4fr_1fr]"
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
              <SmartImage
                src={item.image}
                alt={item.title}
                label={item.category}
                rounded="rounded-none"
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent md:bg-gradient-to-r" />
            </div>

            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                <span aria-hidden>{categoryEmoji[item.category]}</span>
                {item.category}
              </span>

              <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              )}

              <div className="mt-1 flex flex-col gap-2 text-sm text-muted-foreground">
                {item.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" /> {item.location}
                  </span>
                )}
                {item.date && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" /> {item.date}
                  </span>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-foreground/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-auto pt-4 text-xs text-muted-foreground/70">
                {(index ?? 0) + 1} / {items.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
