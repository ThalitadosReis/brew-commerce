import { useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import SectionHeader from "../common/SectionHeader";

export default function StorySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = [
    "https://images.pexels.com/photos/13819623/pexels-photo-13819623.jpeg",
    "https://images.pexels.com/photos/7125537/pexels-photo-7125537.jpeg",
    "https://images.pexels.com/photos/7125433/pexels-photo-7125433.jpeg",
    "https://images.pexels.com/photos/7125565/pexels-photo-7125565.jpeg",
    "https://images.pexels.com/photos/7125756/pexels-photo-7125756.jpeg",
    "https://images.pexels.com/photos/6439132/pexels-photo-6439132.jpeg",
  ];

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
    <>
      <Head>
        {images.map((src, idx) => (
          <link key={idx} rel="preload" as="image" href={src} />
        ))}
      </Head>

      <section className="max-w-7xl mx-auto">
        <SectionHeader
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
            {[...images, ...images].map((src, idx) => (
              <div
                key={idx}
                className="relative w-[70vw] sm:w-[40vw] lg:w-[30vw] flex-none"
              >
                <Image
                  src={src}
                  alt={`Coffee ${idx + 1}`}
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
    </>
  );
}
