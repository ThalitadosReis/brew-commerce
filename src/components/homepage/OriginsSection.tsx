import Image from "next/image";

import Button from "@/components/common/Button";
import Section from "@/components/common/Section";

import { FEATURE_IMAGES } from "@/lib/images";

const countryCards = [
  {
    country: "Ethiopia",
    title: "Floral, bright, and layered cups",
    description:
      "Explore coffees with citrus lift, tea-like structure, and a cleaner finish.",
    image: FEATURE_IMAGES[0],
  },
  {
    country: "Colombia",
    title: "Balanced coffees with sweetness and depth",
    description:
      "A dependable starting point if you like rounded cups with fruit and chocolate notes.",
    image: FEATURE_IMAGES[1],
  },
  {
    country: "Brazil",
    title: "Comforting profiles for espresso and daily brews",
    description:
      "Lower-acidity coffees with body, softness, and a more familiar chocolate-nut base.",
    image: FEATURE_IMAGES[2],
  },
];

export function OriginsSection() {
  return (
    <section className="bg-white px-4 py-14 md:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Section
          align="left"
          subtitle="Explore countries"
          title="Start with the origin that fits how you like to drink coffee"
          action={
            <Button as="link" href="/collection" variant="outline">
              Shop all
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {countryCards.map((card) => (
            <article key={card.country} className="bg-neutral-100">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.country}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>

              <div className="space-y-4 p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700">
                  {card.country}
                </p>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-black">
                  {card.title}
                </h3>
                <p className="text-sm leading-7 text-neutral-600">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
