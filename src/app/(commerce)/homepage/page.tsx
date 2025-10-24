"use client";

import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import BenefitsSection from "@/components/homepage/BenefitsSection";
import CraftSection from "@/components/homepage/CraftSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import Contact from "@/components/common/ContentBlock";
import Head from "next/head";

const image =
  "https://images.pexels.com/photos/4820847/pexels-photo-4820847.jpeg";

export default function Homepage() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <div className="bg-black/5 pb-24 space-y-24">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <CraftSection />
        <TestimonialsSection />
        <Contact
          contentClassName="!p-0"
          title="Start your coffee journey today"
          text="Join our community and discover exceptional coffee delivered straight to your door."
          image={image}
          buttons={[
            { label: "Contact us", href: "/contact", variant: "primary" },
            { label: "Browse", href: "/collection", variant: "secondary" },
          ]}
        />
      </div>
    </>
  );
}
