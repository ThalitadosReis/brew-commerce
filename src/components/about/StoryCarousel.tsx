import { useEffect, useRef } from "react";
import Image from "next/image";
import Section from "../common/Section";
import { STORY_IMAGES } from "@/lib/images/about";

export default function StoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const speed = 0.5;
    let rafId: number;

    const loop = () => {
      if (!isDragging.current) {
        container.scrollLeft += speed;
        const maxScroll = container.scrollWidth / 2;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging.current = true;
      startX.current = event.clientX;
      startScroll.current = container.scrollLeft;
      container.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current) return;
      const delta = event.clientX - startX.current;
      container.scrollLeft = startScroll.current - delta;
    };

    const handlePointerUp = (event?: PointerEvent) => {
      isDragging.current = false;
      if (event) container.releasePointerCapture?.(event.pointerId);
    };

    const previousTouchAction = container.style.touchAction;
    container.style.touchAction = "pan-y";

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerUp);

    rafId = requestAnimationFrame(loop);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerUp);
      container.style.touchAction = previousTouchAction;
      cancelAnimationFrame(rafId);
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
