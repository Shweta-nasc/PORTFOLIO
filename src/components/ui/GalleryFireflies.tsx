"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  speed: number;
}

/** Warm drifting fireflies for the sunset lakeside ambiance. Cheap canvas,
 *  paused when off-screen and disabled for reduced-motion. */
export function GalleryFireflies({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let flies: Firefly[] = [];

    const sprite = document.createElement("canvas");
    sprite.width = 48;
    sprite.height = 48;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(24, 24, 0, 24, 24, 24);
      g.addColorStop(0, "rgba(255,224,150,1)");
      g.addColorStop(0.4, "rgba(255,180,90,0.5)");
      g.addColorStop(1, "rgba(255,170,80,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 48, 48);
    }

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? 400;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((width * height) / 42000), 16);
      flies = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 8,
        r: 2 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.4,
      }));
    };

    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const f of flies) {
        f.phase += f.speed * dt;
        f.vx += (Math.random() - 0.5) * 6 * dt;
        f.vy += (Math.random() - 0.5) * 6 * dt;
        f.vx = Math.max(-14, Math.min(14, f.vx));
        f.vy = Math.max(-12, Math.min(12, f.vy));
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        if (f.x < 0) f.x += width;
        if (f.x > width) f.x -= width;
        if (f.y < 0) f.y += height;
        if (f.y > height) f.y -= height;
        const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f.phase));
        const sz = f.r * 5;
        ctx.globalAlpha = glow * 0.8;
        ctx.drawImage(sprite, f.x - sz, f.y - sz, sz * 2, sz * 2);
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
