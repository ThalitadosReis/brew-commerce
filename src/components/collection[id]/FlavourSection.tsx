"use client";

import { useState } from "react";
import Section from "@/components/common/Section";
import ContentBlock from "@/components/common/ContentBlock";
import { FLAVOUR_TABS } from "@/lib/images/products";

type TabKeys = keyof typeof FLAVOUR_TABS;

interface TabContentItem {
  title: string;
  text: string;
  image: string;
}

export default function FlavourSection() {
  const [activeTab, setActiveTab] = useState<TabKeys>("flavor");

  const tabs: { key: TabKeys; label: string }[] = [
    { key: "flavor", label: "Flavor profile" },
    { key: "roast", label: "Roasting process" },
    { key: "brew", label: "Brewing methods" },
  ];

  const tabContent: Record<TabKeys, TabContentItem> = {
    flavor: {
      title: "Rich and complex taste notes",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      image: FLAVOUR_TABS.flavor,
    },
    roast: {
      title: "Careful roasting process",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      image: FLAVOUR_TABS.roast,
    },
    brew: {
      title: "Perfect brewing methods",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      image: FLAVOUR_TABS.brew,
    },
  };

  const active = tabContent[activeTab];

  return (
    <section className="max-w-7xl mx-auto">
      <Section
        className="px-6"
        subtitle="Origin"
        title="Taste the difference"
        description="Our coffee represents more than a drink. It's a journey through Ethiopian landscapes and traditions."
      />

      <div className="flex justify-around md:justify-center mb-4 md:gap-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`text-xs md:text-sm lg:text-base border-b-2 pb-1 ${
              activeTab === tab.key
                ? "border-black font-semibold"
                : "border-transparent text-black/75"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ContentBlock
        className="bg-white border border-black/25"
        title={active.title}
        text={active.text}
        image={active.image}
        imagePosition="right"
      />
    </section>
  );
}
