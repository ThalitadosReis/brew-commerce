import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Section from "../common/Section";
import Button from "../common/Button";

export default function LocationSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const locations = [
    {
      name: "Amsterdam",
      description: "Our home base in the heart of Amsterdam's coffee culture.",
      image:
        "https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg",
      linkText: "View office",
      mapLink: "https://www.google.com/maps/place/Amsterdam,+Netherlands",
    },
    {
      name: "Barcelona",
      description: "Bringing coffee craft to the bustling streets.",
      image:
        "https://images.pexels.com/photos/21063441/pexels-photo-21063441.jpeg",
      linkText: "View office",
      mapLink: "https://www.google.com/maps/place/Barcelona,+Spain",
    },
    {
      name: "Zürich",
      description: "Sharing our coffee story in the Zürich's vibrant scene.",
      image: "https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg",
      linkText: "View office",
      mapLink: "https://www.google.com/maps/place/Z%C3%BCrich,+Switzerland",
    },
  ];

  return (
    <>
      <Head>
        {locations.map((loc) => (
          <link key={loc.name} rel="preload" as="image" href={loc.image} />
        ))}
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <Section
          subtitle="brew."
          title="Locations"
          description="Find us in the cities where coffee passion runs deep."
        />

        <div className="grid grid-cols-1 md:grid-cols-[.5fr_1fr] gap-8">
          <div className="grid items-center gap-y-8">
            {locations.map((loc, index) => (
              <div
                key={loc.name}
                className={`w-full text-left border-l-1 pl-4 cursor-pointer ${
                  activeIndex === index
                    ? "border-black bg-transparent"
                    : "border-transparent"
                }`}
              >
                <div onClick={() => setActiveIndex(index)}>
                  <h3 className="text-xl md:text-2xl font-heading font-semibold">
                    {loc.name}
                  </h3>
                  <p className="whitespace-normal">{loc.description}</p>
                </div>
                <Button
                  as="a"
                  variant="tertiary"
                  className="mt-4 text-sm"
                  href={loc.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {loc.linkText}
                </Button>
              </div>
            ))}
          </div>

          <div>
            <div className="relative w-full h-64 md:h-[400px] lg:h-[500px] overflow-hidden">
              <Image
                src={locations[activeIndex].image}
                alt={locations[activeIndex].name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
