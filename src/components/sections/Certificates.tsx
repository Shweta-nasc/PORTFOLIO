"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { certifications } from "@/data/certifications";
import type { Certification } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Certificates — a lightweight horizontal carousel (native CSS scroll-snap,
 * no WebGL / no carousel dependency, so nothing heavy blocks page load).
 *
 * Navigation: mouse drag-to-scroll, prev/next arrows, dot indicators, native
 * touch swipe, and Left/Right arrow keys when the track is focused. Clicking a
 * card opens a modal with the full certificate, issuer, date and a Verify link
 * (only when a real URL exists). Card images lazy-load (SmartImage default).
 */
export function Certificates() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Certification | null>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Keep arrow-enabled state + active dot in sync with the scroll position.
  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 4);

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-cert-card]"));
    const center = scrollLeft + clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  const step = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cert-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-cert-card]")[i];
    if (card) el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  // Mouse drag-to-scroll (touch uses native scrolling). `moved` lets us tell a
  // drag apart from a click so dragging never triggers the modal.
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    drag.current.down = false;
    trackRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const openCard = (cert: Certification) => {
    // Suppress the click that ends a drag.
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    setSelected(cert);
  };

  return (
    <Section id="certificates">
      <SectionHeading
        index="08"
        eyebrow="Certificates"
        title="Credentials, verified and earned"
        description="Coursework and specializations backing the skills I build with — drag, swipe, or use the arrows, and open any card for the full certificate."
      />

      <div className="relative mt-14">
        {/* Carousel row */}
        <div className="relative">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label="Previous certificates"
            className="glass-strong absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-foreground shadow-card transition-all hover:text-accent disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label="Next certificates"
            className="glass-strong absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-foreground shadow-card transition-all hover:text-accent disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            role="region"
            aria-label="Certificates carousel"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="flex select-none snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-3 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {certifications.map((cert) => (
              <article
                key={cert.id}
                data-cert-card
                className="shrink-0 snap-start basis-[82%] sm:basis-[46%] lg:basis-[31%]"
              >
                <button
                  type="button"
                  onClick={() => openCard(cert)}
                  aria-label={`Open ${cert.title}`}
                  className="card-surface group flex h-full w-full flex-col overflow-hidden text-left transition-all hover:border-accent/30 hover:shadow-glow"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SmartImage
                      src={cert.image ?? ""}
                      alt={cert.title}
                      label="Add certificate image"
                      rounded="rounded-none"
                      className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                    <div className="absolute left-4 top-4">
                      <Badge variant="accent">{cert.category}</Badge>
                    </div>
                    <span className="glass absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-snug tracking-tight">
                        {cert.title}
                      </h3>
                      <span className="shrink-0 text-xs text-muted-foreground">{cert.date}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{cert.issuer}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {cert.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-foreground/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-medium text-accent">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      View certificate
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {certifications.map((cert, i) => (
            <button
              key={cert.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to certificate ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-accent" : "w-1.5 bg-white/20 hover:bg-white/40",
              )}
            />
          ))}
        </div>
      </div>

      <CertificateModal cert={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certification | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!cert) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cert, onClose]);

  const hasVerify = Boolean(cert?.credentialLink && cert.credentialLink !== "#");

  return (
    <AnimatePresence>
      {cert && (
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
            role="dialog"
            aria-modal="true"
            aria-label={cert.title}
            className="glass-strong relative my-auto w-full max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl"
          >
            <div className="relative aspect-[16/10] w-full">
              <SmartImage
                src={cert.image ?? ""}
                alt={cert.title}
                label="Add certificate image"
                rounded="rounded-none"
                priority
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close certificate"
                className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:text-accent"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{cert.category}</Badge>
                  <span className="text-xs text-muted-foreground">{cert.date}</span>
                </div>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {hasVerify ? (
                  <a
                    href={cert.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ember-from to-ember-to px-4 py-2.5 text-sm font-medium text-white shadow-glow transition-all hover:brightness-110"
                  >
                    <BadgeCheck className="h-4 w-4" /> Verify credential
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-muted-foreground/70">
                    <BadgeCheck className="h-4 w-4" /> Verification link coming soon
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
