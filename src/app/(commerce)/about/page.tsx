"use client";

import Reveal from "@/components/Reveal";
import PageHeader from "@/components/common/PageHeader";
import AboutSection from "@/components/about/AboutSection";
import TimelineSection from "@/components/about/TimelineSection";
import TeamSection from "@/components/about/TeamSection";
import ImageCarousel from "@/components/common/ImageCarousel";

import { ABOUT_IMAGES } from "@/lib/images/about";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our coffee story"
        description="We craft simple, honest coffee that connects people through pure, carefully selected beans from around the world."
        backgroundImage={ABOUT_IMAGES[0]}
      />
      <AboutSection />
      <TimelineSection />
      <TeamSection />
      <ImageCarousel />
    </>
  );
}
