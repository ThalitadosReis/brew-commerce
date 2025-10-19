import { useRef, useEffect } from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

const teamMembers = [
  {
    name: "Emma Rodriguez",
    title: "Founder and CEO",
    description:
      "A coffee lover who turned her passion into a mission to bring pure, exceptional coffee to everyone.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Jack Thompson",
    title: "Head Roaster",
    description:
      "A master of flavor who understands the art of transforming raw beans into perfect roasts.",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    name: "Sarah Kim",
    title: "Sustainability Director",
    description:
      "Ensuring our coffee supports farmers and protects the environment with every batch.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    title: "Head of Sourcing",
    description:
      "Traveling the world to find the most exceptional coffee beans and support local communities.",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    name: "David Martinez",
    title: "Quality Control",
    description:
      "Tasting and testing every batch to guarantee the highest standards of flavor and quality.",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Olivia Parker",
    title: "Customer Experience",
    description:
      "Passionate about connecting coffee lovers with their perfect brew and exceptional service.",
    image: "https://randomuser.me/api/portraits/women/51.jpg",
  },
];

export default function TeamSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);

  const updatePrev = () => {
    if (!carouselRef.current || !prevButtonRef.current) return;

    const isAtStart = carouselRef.current.scrollLeft <= 0;

    // update prev button
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

    return () => {
      carousel.removeEventListener("scroll", updatePrev);
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="mb-12 lg:mb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <h5 className="text-lg font-heading">Team</h5>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
            Our team
          </h2>
          <p className="text-body">
            The passionate people behind every cup of your carefully crafted
            coffee.
          </p>
        </div>
      </div>

      <div
        className="relative space-y-12"
        role="region"
        aria-label="Team members carousel"
      >
        <div
          ref={carouselRef}
          data-slot="carousel-content"
          className="flex overflow-x-hidden scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              role="group"
              aria-label={`${index + 1} of ${teamMembers.length}`}
              data-slot="carousel-item"
              className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/1 md:basis-1/3 lg:basis-1/4 pr-6"
            >
              <div className="flex flex-col space-y-4">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mb-3 md:mb-4">
                  <h5 className="text-lg font-semibold">{member.name}</h5>
                  <h6 className="text-medium">{member.title}</h6>
                </div>
                <p>{member.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* arrows */}
        <div className="flex items-end justify-end gap-2 md:gap-4 mt-6">
          <button
            ref={prevButtonRef}
            onClick={scrollPrev}
            aria-label="Previous team member"
            className="inline-flex items-center justify-center p-3 border border-black/10 text-black/70 transition-opacity"
          >
            <CaretLeftIcon size={20} weight="bold" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next team member"
            className="inline-flex items-center justify-center p-3 border border-black/10 text-black/70"
          >
            <CaretRightIcon size={20} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}
