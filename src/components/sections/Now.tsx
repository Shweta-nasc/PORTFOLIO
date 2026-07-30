"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InteractiveBook } from "@/components/ui/InteractiveBook";
import { Reveal } from "@/components/ui/Reveal";

export function Now() {
  return (
    <Section id="now" spacing="tight">
      <SectionHeading
        eyebrow="Currently"
        title="From my engineering journal"
        description="A worn leather notebook by the lake — open it to see what I'm building, learning, reading, and chasing next."
      />

      <Reveal className="mt-14 flex flex-col items-center">
        <InteractiveBook className="relative z-10" />

        {/* Tree-stump surface the journal rests on */}
        <div className="relative z-0 -mt-4 w-[min(20rem,88%)]" aria-hidden>
          <div className="mx-auto h-6 w-full rounded-[100%] bg-gradient-to-b from-[#5a3d24] to-[#2c1c0f] shadow-[0_26px_46px_-18px_rgba(0,0,0,0.75)]" />
          <div className="mx-auto -mt-5 h-6 w-[90%] rounded-[100%] border border-[#7a5533]/40 bg-[#442e1c]" />
          <div className="mx-auto -mt-4 h-4 w-[68%] rounded-[100%] border border-[#7a5533]/30" />
          <div className="mx-auto -mt-3 h-2.5 w-[42%] rounded-[100%] border border-[#7a5533]/25" />
        </div>
      </Reveal>
    </Section>
  );
}
