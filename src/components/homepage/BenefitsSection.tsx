import Image from "next/image";
import Link from "next/link";
import {
  CoffeeIcon,
  TimerIcon,
  PlantIcon,
  GearIcon,
} from "@phosphor-icons/react";
import Section from "@/components/common/Section";
import Button from "@/components/common/Button";
import { BENEFIT_IMAGE } from "@/lib/images.home";

export function BenefitsSection() {
  const benefits = [
    {
      title: "Why choose our coffee",
      text: "Premium beans, perfectly roasted, ethically sourced.",
      icon: <CoffeeIcon size={40} weight="thin" />,
    },
    {
      title: "Expert roasting",
      text: "Every batch roasted with precision and care.",
      icon: <TimerIcon size={40} weight="thin" />,
    },
    {
      title: "Sustainable practices",
      text: "Supporting farmers and protecting the environment.",
      icon: <PlantIcon size={40} weight="thin" />,
    },
    {
      title: "Crafted for you",
      text: "Coffee designed to enhance your experience.",
      icon: <GearIcon size={40} weight="thin" />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6">
      <Section
        subtitle="Benefits"
        title="Highest grade Arabica beans"
        description="Quality, sustainability, and taste in every cup."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr] items-center gap-y-8 md:gap-y-16 lg:gap-x-8">
        <div className="grid gap-y-12">
          {benefits.slice(0, 2).map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div>{b.icon}</div>
              <h3 className="text-lg font-heading font-semibold">{b.title}</h3>
              <p className="text-black/70">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="relative w-full sm:col-span-2 lg:col-span-1">
          <div className="relative h-[500px] w-full overflow-hidden">
            <Image
              src={BENEFIT_IMAGE}
              alt="Coffee beans in a cup"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>

        <div className="grid gap-y-12">
          {benefits.slice(2).map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div>{b.icon}</div>
              <h3 className="text-lg font-heading font-semibold">{b.title}</h3>
              <p className="text-black/70">{b.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button variant="secondary">
          <Link href="/collection">Learn more</Link>
        </Button>
        <Button variant="tertiary">
          <Link href="/collection">Shop</Link>
        </Button>
      </div>
    </section>
  );
}
