import { useEffect, useRef } from "react";
import Image from "next/image";
import Section from "../common/Section";
import { STORY_IMAGES } from "@/lib/images/about";

export default function StoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPos = container.scrollLeft;
    const speed = 0.5;
    let animationFrame: number;

    const step = () => {
      if (!isDragging.current) {
        scrollPos += speed;
        container.scrollLeft = scrollPos;
      }

      if (scrollPos >= container.scrollWidth / 2) {
        scrollPos = 0;
        container.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(step);
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging.current = true;
      lastX.current = event.clientX;
      scrollPos = container.scrollLeft;
      try {
        container.setPointerCapture(event.pointerId);
      } catch {}
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current || lastX.current == null) return;
      const deltaX = event.clientX - lastX.current;
      lastX.current = event.clientX;
      container.scrollLeft -= deltaX;
      scrollPos = container.scrollLeft;
    };

    const handlePointerUp = (event?: PointerEvent) => {
      isDragging.current = false;
      lastX.current = null;
      scrollPos = container.scrollLeft;
      if (event) {
        try {
          container.releasePointerCapture(event.pointerId);
        } catch {}
      }
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerUp);

    animationFrame = requestAnimationFrame(step);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerUp);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="py-12 lg:py-24">
      <Section
        className="px-4 md:px-6"
        subtitle="Roots"
        title="A journey of passion and precision in coffee"
        description="Born from a deep love of coffee and commitment to craft, our small business began in a tiny kitchen with a single mission."
      />

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto hide-scrollbar scroll-container touch-pan-x"
      >
        <div className="flex gap-4">
          {[...STORY_IMAGES, ...STORY_IMAGES].map((src, idx) => (
            <div
              key={idx}
              className="relative w-[70vw] sm:w-[40vw] lg:w-[30vw] flex-none snap-start scroll-mr-4"
            >
              <Image
                src={src}
                alt={`Coffee story image ${idx + 1}`}
                width={500}
                height={400}
                className="aspect-4/3 w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
