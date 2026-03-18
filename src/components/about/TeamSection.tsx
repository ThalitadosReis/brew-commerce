"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { TEAM_AVATARS } from "@/lib/images";

const ITEM_W = 180;
const SECTION_H = 420;

const MASK_H = "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)";

const teamMembers = [
  {
    name: "Emma Rodriguez",
    title: "Founder & CEO",
    description:
      "Emma built Brew from a single bag of Colombian beans sourced on a solo trip, and has spent every year since deepening the relationships that make the coffee worth drinking.",
    image: TEAM_AVATARS[0],
  },
  {
    name: "Jack Thompson",
    title: "Head Roaster",
    description:
      "Jack has been roasting professionally for over a decade. He approaches each origin as a puzzle — adjusting drum temperature, airflow, and timing until the beans express exactly what the farm intended.",
    image: TEAM_AVATARS[1],
  },
  {
    name: "Sarah Kim",
    title: "Sustainability Director",
    description:
      "Sarah oversees every decision that touches the land — from packaging materials to logistics partners. Her goal is simple: leave every part of the supply chain better than we found it.",
    image: TEAM_AVATARS[2],
  },
  {
    name: "Michael Chen",
    title: "Head of Sourcing",
    description:
      "Michael spends several months a year on origin, cupping alongside farmers and cooperative leaders. He looks for farms that produce interesting coffee and treat their workers well.",
    image: TEAM_AVATARS[3],
  },
  {
    name: "David Martinez",
    title: "Quality Control",
    description:
      "Every batch that leaves our roastery has been signed off by David. He runs daily cuppings, tracks roast profiles, and is the last line of defence between our standards and your cup.",
    image: TEAM_AVATARS[4],
  },
  {
    name: "Olivia Parker",
    title: "Customer Experience",
    description:
      "Olivia leads the team that talks to our customers every day. She turns feedback into real product decisions and is the reason our subscription flow is actually simple to use.",
    image: TEAM_AVATARS[5],
  },
];

export default function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mobileStripRef.current;
    if (!el) return;
    const btn = el.children[activeIndex] as HTMLElement;
    if (!btn) return;
    el.scrollTo({
      left: btn.offsetLeft - el.clientWidth / 2 + btn.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const n = teamMembers.length;
  const itemH = SECTION_H / 2;
  const half = itemH / 2;
  const listH = n * itemH;
  const rawTranslate = SECTION_H / 2 - half - (n - 1 - activeIndex) * itemH;
  const desktopTranslate = Math.max(-(listH - SECTION_H), Math.min(0, rawTranslate));
  const maskV = `linear-gradient(to bottom, transparent 0px, black ${half}px, black calc(100% - ${half}px), transparent 100%)`;

  return (
    <section className="flex flex-col lg:grid lg:grid-cols-[3.5rem_1fr_50%] lg:h-[420px]">
      {/* mobile strip */}
      <div
        ref={mobileStripRef}
        className="lg:hidden flex overflow-x-scroll border-b border-neutral-200 bg-neutral-50"
        style={{ scrollbarWidth: "none", WebkitMaskImage: MASK_H, maskImage: MASK_H }}
      >
        {teamMembers.map((member, i) => (
          <button
            key={member.name}
            onClick={() => setActiveIndex(i)}
            style={{ minWidth: ITEM_W, flexShrink: 0 }}
            className={`py-3 px-4 text-sm whitespace-nowrap border-b-2 transition-colors duration-300 ${
              i === activeIndex
                ? "text-black font-semibold border-black"
                : "text-neutral-400 border-transparent hover:text-neutral-700"
            }`}
          >
            {member.name}
          </button>
        ))}
      </div>

      {/* desktop strip */}
      <div
        className="hidden lg:block relative border-r border-neutral-200 bg-neutral-50 overflow-hidden"
        style={{ WebkitMaskImage: maskV, maskImage: maskV }}
      >
        <div
          className="absolute left-0 right-0 flex flex-col-reverse"
          style={{
            transform: `translateY(${desktopTranslate}px)`,
            transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {teamMembers.map((member, i) => (
            <button
              key={member.name}
              onClick={() => setActiveIndex(i)}
              style={{ height: itemH }}
              className={`flex items-center justify-center border-r-2 transition-colors duration-300 ${
                i === activeIndex
                  ? "text-black font-semibold border-black"
                  : "text-neutral-400 border-transparent hover:text-neutral-700"
              }`}
            >
              <span
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                className="text-sm whitespace-nowrap"
              >
                {member.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* info */}
      <div className="bg-neutral-100 relative overflow-hidden min-h-[360px] lg:min-h-0">
        {teamMembers.map((member, i) => (
          <div
            key={member.name}
            className={`absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16 text-center transition-all duration-500 ease-out ${
              i === activeIndex
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5 pointer-events-none"
            }`}
          >
            <p className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-6">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-500" />
              our team.
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-semibold tracking-[-0.03em] text-black leading-tight mb-5 lowercase">
              {member.name}
            </h2>
            <p className="text-sm leading-7 text-neutral-600 max-w-md mx-auto">
              {member.description}
            </p>
            <p className="text-[11px] tracking-[0.25em] uppercase text-amber-700 mt-6">
              {member.title}
            </p>
          </div>
        ))}
      </div>

      {/* image */}
      <div className="relative overflow-hidden aspect-square lg:aspect-auto lg:h-full">
        {teamMembers.map((member, i) => (
          <div
            key={member.name}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
}
