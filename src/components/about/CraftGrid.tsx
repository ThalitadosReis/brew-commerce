import { ReactNode } from "react";
import Link from "next/link";

import {
  CaretRightIcon,
  FireIcon,
  PlantIcon,
  SealCheckIcon,
} from "@phosphor-icons/react";

type CraftItemType = {
  heading: string;
  text: string;
  icon: ReactNode;
};

const craftItems: CraftItemType[] = [
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

export default function CraftGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="mb-12 lg:mb-24">
        <div className="mx-auto text-center space-y-4">
          <h5 className="text-lg font-heading">Craft</h5>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
            How we bring exceptional coffee to your cup
          </h2>
          <p className="text-body">
            We select beans with precision, roast with care, and deliver pure
            flavor in every package.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
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

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/collection"
          className="inline-flex items-center justify-center bg-black/5 hover:bg-black/10 font-medium px-6 py-3 rounded"
        >
          Shop now
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center font-medium gap-2 group"
        >
          Contact
          <CaretRightIcon
            size={16}
            weight="bold"
            className="transform transition-transform duration-200 ease-in-out group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
