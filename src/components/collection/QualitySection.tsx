import { useState } from "react";
import Image from "next/image";
import Section from "../common/Section";
import { QUALITY_IMAGES } from "@/lib/images/collection";

const TABS = [
  {
    key: "farm",
    title: "Farm origins",
    text: "Our beans come from small, family-owned farms in the Sidamo region of Ethiopia. Each farm has a unique story and tradition.",
    image: QUALITY_IMAGES[0],
  },
  {
    key: "certifications",
    title: "Certifications",
    text: "We hold organic and fair trade certifications. Our commitment to ethical sourcing is unwavering.",
    image: QUALITY_IMAGES[1],
  },
  {
    key: "sustainability",
    title: "Sustainability",
    text: "We invest in local communities and environmental conservation. Our practices support both farmers and the ecosystem.",
    image: QUALITY_IMAGES[2],
  },
];

export default function QualitySection() {
  const [activeTab, setActiveTab] = useState("farm");

  const active = TABS.find((t) => t.key === activeTab) ?? TABS[0];

  return (
    <section className="max-w-7xl mx-auto px-8">
      <Section
        subtitle="Quality"
        title="Beyond the perfect cup"
        description="Our commitment extends from farm to cup. We ensure quality at every step of our coffee's journey."
      />

      <div className="grid md:grid-cols-2 gap-x-12">
        <div className="flex flex-col mb-8 md:mb-0 order-1 md:order-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`text-left py-4 border-b space-y-2 ${
                activeTab === tab.key ? "text-black" : "text-black opacity-50"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <h4>{tab.title}</h4>
              <p
                className={`transition-all duration-300 ${
                  activeTab === tab.key
                    ? "opacity-100"
                    : "opacity-0 h-0 overflow-hidden"
                }`}
              >
                {tab.text}
              </p>
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center order-2 md:order-1">
          <div className="relative aspect-square w-full md:h-full">
            <Image
              src={active.image}
              alt={active.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
