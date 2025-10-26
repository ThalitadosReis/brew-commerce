"use client";

import ContentBlock from "@/components/common/ContentBlock";

import { HeroSection } from "@/components/homepage/HeroSection";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { BenefitsSection } from "@/components/homepage/BenefitsSection";
import { CraftSection } from "@/components/homepage/CraftSection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";

import { FINAL_CTA_IMAGE } from "@/lib/images.home";

export default function Homepage() {
  return (
    <div className="bg-black/5 pb-24 space-y-24">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CraftSection />
      <TestimonialsSection />

      <ContentBlock
        contentClassName="!p-0"
        title="Start your coffee journey today"
        text="Join our community and discover exceptional coffee delivered straight to your door."
        image={FINAL_CTA_IMAGE}
        buttons={[
          { label: "Contact us", href: "/contact", variant: "primary" },
          { label: "Browse", href: "/collection", variant: "secondary" },
        ]}
        priority={false}
      />
    </div>
  );
}
