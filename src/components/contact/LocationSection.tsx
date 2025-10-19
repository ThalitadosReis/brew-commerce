import { useState } from "react";
import Image from "next/image";
import Head from "next/head";

type LocationType = {
  name: string;
  description: string;
  image: string;
  linkText: string;
  mapLink: string;
};

const locations: LocationType[] = [
  {
    name: "Amsterdam",
    description: "Our home base in the heart of Amsterdam's coffee culture.",
    image: "https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg",
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

export default function LocationSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Head>
        {locations.map((loc) => (
          <link key={loc.name} rel="preload" as="image" href={loc.image} />
        ))}
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12 lg:mb-24">
          <div className="mx-auto text-center space-y-4">
            <h5 className="text-lg font-heading">brew.</h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
              Locations
            </h2>
            <p className="text-body">
              Find us in the cities where coffee passion runs deep.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[.5fr_1fr] gap-8">
          <div className="grid gap-y-12">
            {locations.map((loc, index) => (
              <button
                key={loc.name}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left border-l-1 pl-4 ${
                  activeIndex === index
                    ? "border-black bg-transparent"
                    : "border-transparent"
                } focus:outline-none`}
              >
                <h3 className="text-xl md:text-2xl font-heading font-semibold">
                  {loc.name}
                </h3>
                <p className="whitespace-normal">{loc.description}</p>
                <a
                  href={loc.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline mt-2 inline-block"
                >
                  {loc.linkText}
                </a>
              </button>
            ))}
          </div>

          <div>
            <div className="relative w-full h-64 md:h-[400px] lg:h-[500px] overflow-hidden">
              <Image
                src={locations[activeIndex].image}
                alt={locations[activeIndex].name}
                fill
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
