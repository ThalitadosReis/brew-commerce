import Image from "next/image";

import { ABOUT_IMAGES } from "@/lib/images/about";

export default function AboutSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 ">
      <div className="relative">
        <Image
          src={ABOUT_IMAGES[1]}
          alt="Our story"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="bg-neutral-900 flex flex-col justify-center px-8 py-16 md:px-14 lg:px-16 lg:py-24">
        <p className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-400" />
          our story.
        </p>

        <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-white leading-[1.1] tracking-[-0.03em] mb-8">
          brew & the people
          <br className="hidden md:block" /> behind the cup
        </h2>

        <div className="space-y-4 text-neutral-400 text-sm leading-7 max-w-lg">
          <p>
            It started with a single question: why is it so hard to find coffee
            that is both exceptional and honestly made? We spent years tasting
            our way through crowded shelves and complicated menus before
            deciding to do something about it.
          </p>
          <p>
            Brew was built on the belief that great coffee should be simple to
            understand and beautiful to drink. We work directly with small farms
            across Ethiopia, Colombia, and Brazil — choosing growers who share
            our respect for the land and the people who tend it.
          </p>
          <p>
            Every bag we ship is roasted to order, labelled with exactly where
            it came from and why we chose it. No jargon, no guesswork — just
            coffee you can feel good about, cup after cup.
          </p>
        </div>
      </div>
    </section>
  );
}
