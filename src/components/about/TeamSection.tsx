import { useRef, useEffect } from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Section from "../common/Section";
import { TEAM_AVATARS } from "@/lib/images/about";

export default function TeamSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);

  const teamMembers = [
    {
      name: "Emma Rodriguez",
      title: "Founder and CEO",
      description:
        "A coffee lover who turned her passion into a mission to bring pure, exceptional coffee to everyone.",
      image: TEAM_AVATARS[0],
    },
    {
      name: "Jack Thompson",
      title: "Head Roaster",
      description:
        "A master of flavor who understands the art of transforming raw beans into perfect roasts.",
      image: TEAM_AVATARS[1],
    },
    {
      name: "Sarah Kim",
      title: "Sustainability Director",
      description:
        "Ensuring our coffee supports farmers and protects the environment with every batch.",
      image: TEAM_AVATARS[2],
    },
    {
      name: "Michael Chen",
      title: "Head of Sourcing",
      description:
        "Traveling the world to find the most exceptional coffee beans and support local communities.",
      image: TEAM_AVATARS[3],
    },
    {
      name: "David Martinez",
      title: "Quality Control",
      description:
        "Tasting and testing every batch to guarantee the highest standards of flavor and quality.",
      image: TEAM_AVATARS[4],
    },
    {
      name: "Olivia Parker",
      title: "Customer Experience",
      description:
        "Passionate about connecting coffee lovers with their perfect brew and exceptional service.",
      image: TEAM_AVATARS[5],
    },
  ];

  const updatePrev = () => {
    if (!carouselRef.current || !prevButtonRef.current) return;
    const isAtStart = carouselRef.current.scrollLeft <= 0;
    prevButtonRef.current.disabled = isAtStart;
    prevButtonRef.current.classList.toggle("opacity-40", isAtStart);
    prevButtonRef.current.classList.toggle("cursor-not-allowed", isAtStart);
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.querySelector(
      '[data-slot="carousel-item"]'
    ) as HTMLElement;
    if (!card) return;

    const cardWidth =
      card.clientWidth + parseInt(getComputedStyle(card).marginRight || "0");

    if (
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 1
    ) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: cardWidth, behavior: "smooth" });
    }

    setTimeout(updatePrev, 300);
  };

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.querySelector(
      '[data-slot="carousel-item"]'
    ) as HTMLElement;
    if (!card) return;

    const cardWidth =
      card.clientWidth + parseInt(getComputedStyle(card).marginRight || "0");

    if (container.scrollLeft > 0) {
      container.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }

    setTimeout(updatePrev, 300);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    updatePrev();
    carousel.addEventListener("scroll", updatePrev);
    return () => carousel.removeEventListener("scroll", updatePrev);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <Section
        className="ml-0 text-left"
        subtitle="Team"
        title="Our team"
        description="The passionate people behind every cup of your carefully crafted coffee."
      />

      <div
        className="relative space-y-12"
        role="region"
        aria-label="Team members carousel"
      >
        <div
          ref={carouselRef}
          data-slot="carousel-content"
          className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              role="group"
              aria-label={`${index + 1} of ${teamMembers.length}`}
              data-slot="carousel-item"
              className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/1 md:basis-1/3 lg:basis-1/4 mr-4 last:mr-0 snap-start"
            >
              <div className="flex flex-col space-y-4">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="mb-3 md:mb-4">
                  <h6 className="text-lg md:text-xl font-semibold">
                    {member.name}
                  </h6>
                  <p className="text-sm text-black/50">{member.title}</p>
                </div>
                <p className="text-xs md:text-sm text-black">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-end gap-2 md:gap-4 mt-6">
          <button
            ref={prevButtonRef}
            onClick={scrollPrev}
            aria-label="Previous team member"
            className="inline-flex items-center justify-center p-4 border border-black/10 text-black/75 transition-opacity"
          >
            <CaretLeftIcon size={20} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next team member"
            className="inline-flex items-center justify-center p-4 border border-black/10 text-black/75"
          >
            <CaretRightIcon size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
