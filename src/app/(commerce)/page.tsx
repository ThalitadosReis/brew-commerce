"use client";

import Reveal from "@/components/Reveal";
import ContentBlock from "@/components/common/ContentBlock";
import { HeroSection } from "@/components/homepage/HeroSection";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { BenefitsSection } from "@/components/homepage/BenefitsSection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { FINAL_CTA_IMAGE } from "@/lib/images/home";

export default function HomepagePage() {
  return (
    <>
      <HeroSection />
      <Reveal>
        <BenefitsSection />
      </Reveal>
      <Reveal delay={0.08}>
        <FeaturesSection />
      </Reveal>
      <Reveal delay={0.12}>
        <TestimonialsSection />
      </Reveal>

      <Reveal delay={0.16}>
        <ContentBlock
          className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 py-12 lg:py-24"
          contentClassName="!p-0"
          title="Start your coffee journey today"
          text="Join our community and discover exceptional coffee delivered straight to your door."
          image={FINAL_CTA_IMAGE}
          buttons={[
            { label: "Contact us", href: "/contact", variant: "primary" },
            { label: "Shop", href: "/collection", variant: "secondary" },
          ]}
          priority={false}
        />
      </Reveal>
    </>
  );
}
