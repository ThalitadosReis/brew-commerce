"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

const image =
  "https://images.pexels.com/photos/4816479/pexels-photo-4816479.jpeg";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <Image
            src={image}
            alt="Craft coffee roasting machine background"
            fill
            sizes="100vw"
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center max-w-3xl space-y-6 px-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-white">
            Craft coffee that tells a story in every cup
          </h1>
          <p className="text-white/70 font-body text-lg md:text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare.
          </p>
        </div>
      </section>
    </>
  );
}
