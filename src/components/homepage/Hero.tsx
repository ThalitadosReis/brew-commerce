import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowDownIcon } from "@phosphor-icons/react";
import { HERO_IMAGE } from "@/lib/images";
import Button from "../common/Button";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 pb-24 md:items-end md:justify-start md:px-6 md:pb-32">
        <div className="mb-6 max-w-3xl space-y-4 text-center text-white md:mb-10 md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-[-0.03em]">
            Craft coffee that tells a story in every cup
          </h1>
          <p className="text-sm md:text-base lg:text-lg font-light">
            Discover exceptional coffee sourced sustainably from around the
            world.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 md:justify-start">
            <Button as="link" href="/collection" variant="primary">
              Shop collection
            </Button>
            <Button as="link" href="/about" variant="outline">
              About us
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <ArrowDownIcon size={14} weight="regular" />
        </motion.div>
      </motion.div>
    </section>
  );
}
