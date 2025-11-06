import { useState } from "react";
import Image from "next/image";
import Section from "@/components/common/Section";
import Button from "@/components/common/Button";
import { CONTACT_LOCATION_IMAGES } from "@/lib/images/contact";

export default function LocationSection() {
  const locations = [
    {
      name: "Amsterdam",
      description: "Our home base in the heart of Amsterdam's coffee culture.",
      image: CONTACT_LOCATION_IMAGES[0],
      linkText: "View office",
      mapLink: "https://www.google.com/maps/place/Amsterdam,+Netherlands",
    },
    {
      name: "Barcelona",
      description: "Bringing coffee craft to the bustling streets.",
      image: CONTACT_LOCATION_IMAGES[1],
      linkText: "View office",
      mapLink: "https://www.google.com/maps/place/Barcelona,+Spain",
    },
    {
      name: "Zürich",
      description: "Sharing our coffee story in Zürich's vibrant scene.",
      image: CONTACT_LOCATION_IMAGES[2],
      linkText: "View office",
      mapLink: "https://www.google.com/maps/place/Z%C3%BCrich,+Switzerland",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = locations[activeIndex];

  return (
    <section className="max-w-7xl mx-auto px-6">
      <Section
        subtitle="brew."
        title="Our locations"
        description="Find us across Europe — visit our coffee spaces and experience the craft up close."
      />

      <div className="grid grid-cols-1 md:grid-cols-[.5fr_1fr] gap-8">
        <div className="grid items-start gap-y-4">
          {locations.map((loc, index) => (
            <div
              key={loc.name}
              className={`border-l-2 pl-4 cursor-pointer transition-all space-y-2 ${
                activeIndex === index
                  ? "border-black"
                  : "border-transparent text-black/50 hover:text-black/75"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <h5 className="text-lg md:text-xl lg:text-2xl font-semibold">
                {loc.name}
              </h5>
              <p className="text-sm lg:text-base">{loc.description}</p>
              <Button
                as="a"
                href={loc.mapLink}
                variant="tertiary"
                target="_blank"
                rel="noopener noreferrer"
                className={
                  activeIndex === index
                    ? ""
                    : "text-black/50 hover:text-black/75"
                }
              >
                {loc.linkText}
              </Button>
            </div>
          ))}
        </div>

        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <Image
            key={active.image}
            src={active.image}
            alt={active.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
            className="object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </section>
  );
}
