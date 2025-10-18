import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  CoffeeIcon,
  TimerIcon,
  CaretRightIcon,
  PlantIcon,
  GearIcon,
} from "@phosphor-icons/react";

export default function BenefitsSection() {
  const imageSrc =
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
        <link rel="preload" as="image" href={imageSrc} />
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        {/* header */}
        <div className="mb-12 lg:mb-24">
          <div className="mx-auto text-center space-y-4">
            <h5 className="mb-1 text-lg font-heading">Benefits</h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
              Highest grade arabica beans
            </h2>
            <p className="font-body text-black/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>
        </div>

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
                src={imageSrc}
                alt="Coffee beans in a cup, illustrating benefits section"
                fill
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

        {/* links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/collection"
            className="inline-flex items-center justify-center bg-black/5 hover:bg-black/10 font-medium px-6 py-3"
          >
            Learn more
          </Link>

          <Link
            href="/collection"
            className="inline-flex items-center justify-center font-medium gap-2 group"
          >
            Shop
            <CaretRightIcon
              size={16}
              weight="bold"
              className="transform transition-transform duration-200 ease-in-out group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
