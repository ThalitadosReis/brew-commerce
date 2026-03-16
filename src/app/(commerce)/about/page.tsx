"use client";

import Reveal from "@/components/Reveal";
import PageHeader from "@/components/common/PageHeader";
import AboutSection from "@/components/about/AboutSection";
import TimelineSection from "@/components/about/TimelineSection";
import TeamSection from "@/components/about/TeamSection";
import StoryCarousel from "@/components/about/StoryCarousel";

export default function AboutPage() {
  return (
    <>
      <Reveal>
        <PageHeader
          title="Our coffee story"
          description="We craft simple, honest coffee that connects people through pure, carefully selected beans from around the world."
        />
      </Reveal>
      <Reveal direction="right">
        <AboutSection />
      </Reveal>
      <Reveal direction="left" delay={0.08}>
        <TimelineSection />
      </Reveal>
      <Reveal delay={0.12}>
        <TeamSection />
      </Reveal>
      <Reveal delay={0.16}>
        <StoryCarousel />
      </Reveal>
    </>
  );
}
