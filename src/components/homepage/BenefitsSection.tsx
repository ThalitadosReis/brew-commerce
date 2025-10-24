import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  CoffeeIcon,
  TimerIcon,
  PlantIcon,
  GearIcon,
} from "@phosphor-icons/react";
import Button from "../common/Button";
import Section from "../common/Section";

export default function BenefitsSection() {
  const image =
    "https://images.pexels.com/photos/10433516/pexels-photo-10433516.jpeg";

  const benefits = [
    {
      title: "Why choose our coffee",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      icon: <CoffeeIcon size={40} weight="thin" />,
    },
    {
      title: "Expert roasting",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      icon: <TimerIcon size={40} weight="thin" />,
    },
    {
      title: "Sustainable practices",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      icon: <PlantIcon size={40} weight="thin" />,
    },
    {
      title: "Crafted for your experience",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      icon: <GearIcon size={40} weight="thin" />,
    },
  ];

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <Section
          subtitle="Benefits"
          title="Highest grade arabica beans"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        />

        {/* content grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr] items-center gap-y-8 md:gap-y-16 lg:gap-x-8">
          {/* left */}
          <div className="grid gap-y-12">
            {benefits.slice(0, 2).map((benefit, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="mb-1">{benefit.icon}</div>
                <h3 className="text-lg font-heading font-semibold">
                  {benefit.title}
                </h3>
                <p className="text-black/70">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* image */}
          <div className="relative order-last w-full sm:col-span-2 lg:order-none lg:col-span-1">
            <div className="relative h-[500px] w-full overflow-hidden">
              <Image
                src={image}
                alt="Coffee beans in a cup, illustrating benefits section"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>

          {/* right */}
          <div className="grid gap-y-12">
            {benefits.slice(2).map((benefit, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="mb-1">{benefit.icon}</div>
                <h3 className="text-lg font-heading font-semibold">
                  {benefit.title}
                </h3>

                <p className="text-black/70">{benefit.text}</p>
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
    </>
  );
}
