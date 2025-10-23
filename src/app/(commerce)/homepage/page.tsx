"use client";

import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import BenefitsSection from "@/components/homepage/BenefitsSection";
import CraftSection from "@/components/homepage/CraftSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import ContactSection from "@/components/homepage/ContactSection";

export default function Homepage() {
  return (
    <>
      <div className="bg-black/5 pb-24 space-y-24">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <CraftSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    </>
  );
}
