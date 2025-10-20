import { useState } from "react";
import Image from "next/image";

export default function QualitySection() {
  const [activeTab, setActiveTab] = useState("farm");

  const tabs = [
    {
      key: "farm",
      title: "Farm origins",
      text: "Our beans come from small, family-owned farms in the Sidamo region of Ethiopia. Each farm has a unique story and tradition.",
      image:
        "https://images.pexels.com/photos/13802102/pexels-photo-13802102.jpeg",
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
      <div className="mb-12 lg:mb-24">
        <div className="mx-auto text-center space-y-4">
          <h5 className="text-lg font-heading">Quality</h5>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
            Beyond the perfect cup
          </h2>
          <p className="text-body">
            {
              "Our commitment extends from farm to cup. We ensure quality at every step of our coffee's journey."
            }
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 items-stretch">
        <div className="flex flex-col mb-8 md:mb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`text-left py-6 px-0 border-b space-y-4 ${
                activeTab === tab.key
                  ? "text-black"
                  : "text-black/70 opacity-70"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <h2 className="text-3xl font-semibold font-heading">
                {tab.title}
              </h2>
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

        <div className="flex justify-center items-center h-full">
          <div className="relative aspect-square w-full md:h-full">
            <Image
              src={tabs.find((t) => t.key === activeTab)?.image || ""}
              alt={tabs.find((t) => t.key === activeTab)?.title || ""}
              fill
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
