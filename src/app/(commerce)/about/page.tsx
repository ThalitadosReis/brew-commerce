"use client";

import PageHeader from "@/components/common/PageHeader";
import AboutSection from "@/components/about/AboutSection";
import TimelineSection from "@/components/about/TimelineSection";
import TeamSection from "@/components/about/TeamSection";
import StoryCarousel from "@/components/about/StoryCarousel";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our coffee story"
        description="We craft simple, honest coffee that connects people through pure, carefully selected beans from around the world."
      />
      <AboutSection />
      <TimelineSection />
      <TeamSection />
      <StoryCarousel />
    </>
  );
}
