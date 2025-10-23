"use client";

import { useState } from "react";
import Image from "next/image";
import Head from "next/head";

interface TabContentItem {
  title: string;
  text: string;
  image: string;
}

type TabKeys = "flavor" | "roast" | "brew";

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

      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12 lg:mb-24">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h5 className="text-lg font-heading">Origin</h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
              Taste the difference
            </h2>
            <p className="text-body">
              {
                "Our coffee represents more than a drink. It's a journey through Ethiopian landscapes and traditions."
              }
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-8 flex items-center gap-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`text-body border-b-1 ${
                  activeTab === tab.key
                    ? "border-black"
                    : "border-transparent text-black/70"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 md:items-center border border-black/20 bg-white overflow-hidden">
            <div className="p-6 lg:p-8 space-y-4">
              <h5 className="mb-1 text-lg font-heading">{activeTab}</h5>
              <h2 className="text-4xl lg:text-5xl font-heading">
                {tabContent[activeTab].title}
              </h2>
              <p className="font-body text-black/70">
                {tabContent[activeTab].text}
              </p>
            </div>

            <div className="relative aspect-square">
              <Image
                src={tabContent[activeTab].image}
                alt={tabContent[activeTab].title}
                fill
                className="object-cover w-full"
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
