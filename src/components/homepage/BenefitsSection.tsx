import Image from "next/image";
import {
  CoffeeIcon,
  TimerIcon,
  PlantIcon,
  GearIcon,
} from "@phosphor-icons/react";
import Section from "@/components/common/Section";
import Button from "@/components/common/Button";
import { BENEFIT_IMAGE } from "@/lib/images/home";

export function BenefitsSection() {
  const benefits = [
    {
      title: "Why choose our coffee",
      text: "Premium beans, perfectly roasted, ethically sourced.",
      icon: <CoffeeIcon size={32} />,
    },
    {
      title: "Expert roasting",
      text: "Every batch roasted with precision and care.",
      icon: <TimerIcon size={32} />,
    },
    {
      title: "Sustainable practices",
      text: "Supporting farmers and protecting the environment.",
      icon: <PlantIcon size={32} />,
    },
    {
      title: "Crafted for you",
      text: "Coffee designed to enhance your experience.",
      icon: <GearIcon size={32} />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8">
      <Section
        subtitle="Benefits"
        title="Highest grade Arabica beans"
        description="Quality, sustainability, and taste in every cup."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr] items-center gap-y-8 md:gap-y-16 lg:gap-x-8 mb-12">
        <div className="order-1 lg:order-1 grid gap-y-8">
          {benefits.slice(0, 2).map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div>{b.icon}</div>
              <h5>{b.title}</h5>
              <p className="font-light">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="order-3 lg:order-2 relative w-full sm:col-span-2 lg:col-span-1">
          <div className="relative h-[350px] lg:h-[500px] w-full overflow-hidden">
            <Image
              src={BENEFIT_IMAGE}
              alt="Coffee beans in a cup"
              fill
              sizes="(max-width: 1024px) 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <div className="order-2 lg:order-3 grid gap-y-8">
          {benefits.slice(2).map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div>{b.icon}</div>
              <h5>{b.title}</h5>
              <p className="font-light">{b.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="secondary" as="link" href="/collection">
          Learn more
        </Button>
        <Button variant="tertiary" as="link" href="/collection">
          Shop
        </Button>
      </div>
    </section>
  );
}
