"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpIcon } from "@phosphor-icons/react";

import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import BenefitsSection from "@/components/homepage/BenefitsSection";
import CraftSection from "@/components/homepage/CraftSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import ContactSection from "@/components/homepage/ContactSection";

export default function Homepage() {
  const [showScroll, setShowScroll] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowScroll(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => {
      if (hero) observer.unobserve(hero);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="bg-black/5 pb-24 space-y-24">
        <div ref={heroRef}>
          <HeroSection />
        </div>

        <FeaturesSection />
        <BenefitsSection />
        <CraftSection />
        <TestimonialsSection />
        <ContactSection />
      </div>

      {showScroll && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="hidden lg:block fixed bottom-1/3 right-6 lg:right-8 p-3 bg-black/30 hover:bg-black/40 text-white transition-all duration-200 z-50 -translate-y-1/3"
        >
          <ArrowUpIcon size={24} weight="light" />
        </button>
      )}
    </>
  );
}
