"use client";

import { useState } from "react";
import Image from "next/image";

import Button from "@/components/common/Button";
import Section from "@/components/common/Section";
import { CONTACT_LOCATION_IMAGES } from "@/lib/images";

const locations = [
  {
    name: "Amsterdam",
    description: "Our home base in the heart of Amsterdam's coffee culture.",
    image: CONTACT_LOCATION_IMAGES[0],
    mapLink: "https://www.google.com/maps/place/Amsterdam,+Netherlands",
  },
  {
    name: "Barcelona",
    description: "Bringing coffee craft to the bustling streets.",
    image: CONTACT_LOCATION_IMAGES[1],
    mapLink: "https://www.google.com/maps/place/Barcelona,+Spain",
  },
  {
    name: "Zürich",
    description: "Sharing our coffee story in Zürich's vibrant scene.",
    image: CONTACT_LOCATION_IMAGES[2],
    mapLink: "https://www.google.com/maps/place/Z%C3%BCrich,+Switzerland",
  },
];

export default function LocationSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = locations[activeIndex];

  return (
    <section className="bg-neutral-50 px-4 md:px-6 py-14 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <Section
          align="left"
          subtitle="Our locations"
          title="Find us across Europe"
          description="Visit our coffee spaces and experience the craft up close."
        />

        <div className="grid md:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12">
          <div className="flex flex-col justify-center gap-6">
            {locations.map((loc, i) => (
              <div
                key={loc.name}
                onClick={() => setActiveIndex(i)}
                className={`border-l-2 pl-5 cursor-pointer transition-all space-y-1.5 ${
                  activeIndex === i
                    ? "border-black"
                    : "border-transparent text-black/40 hover:text-black/60"
                }`}
              >
                <h5 className="text-2xl lg:text-3xl font-semibold tracking-[-0.02em]">
                  {loc.name}
                </h5>
                <p className="text-sm leading-6">{loc.description}</p>
                <Button
                  as="a"
                  href={loc.mapLink}
                  variant="link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={activeIndex === i ? "" : "text-black/40 hover:text-black/60"}
                >
                  View on map
                </Button>
              </div>
            ))}
          </div>

          <div className="relative w-full h-64 md:h-[480px] overflow-hidden">
            {locations.map((loc, i) => (
              <div
                key={loc.name}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  i === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={loc.image}
                  alt={loc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
