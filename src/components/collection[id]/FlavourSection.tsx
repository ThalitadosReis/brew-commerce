"use client";

import { useState } from "react";
import Head from "next/head";
import Section from "../common/Section";
import ContentBlock from "../common/ContentBlock";

type TabKeys = "flavor" | "roast" | "brew";

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
      image:
        "https://images.pexels.com/photos/5461668/pexels-photo-5461668.jpeg",
    },
    roast: {
      title: "Careful roasting process",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      image:
        "https://images.pexels.com/photos/4816461/pexels-photo-4816461.jpeg",
    },
    brew: {
      title: "Perfect brewing methods",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      image:
        "https://images.pexels.com/photos/4820675/pexels-photo-4820675.jpeg",
    },
  };

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={tabContent[activeTab].image} />
      </Head>

      <section className="max-w-7xl mx-auto">
        <Section
          className="px-6"
          subtitle="Origin"
          title="Taste the difference"
          description="Our coffee represents more than a drink. It's a journey through Ethiopian landscapes and traditions."
        />

        <div className="flex justify-center mb-8 gap-x-6 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`text-sm md:text-base border-b-2 pb-1 ${
                activeTab === tab.key
                  ? "border-black font-semibold"
                  : "border-transparent text-black/70"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ContentBlock
          className="bg-white border border-black/20"
          title={tabContent[activeTab].title}
          text={tabContent[activeTab].text}
          image={tabContent[activeTab].image}
          imagePosition="right"
        />
      </section>
    </>
  );
}
