"use client";

import { useEffect, useRef } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { categoryEmoji } from "@/data/gallery";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import type { GalleryItem } from "@/types";

interface CylinderCarouselProps {
  items: GalleryItem[];
  onOpen: (index: number) => void;
  paused: boolean;
}

const DRAG_SENSITIVITY = 0.22; // deg per px — heavy
const WHEEL_SENSITIVITY = 0.16;
const AUTO_SPEED = 0.28; // deg/frame ≈ one revolution every ~21s
const FRICTION = 0.97; // heavy object — long, smooth glide

export function CylinderCarousel({ items, onOpen, paused }: CylinderCarouselProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scalerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  // Engine state (kept in refs so the loop never triggers React renders).
  const rotation = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const lastX = useRef(0);
  const moved = useRef(0);
  const pausedRef = useRef(paused);
  const styleCache = useRef<{ op: number; bl: number; br: number }[]>([]);

  const n = items.length;
  const step = 360 / n;
  const cardW = isMobile ? 190 : 280;
  const cardH = isMobile ? 252 : 360;
  // Radius derived from a target edge gap so adjacent cards never touch and the
  // cylinder reads open and museum-like. gap = visible breathing room (px).
  const gap = isMobile ? 26 : 44;
  const radius = Math.round((cardW + gap) / (2 * Math.sin(Math.PI / n)));
  const wrapH = cardH + (isMobile ? 76 : 116);
  const perspective = isMobile ? 820 : 1050;

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  /* ---- Render loop ---- */
  useEffect(() => {
    let raf = 0;
    let lastT = performance.now();

    const applyStyles = () => {
      const rot = rotation.current;
      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`;
      }
      for (let i = 0; i < n; i += 1) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const facing = (((rot + i * step) % 360) + 540) % 360 - 180;
        const a = Math.abs(facing);

        let op = a <= 90 ? 1 - (a / 90) * 0.3 : 0.7 - ((a - 90) / 90) * 0.56;
        op = Math.round(Math.max(op, 0.12) * 100) / 100;
        let bl = a <= 48 ? 0 : ((a - 48) / 132) * 6;
        bl = Math.round(bl * 2) / 2;
        // Front cards stay at full brightness (br≈1 → no filter, so their 3D
        // hover pop isn't flattened); side/back cards dim for depth.
        let br = a <= 90 ? 1 - (a / 90) * 0.22 : 0.78 - ((a - 90) / 90) * 0.16;
        br = Math.round(Math.min(br, 1) * 100) / 100;

        const cache = styleCache.current[i] ?? { op: -1, bl: -1, br: -1 };
        if (cache.op !== op) {
          el.style.opacity = String(op);
          cache.op = op;
        }
        if (cache.bl !== bl || cache.br !== br) {
          const hasFilter = bl > 0 || br < 0.999;
          el.style.filter = hasFilter
            ? `${bl > 0 ? `blur(${bl}px) ` : ""}brightness(${br})`
            : "none";
          cache.bl = bl;
          cache.br = br;
        }
        styleCache.current[i] = cache;

        el.style.zIndex = String(Math.round(1000 - a));
        el.style.pointerEvents = a < 50 ? "auto" : "none";

        const sc = scalerRefs.current[i];
        if (sc) {
          const front = Math.max(0, 1 - a / 70);
          sc.style.transform = `scale(${(1 + front * 0.06).toFixed(3)})`;
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - lastT) / 16.67, 3);
      lastT = now;

      if (!dragging.current) {
        if (!pausedRef.current && !hovering.current && !reduced) {
          rotation.current += AUTO_SPEED * dt;
        }
        rotation.current += velocity.current * dt;
        velocity.current *= Math.pow(FRICTION, dt);
        if (Math.abs(velocity.current) < 0.01) velocity.current = 0;
      }
      applyStyles();
    };

    applyStyles();
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [n, step, radius, reduced]);

  /* ---- Interactions ---- */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      moved.current += Math.abs(dx);
      const d = dx * DRAG_SENSITIVITY;
      rotation.current += d;
      velocity.current = d;
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      moved.current = 0;
      velocity.current = 0;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    // Horizontal trackpad / shift-wheel rotates. Vertical wheel is left to the
    // page so we never trap scrolling.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const d = e.deltaX * WHEEL_SENSITIVITY;
        rotation.current += d;
        velocity.current = d * 0.4;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") velocity.current += 2.2;
      else if (e.key === "ArrowRight") velocity.current -= 2.2;
    };
    const onEnter = () => {
      hovering.current = true;
    };
    const onLeave = () => {
      hovering.current = false;
    };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("wheel", onWheel, { passive: false });
    wrap.addEventListener("keydown", onKey);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("keydown", onKey);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="listbox"
      aria-label="Gallery carousel — drag, scroll horizontally, or use arrow keys"
      className="relative mx-auto cursor-grab select-none outline-none active:cursor-grabbing"
      style={{ height: wrapH, perspective, touchAction: "pan-y" }}
    >
      <div
        ref={ringRef}
        className="absolute left-1/2 top-1/2"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute"
            style={{
              width: cardW,
              height: cardH,
              left: -cardW / 2,
              top: -cardH / 2,
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              transformStyle: "preserve-3d",
              willChange: "opacity, filter",
            }}
          >
            <div
              ref={(el) => {
                scalerRefs.current[i] = el;
              }}
              className="h-full w-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <button
                type="button"
                onClick={() => {
                  if (moved.current < 8) onOpen(i);
                }}
                aria-label={`Open ${item.title}`}
                className="group relative block h-full w-full overflow-hidden rounded-2xl border border-white/12 bg-[hsl(var(--card))]/70 text-left shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md transition-[transform,box-shadow,filter] duration-300 will-change-transform hover:z-10 hover:brightness-[1.12] hover:shadow-[0_34px_80px_-22px_rgba(0,0,0,0.9),0_0_52px_-6px_rgba(255,176,92,0.6)] hover:[transform:translateY(-8px)_translateZ(26px)_scale(1.05)]"
              >
                <div className="relative h-[62%] w-full overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    label={item.category}
                    rounded="rounded-none"
                    className="h-full w-full transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                    <span aria-hidden>{categoryEmoji[item.category]}</span>
                    {item.category}
                  </span>
                </div>

                <div className="flex h-[38%] flex-col justify-center gap-0.5 p-4">
                  <h3 className="truncate text-base font-semibold leading-tight text-foreground">
                    {item.title}
                  </h3>
                  {item.location && (
                    <p className="truncate text-sm text-muted-foreground">{item.location}</p>
                  )}
                  {item.date && (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-accent/80">
                      {item.date}
                    </p>
                  )}
                </div>

                {/* soft reflection sheen */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/[0.06] to-transparent" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
