"use client";

import PageHeader from "@/components/common/PageHeader";
import TimelineSection from "@/components/about/TimelineSection";
import CraftGrid from "@/components/about/CraftGrid";
import TeamSection from "@/components/about/TeamSection";
import AboutSection from "@/components/about/AboutSection";
import StorySection from "@/components/about/StorySection";

export default function AboutPage() {
  return (
    <div className="bg-black/5 py-32 space-y-24">
      <PageHeader
        title="Our coffee story"
        description="We craft simple, honest coffee that connects people through pure, carefully selected beans from around the world."
      />
      <TimelineSection />
      <CraftGrid />
      <AboutSection />
      <TeamSection />
      <StorySection />
    </div>
  );
}
