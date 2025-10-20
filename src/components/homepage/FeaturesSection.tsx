import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";

export default function FeaturesSection() {
  const images = [
    "https://images.pexels.com/photos/7125492/pexels-photo-7125492.jpeg",
    "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg",
    "https://images.pexels.com/photos/7175997/pexels-photo-7175997.jpeg",
  ];

  return (
    <>
      <Head>
        {images.map((url) => (
          <link key={url} rel="preload" as="image" href={url} />
        ))}
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12 lg:mb-24">
          <div className="mx-auto text-center space-y-4">
            <h5 className="mb-1 text-lg font-heading">Our craft</h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
              Exceptional coffee experiences
            </h2>
            <p className="font-body">
              Carefully sourced beans from sustainable farms worldwide
            </p>
          </div>
        </div>

        {/* content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            {/* card 1 */}
            <div className="flex flex-col md:flex-row border border-black/10 overflow-hidden">
              <div className="flex flex-col justify-center flex-1">
                <div className="p-6 space-y-4">
                  <p className="mb-1 font-heading">Origin</p>
                  <h3 className="text-lg font-semibold">
                    Single origin beans with unique flavor profiles
                  </h3>
                  <p className="text-black/70">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros elementum tristique.
                  </p>
                  <Link
                    href="/collection"
                    className="inline-flex items-center justify-center gap-2 group"
                  >
                    Shop collection
                    <CaretRightIcon
                      size={12}
                      weight="light"
                      className="transform transition-transform duration-200 ease-in-out group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-1/2">
                <Image
                  src={images[0]}
                  alt="Image 1"
                  width={400}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </div>

            {/* card 2 */}
            <div className="flex flex-col md:flex-row border border-black/20 overflow-hidden">
              <div className="flex flex-col justify-center flex-1">
                <div className="p-6 space-y-4">
                  <p className="mb-1 font-heading">Craft</p>
                  <h3 className="font-semibold">
                    Learn about our meticulous roasting process
                  </h3>
                  <p className="text-black/70">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros elementum tristique.
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 group"
                  >
                    Learn more
                    <CaretRightIcon
                      size={12}
                      weight="light"
                      className="transform transition-transform duration-200 ease-in-out group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-1/2">
                <Image
                  src={images[1]}
                  alt="Image 2"
                  width={400}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </div>
          </div>

          {/* card 3 */}
          <div className="flex flex-col border border-black/20 overflow-hidden">
            <div className="flex flex-col justify-center flex-1">
              <div className="p-6 space-y-4">
                <p className="font-heading mb-1">brew.</p>
                <h3 className="text-lg font-semibold mb-4">
                  Reach out to us for brewing guidance
                </h3>
                <p className="text-black/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros elementum tristique. Duis
                  cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
                  commodo diam libero vitae erat.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 group"
                >
                  Contact us
                  <CaretRightIcon
                    size={12}
                    weight="light"
                    className="transform transition-transform duration-200 ease-in-out group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            <div className="relative w-full h-[50%] min-h-[300px]">
              <Image
                src={images[2]}
                alt="Image 3"
                fill
                className="object-cover object-[25%_42%]"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
