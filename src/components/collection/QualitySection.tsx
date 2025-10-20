"use client";

import { useState } from "react";
import Image from "next/image";

export default function QualitySection() {
  const [activeTab, setActiveTab] = useState("farm");

  const tabs = [
    {
      key: "farm",
      title: "Farm origins",
      text: "Our beans come from small, family-owned farms in the Sidamo region of Ethiopia. Each farm has a unique story and tradition.",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    },
    {
      key: "certifications",
      title: "Certifications",
      text: "We hold organic and fair trade certifications. Our commitment to ethical sourcing is unwavering.",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    },
    {
      key: "sustainability",
      title: "Sustainability",
      text: "We invest in local communities and environmental conservation. Our practices support both farmers and the ecosystem.",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    },
  ];

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto mb-12 md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold text-black/70 md:mb-4">quality</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-black md:mb-6">
            Beyond the perfect cup
          </h1>
          <p className="text-black/70 text-base md:text-lg">
            Our commitment extends from farm to cup. We ensure quality at every
            step of our coffee&apos;s journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 items-start">
          {/* Tabs */}
          <div className="flex flex-col mb-8 md:mb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`text-left py-6 px-0 border-b ${
                  activeTab === tab.key ? "text-black font-bold" : "text-black/70 opacity-70"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <h2 className="text-xl font-bold mb-3">{tab.title}</h2>
                <p className={`transition-all duration-300 ${activeTab === tab.key ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                  {tab.text}
                </p>
              </button>
            ))}
          </div>

          {/* Image */}
          <div className="flex justify-center items-center">
            <div className="w-full aspect-square relative">
              <Image
                src={tabs.find((t) => t.key === activeTab)?.image || ""}
                alt={tabs.find((t) => t.key === activeTab)?.title || ""}
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
