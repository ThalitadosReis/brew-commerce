"use client";

import Reveal from "@/components/Reveal";
import PageHeader from "@/components/common/PageHeader";
import AboutSection from "@/components/about/AboutSection";
import { BenefitsStrip } from "@/components/about/BenefitsStrip";
import { PhilosophySection } from "@/components/about/PhilosophySection";
import TimelineSection from "@/components/about/TimelineSection";
import TeamSection from "@/components/about/TeamSection";
import { TeamIntroSection } from "@/components/about/TeamIntroSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import ImageCarousel from "@/components/common/ImageCarousel";

import { ABOUT_IMAGES } from "@/lib/images";

export default function AboutPage() {
  return (
    <>
      <Reveal>
        <PageHeader
          title="Our coffee story"
          description="We craft simple, honest coffee that connects people through pure, carefully selected beans from around the world."
          backgroundImage={ABOUT_IMAGES[0]}
        />
      </Reveal>

      <Reveal delay={0.08}>
        <AboutSection />
      </Reveal>

      <Reveal delay={0.08}>
        <BenefitsStrip />
      </Reveal>

      <Reveal delay={0.08}>
        <PhilosophySection />
      </Reveal>

      <TimelineSection />

      <Reveal delay={0.08}>
        <TeamIntroSection />
      </Reveal>

      <Reveal delay={0.08}>
        <TeamSection />
      </Reveal>

      <Reveal delay={0.08}>
        <ValuesSection />
      </Reveal>

      <Reveal delay={0.08}>
        <ImageCarousel />
      </Reveal>
    </>
  );
}
