import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Section from "../common/Section";
import { TEAM_AVATARS } from "@/lib/images/about";
import Button from "../common/Button";

export default function TeamSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);

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

  const updatePrev = useCallback(() => {
    if (!carouselRef.current) return;
    const atStart = carouselRef.current.scrollLeft <= 0;
    setIsAtStart(atStart);

    if (!prevButtonRef.current) return;
    prevButtonRef.current.disabled = atStart;
    prevButtonRef.current.classList.toggle("opacity-40", atStart);
    prevButtonRef.current.classList.toggle("cursor-not-allowed", atStart);
  }, []);

  const scrollNext = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.querySelector(
      '[data-slot="carousel-item"]'
    ) as HTMLElement;
    if (!card) return;

    const styles = getComputedStyle(container);
    const gap = parseInt(styles.columnGap || "0");
    const cardWidth = card.clientWidth + gap;

    if (
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 1
    ) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: cardWidth, behavior: "smooth" });
    }

    setTimeout(updatePrev, 300);
  }, [updatePrev]);

  const scrollPrev = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.querySelector(
      '[data-slot="carousel-item"]'
    ) as HTMLElement;
    if (!card) return;

    const styles = getComputedStyle(container);
    const gap = parseInt(styles.columnGap || "0");
    const cardWidth = card.clientWidth + gap;

    if (container.scrollLeft > 0) {
      container.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }

    setTimeout(updatePrev, 300);
  }, [updatePrev]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    updatePrev();
    carousel.addEventListener("scroll", updatePrev);
    const handleTouchStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartX.current == null) return;
      const deltaX = event.changedTouches[0]?.clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(deltaX) < 40) return;
      if (deltaX > 0) scrollPrev();
      else scrollNext();
    };

    carousel.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    carousel.addEventListener("touchend", handleTouchEnd);

    return () => {
      carousel.removeEventListener("scroll", updatePrev);
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollNext, scrollPrev, updatePrev]);

  return (
    <section className="bg-white/90">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-24">
        <Section
          className="ml-0 text-left"
          subtitle="Team"
          title="Our team"
          description="The passionate people behind every cup of your carefully crafted coffee."
        />

        <div
          className="relative"
          role="region"
          aria-label="Team members carousel"
        >
          <div
            ref={carouselRef}
            data-slot="carousel-content"
            className="grid grid-flow-col gap-4 overflow-x-hidden snap-x snap-mandatory scroll-smooth auto-cols-[minmax(100%,1fr)] sm:auto-cols-[min(100%,1fr)] md:auto-cols-[calc((100%-2rem)/3)] lg:lg:auto-cols-[calc((100%-3rem)/4)]"
          >
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                role="group"
                aria-label={`${index + 1} of ${teamMembers.length}`}
                data-slot="carousel-item"
                className="snap-start w-full"
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
                  <div>
                    <h6 className="text-lg md:text-xl font-semibold">
                      {member.name}
                    </h6>
                    <p className="text-sm text-black/50">{member.title}</p>
                  </div>
                  <p className="text-xs md:text-sm text-black/75">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 lg:gap-4">
            <Button
              onClick={scrollPrev}
              aria-label="Previous team member"
              variant="secondary"
              className="p-4!"
              disabled={isAtStart}
            >
              <CaretLeftIcon size={20} weight="bold" />
            </Button>
            <Button
              onClick={scrollNext}
              aria-label="Next team member"
              variant="secondary"
              className="p-4!"
            >
              <CaretRightIcon size={20} weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
