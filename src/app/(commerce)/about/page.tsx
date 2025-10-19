"use client";

import TimelineSection from "@/components/about/TimelineSection";
import CraftGrid from "@/components/about/CraftGrid";
import TeamSection from "@/components/about/TeamSection";
import AboutSection from "@/components/about/AboutSection";
import StorySection from "@/components/about/StorySection";

export default function AboutPage() {
  return (
    <div className="bg-black/5 py-24 space-y-24 lg:space-y-32">
      <div className="max-w-2xl mx-auto text-center py-24 px-6 space-y-8">
        <h1 className="text-5xl md:text-6xl font-heading">Our coffee story</h1>
        <p className="text-sm font-body">
          We craft simple, honest coffee that connects people through pure,
          carefully selected beans from around the world.
        </p>
      </div>

      <TimelineSection />
      <CraftGrid />
      <AboutSection />
      <TeamSection />
      <StorySection />
    </div>
  );
}
