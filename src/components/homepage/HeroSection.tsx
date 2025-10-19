import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const imageUrl =
  "https://res.cloudinary.com/douen1dwv/image/upload/v1758990337/default/brew..jpg";

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
        <link rel="preload" as="image" href={imageUrl} />
      </Head>

      <section className="relative min-h-screen flex items-center px-8 md:px-16 lg:px-24 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <Image
            src={imageUrl}
            alt="Coffee background"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 max-w-xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-heading text-white">
            Craft coffee that tells a story in every cup
          </h1>

          <p className="font-body text-white/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare.
          </p>

          <Link
            href="/collection"
            className="inline-block font-heading text-white relative z-10 group"
          >
            Shop Now
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white pointer-events-none" />
            <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-2/3 pointer-events-none" />
          </Link>
        </div>
      </section>
    </>
  );
}
