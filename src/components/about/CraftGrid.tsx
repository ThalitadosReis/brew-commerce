import Link from "next/link";
import { FireIcon, PlantIcon, SealCheckIcon } from "@phosphor-icons/react";
import Section from "../common/Section";
import Button from "../common/Button";

export default function CraftGrid() {
  const craftItems = [
    {
      heading: "Sourcing the Finest Beans",
      text: "We work directly with farmers who share our commitment to quality and sustainability.",
      icon: <PlantIcon size={32} weight="light" />,
    },
    {
      heading: "Roasting with Precision",
      text: "Each batch is roasted to highlight the unique characteristics of its origin.",
      icon: <FireIcon size={32} weight="light" />,
    },
    {
      heading: "Quality Without Compromise",
      text: "We taste and test every batch; only the best reaches your cup.",
      icon: <SealCheckIcon size={32} weight="light" />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6">
      <Section
        subtitle="Craft"
        title="How we bring exceptional coffee to your cup"
        description="We select beans with precision, roast with care, and deliver pure flavor in every package."
      />

      <div className="grid gap-8 md:grid-cols-3 space-y-12">
        {craftItems.map((item, idx) => (
          <div key={idx} className="text-center space-y-2">
            <div className="flex justify-center">{item.icon}</div>
            <h3 className="text-xl lg:text-2xl font-heading font-semibold">
              {item.heading}
            </h3>
            <p className="text-black/70">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button variant="secondary">
          <Link href="/collection"> Shop now</Link>
        </Button>
        <Button variant="tertiary">
          <Link href="/contact"> Contact</Link>
        </Button>
      </div>
    </section>
  );
}
