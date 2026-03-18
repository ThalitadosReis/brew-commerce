"use client";

import Reveal from "@/components/Reveal";
import { Hero } from "@/components/homepage/Hero";
import { OriginsSection } from "@/components/homepage/OriginsSection";
import { StatementSection } from "@/components/homepage/StatementSection";
import { ProcessSection } from "@/components/homepage/ProcessSection";
import { CtaSection } from "@/components/homepage/CtaSection";

export default function HomepagePage() {
  return (
    <>
      <Hero />
      <Reveal delay={0.08}>
        <OriginsSection />
      </Reveal>

      <StatementSection />

      <Reveal delay={0.08}>
        <ProcessSection />
      </Reveal>

      <Reveal delay={0.08}>
        <CtaSection />
      </Reveal>
    </>
  );
}
