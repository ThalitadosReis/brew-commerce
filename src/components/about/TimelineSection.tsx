"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { STORY_IMAGES } from "@/lib/images/about";

const timelineItems = [
  {
    year: "2017",
    heading: "Idea Was Brewed",
    text: "The concept of bringing ethically sourced specialty coffee to homes around the world started in a small hometown café.",
    image: STORY_IMAGES[0],
  },
  {
    year: "2018",
    heading: "First Beans from Colombia",
    text: "We began sourcing Arabica beans directly from small family farms in Colombia, ensuring fair prices and full traceability.",
    image: STORY_IMAGES[1],
  },
  {
    year: "2019",
    heading: "Ethiopian & Brazilian Partnerships",
    text: "Expanded to cooperatives in Yirgacheffe, Ethiopia and Minas Gerais, Brazil, adding distinct flavor profiles to our range.",
    image: STORY_IMAGES[2],
  },
  {
    year: "2020",
    heading: "Online Store Launch",
    text: "Our platform went live, giving customers worldwide access to freshly roasted beans shipped directly to their door.",
    image: STORY_IMAGES[3],
  },
  {
    year: "2021",
    heading: "European Distribution",
    text: "Opened our first European roasting hub in Amsterdam, cutting delivery times across the continent significantly.",
    image: STORY_IMAGES[4],
  },
  {
    year: "Today",
    heading: "A Global Coffee Community",
    text: "We source from over seven countries, roast fresh every week, and ship to customers in more than fifteen countries — with sustainability at the core of every decision.",
    image: STORY_IMAGES[5],
  },
] as const;

export default function TimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { top } = sectionRef.current.getBoundingClientRect();
      const scrolled = -top;
      const idx = Math.min(
        Math.max(0, Math.floor(scrolled / window.innerHeight)),
        timelineItems.length - 1,
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${timelineItems.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen grid grid-rows-2 lg:grid-rows-none lg:grid-cols-2 overflow-hidden">
        <div className="order-2 lg:order-1 bg-neutral-900 relative overflow-hidden">
          {timelineItems.map((item, i) => (
            <div
              key={item.year}
              className={`absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16 transition-all duration-700 ease-out ${
                i === activeIndex
                  ? "opacity-100 translate-y-0"
                  : i < activeIndex
                    ? "opacity-0 -translate-y-6"
                    : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-xs tracking-[0.28em] uppercase text-amber-600 mb-5">
                {item.year}
              </p>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-white leading-tight mb-5">
                {item.heading}
              </h3>
              <p className="text-sm leading-7 text-neutral-400 max-w-sm">
                {item.text}
              </p>

              {/* progress indicator */}
              <div className="flex items-center gap-1.5 mt-10">
                {timelineItems.map((_, j) => (
                  <span
                    key={j}
                    className={`h-0.5 transition-all duration-500 ${
                      j === activeIndex
                        ? "w-8 bg-amber-600"
                        : "w-4 bg-neutral-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="order-1 lg:order-2 relative overflow-hidden">
          {timelineItems.map((item, i) => (
            <div
              key={item.year}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.image}
                alt={item.heading}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
