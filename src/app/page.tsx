"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/effects/Loader";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { ScrollToTop } from "@/components/effects/ScrollToTop";
import { CommandPalette } from "@/components/effects/CommandPalette";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Now } from "@/components/sections/Now";
import { Projects } from "@/components/sections/Projects";
import { Certificates } from "@/components/sections/Certificates";
import { Journey } from "@/components/sections/Journey";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { CodingProfiles } from "@/components/sections/CodingProfiles";
import { Leadership } from "@/components/sections/Leadership";
import { Extracurricular } from "@/components/sections/Extracurricular";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { useIsEmbedded, isEmbeddedNow } from "@/components/effects/showcase/embed";

// Client-only cinematic background — layered behind all content (see z-index below).
const WorldBackground = dynamic(
  () =>
    import("@/components/effects/world/WorldBackground").then(
      (m) => m.WorldBackground,
    ),
  { ssr: false },
);

export default function Home() {
  const [commandOpen, setCommandOpen] = useState(false);
  // When rendered inside the Live Preview device screen (?embed=1), drop the
  // heavy background chrome: the scroll-locking Loader, the second WebGL world
  // (perf), and the cursor glow (no pointer inside the frame).
  const embedded = useIsEmbedded();

  return (
    <>
      {embedded && (
        // Hide scrollbars on the mini-site so the device screen stays clean.
        <style>{`::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}html{scrollbar-width:none!important}`}</style>
      )}

      {!embedded && <Loader />}
      {/* WorldBackground is a heavy ssr:false WebGL scene — skip it synchronously
          in the embedded preview so a 2nd terrain never spins up inside the laptop.
          Wrapped so a WebGL failure degrades to the plain background, not a crash. */}
      {!isEmbeddedNow() && (
        <ErrorBoundary name="WorldBackground">
          <WorldBackground />
        </ErrorBoundary>
      )}
      {!embedded && <CursorGlow />}
      <ScrollProgress />
      <Navbar onOpenCommand={() => setCommandOpen(true)} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      {/* Content floats above the world (world is fixed at z-0). */}
      <div className="relative z-10">
        <main className="relative">
          <Hero />
          <About />
          <Skills />
          <Now />
          <Projects />
          <Certificates />
          <Journey />
          <Experience />
          <Achievements />
          <CodingProfiles />
          <Leadership />
          <Extracurricular />
          <Gallery />
          <Testimonials />
          <Faq />
          <Contact />
        </main>

        <Footer />
      </div>

      <ScrollToTop />
    </>
  );
}
