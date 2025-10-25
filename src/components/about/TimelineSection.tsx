import React from "react";
import Section from "../common/Section";

type TimelineCardType = {
  date: string;
  heading: string;
  text: string;
};

const timelineCards: TimelineCardType[] = [
  {
    date: "2017",
    heading: "Idea Was Brewed",
    text: "The concept of bringing ethically sourced specialty coffee to homes around the world started in a small hometown café.",
  },
  {
    date: "2018",
    heading: "First Beans from Colombia",
    text: "We began sourcing Arabica beans directly from small family farms in Colombia, ensuring fair prices and traceability.",
  },
  {
    date: "2019",
    heading: "Ethiopian & Brazilian Partnerships",
    text: "Expanded partnerships to include cooperatives in Yirgacheffe, Ethiopia and Minas Gerais, Brazil to offer unique flavor profiles.",
  },
  {
    date: "2020",
    heading: "Online Store Launch",
    text: "Our e-commerce platform went live, allowing customers to order freshly roasted beans with global shipping options.",
  },
  {
    date: "2021",
    heading: "European Distribution Center",
    text: "Opened our first European roasting and distribution hub in Amsterdam to speed up deliveries across EU countries.",
  },
  {
    date: "2022",
    heading: "Sourcing from Vietnam & Kenya",
    text: "Added Vietnamese Robusta and Kenyan AA beans, expanding our range for espresso lovers and filter drinkers alike.",
  },
  {
    date: "2023",
    heading: "Sustainable Packaging & Carbon Neutral Shipping",
    text: "Introduced biodegradable coffee bags and partnered with logistics companies offering carbon-neutral international delivery.",
  },
  {
    date: "Today",
    heading: "A Global Coffee Community",
    text: "We now source beans from over 7 countries, roast fresh every week, and ship coffee to customers in more than 15 countries. Our focus remains on sustainability, fair trade farming relationships, and inspiring people to brew better coffee at home.",
  },
];

function TimelineCard({ card }: { card: TimelineCardType }) {
  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="p-6 md:p-8 space-y-2">
        <span className="inline-block text-xs md:text-sm tracking-wider">
          {card.date}
        </span>
        <h4 className="text-xl md:text-2xl font-heading font-semibold">
          {card.heading}
        </h4>
        <p className="text-sm md:text-base font-body font-light">{card.text}</p>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <Section
        subtitle="Our Coffee Journey"
        title="From Local Passion to Global Coffee Culture"
        description="Discover how we built meaningful relationships with coffee farmers across continents and delivered their craft to mugs worldwide."
      />

      <div className="relative">
        <div className="pointer-events-none absolute top-0 bottom-0 left-4 lg:left-1/2 lg:-translate-x-1/2 w-px bg-black/10" />

        <div className="space-y-8 relative z-10">
          {timelineCards.map((card, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={index} className="relative">
                {/* mobile layout */}
                <div className="lg:hidden flex">
                  <div className="w-8 flex justify-center relative z-30">
                    <span className="mt-8 w-3 h-3 rounded-full bg-black ring-4 ring-[#F3F3F3]" />
                  </div>
                  <div className="flex-1 ml-4">
                    <TimelineCard card={card} />
                  </div>
                </div>

                {/* desktop layout */}
                <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-start w-full">
                  <div className="flex">
                    {isLeft && (
                      <div className="mr-8 w-full">
                        <TimelineCard card={card} />
                      </div>
                    )}
                  </div>

                  <div className="mt-8 w-3 h-3 rounded-full bg-black ring-8 ring-[#F3F3F3]" />

                  <div className="flex">
                    {!isLeft && (
                      <div className="ml-8 w-full">
                        <TimelineCard card={card} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
