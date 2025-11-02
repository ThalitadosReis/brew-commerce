import { useEffect, useState } from "react";
import Image from "next/image";
import { HERO_IMAGE } from "@/lib/images/home";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Coffee beans background"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-3xl text-center px-8 text-white">
        <h1 className="leading-tight">
          Craft coffee that tells a story in every cup
        </h1>
        <p>
          Discover exceptional coffee sourced sustainably from around the world.
        </p>
      </div>
    </section>
  );
}
