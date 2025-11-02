import Image from "next/image";
import Section from "@/components/common/Section";
import { MOMENTS_IMAGES } from "@/lib/images/products";

export default function CoffeeMoments() {
  return (
    <section className="max-w-7xl mx-auto px-8">
      <Section
        title="Coffee moments"
        description="Explore the beauty and craft behind our coffee."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOMENTS_IMAGES.slice(0, 8).map((src, index) => (
          <div
            key={index}
            className={`
              relative block w-full aspect-square overflow-hidden
              ${index >= 4 ? "hidden md:block" : ""}
              ${index >= 6 ? "md:hidden lg:block" : ""} 
            `}
          >
            <Image
              src={src}
              alt={`Coffee moment ${index + 1}`}
              width={500}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
      </div>
    </section>
  );
}
