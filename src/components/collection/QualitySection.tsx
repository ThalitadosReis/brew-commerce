import { useState } from "react";
import Image from "next/image";
import Section from "../common/Section";

export default function QualitySection() {
  const [activeTab, setActiveTab] = useState("farm");

  const tabs = [
    {
      key: "farm",
      title: "Farm origins",
      text: "Our beans come from small, family-owned farms in the Sidamo region of Ethiopia. Each farm has a unique story and tradition.",
      image:
        "https://images.pexels.com/photos/30658829/pexels-photo-30658829.jpeg",
    },
    {
      key: "certifications",
      title: "Certifications",
      text: "We hold organic and fair trade certifications. Our commitment to ethical sourcing is unwavering.",
      image:
        "https://images.pexels.com/photos/22679447/pexels-photo-22679447.jpeg",
    },
    {
      key: "sustainability",
      title: "Sustainability",
      text: "We invest in local communities and environmental conservation. Our practices support both farmers and the ecosystem.",
      image:
        "https://images.pexels.com/photos/30658791/pexels-photo-30658791.jpeg",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6">
      <Section
        subtitle="Quality"
        title="Beyond the perfect cup"
        description="Our commitment extends from farm to cup. We ensure quality at every step of our coffee's journey."
      />

      <div className="grid md:grid-cols-2 gap-x-12">
        <div className="flex flex-col mb-8 md:mb-0 order-1 md:order-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`text-left font-body py-4 border-b space-y-2 ${
                activeTab === tab.key ? "text-black" : "text-black opacity-50"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <h2 className="text-2xl md:text-3xl font-heading">{tab.title}</h2>
              <p
                className={`font-body transition-all duration-300 ${
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
              src={tabs.find((t) => t.key === activeTab)?.image || ""}
              alt={
                tabs.find((t) => t.key === activeTab)?.title ||
                "Quality section image"
              }
              title={tabs.find((t) => t.key === activeTab)?.title || "Quality"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
