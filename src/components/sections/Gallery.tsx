"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CylinderCarousel } from "@/components/ui/CylinderCarousel";
import { GalleryModal } from "@/components/ui/GalleryModal";
import { GalleryFireflies } from "@/components/ui/GalleryFireflies";
import { galleryItems } from "@/data/gallery";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 80, damping: 18, mass: 0.8 };
  const tX = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), spring);
  const tY = useSpring(useTransform(my, [-0.5, 0.5], [-9, 9]), spring);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <Section id="gallery">
      <SectionHeading
        index="09"
        eyebrow="Gallery"
        title="Moments, in Frames"
        description="A collection of hackathons, achievements, sports, leadership, travel and memorable moments — spun into a little museum you can explore."
      />

      <div
        className="relative mt-14"
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        {/* Sunset warm glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-4 h-72 w-[44rem] max-w-[94%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(255,150,70,0.26),transparent_70%)] blur-2xl" />
          <div className="absolute left-1/2 top-24 h-64 w-[34rem] max-w-[88%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(214,90,120,0.2),transparent_70%)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-40 w-[40rem] max-w-[92%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(140,90,200,0.16),transparent_70%)] blur-3xl" />
        </div>

        {/* Hanging lanterns */}
        <Lantern className="left-[7%] top-0" delay={0} />
        <Lantern className="right-[9%] top-3" delay={1.3} />

        {/* Fireflies */}
        <GalleryFireflies />

        {/* Floating stage */}
        <motion.div
          animate={reduced ? undefined : { y: [0, -10, 0] }}
          transition={reduced ? undefined : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <motion.div style={reduced ? undefined : { x: tX, y: tY }}>
            <CylinderCarousel
              items={galleryItems}
              onOpen={setOpenIndex}
              paused={openIndex !== null}
            />
          </motion.div>
        </motion.div>

        {/* Reflection on the lake */}
        <div className="pointer-events-none relative mx-auto -mt-2 h-28 w-full max-w-3xl overflow-hidden">
          <div className="absolute left-1/2 top-1 h-14 w-[58%] -translate-x-1/2 rounded-[100%] bg-white/[0.05] blur-md" />
          <div className="absolute left-1/2 top-0 h-24 w-[72%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(255,150,80,0.16),transparent_70%)] blur-xl [transform:scaleY(-1)]" />
          <div
            className="absolute inset-x-0 top-5 h-full opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 9px)",
            }}
          />
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Drag &nbsp;·&nbsp; scroll sideways &nbsp;·&nbsp; use ← → keys &nbsp;·&nbsp; click a frame
        </p>
      </div>

      <GalleryModal
        items={galleryItems}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </Section>
  );
}

function Lantern({ className, delay }: { className?: string; delay: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={cn("pointer-events-none absolute z-10 hidden md:block", className)}>
      <motion.div
        animate={reduced ? undefined : { rotate: [-3, 3, -3] }}
        transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ transformOrigin: "top center" }}
        className="flex flex-col items-center"
      >
        <div className="h-14 w-px bg-white/20" />
        <div className="relative h-10 w-7 rounded-b-2xl rounded-t-md bg-gradient-to-b from-amber-300/85 to-amber-600/70 shadow-[0_0_34px_9px_rgba(255,170,70,0.4)]">
          <div className="absolute inset-x-1 top-1 bottom-1 rounded-xl bg-amber-100/50 blur-[2px]" />
        </div>
      </motion.div>
    </div>
  );
}
