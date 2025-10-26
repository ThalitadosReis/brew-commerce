import { useState, useEffect } from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Button from "@/components/common/Button";
import { TESTIMONIALS_AVATARS } from "@/lib/images.home";

const testimonials = [
  {
    name: "Samantha Lee",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: TESTIMONIALS_AVATARS[0],
    role: "Coffee lover, California",
  },
  {
    name: "Jordan Smith",
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: TESTIMONIALS_AVATARS[1],
    role: "Barista, London",
  },
  {
    name: "Emily Carter",
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: TESTIMONIALS_AVATARS[2],
    role: "Coffee enthusiast, Berlin",
  },
  {
    name: "Liam Thompson",
    quote:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: TESTIMONIALS_AVATARS[3],
    role: "Roaster, Toronto",
  },
  {
    name: "Olivia Martinez",
    quote:
      "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Proin eget tortor risus.",
    image: TESTIMONIALS_AVATARS[4],
    role: "Coffee Blogger, Madrid",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const nextSlide = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setActive((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div
        className="relative overflow-hidden group"
        role="region"
        aria-roledescription="carousel"
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              className="shrink-0 basis-full mb-8"
            >
              <div className="max-w-xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
                <blockquote className="text-lg lg:text-xl font-light">
                  “{t.quote}”
                </blockquote>

                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    <Image
                      src={t.image}
                      alt={`${t.name} avatar`}
                      width={40}
                      height={40}
                      className="w-full rounded-full object-cover"
                    />
                  </div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-black/70">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="hidden md:flex !p-3 !absolute left-0 top-1/2 -translate-y-1/2 items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onClick={prevSlide}
          aria-label="Previous slide"
          variant="secondary"
        >
          <CaretLeftIcon size={24} weight="light" />
        </Button>
        <Button
          className="hidden md:flex !p-3 !absolute right-0 top-1/2 -translate-y-1/2 items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onClick={nextSlide}
          aria-label="Next slide"
          variant="secondary"
        >
          <CaretRightIcon size={24} weight="light" />
        </Button>

        {/* dots nav */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                i === active ? "bg-black" : "bg-black/20 hover:bg-black/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { TestimonialsSection };
