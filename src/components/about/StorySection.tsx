import { useEffect, useRef } from "react";
import Image from "next/image";
import Section from "../common/Section";
import { STORY_IMAGES } from "@/lib/images.about";

export default function StorySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      scrollPos += speed;
      container.scrollLeft = scrollPos;

      if (scrollPos >= container.scrollWidth / 2) {
        scrollPos = 0;
        container.scrollLeft = 0;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  return (
    <section className="max-w-7xl mx-auto">
      <Section
        className="px-6"
        subtitle="Roots"
        title="A journey of passion and precision in coffee"
        description="Born from a deep love of coffee and commitment to craft, our small business began in a tiny kitchen with a single mission."
      />

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto hide-scrollbar scroll-container"
      >
        <div className="flex gap-4">
          {[...STORY_IMAGES, ...STORY_IMAGES].map((src, idx) => (
            <div
              key={idx}
              className="relative w-[70vw] sm:w-[40vw] lg:w-[30vw] flex-none"
            >
              <Image
                src={src}
                alt={`Coffee story image ${idx + 1}`}
                width={500}
                height={400}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
