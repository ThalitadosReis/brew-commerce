import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";

export default function ContactSection() {
  const image =
    "https://images.pexels.com/photos/4820846/pexels-photo-4820846.jpeg";

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid auto-cols-fr grid-cols-1 overflow-hidden md:grid-cols-2 bg-white">
          <div className="flex flex-col justify-center p-8 space-y-8">
            <div className="max-w-lg space-y-4">
              <h2 className="text-4xl lg:text-5xl font-heading">
                Brew your perfect moment
              </h2>
              <p className="font-body text-black/70">
                Discover a world of flavor with fresh coffee delivered directly
                to your doorstep.
              </p>
            </div>

            {/* links */}
            <div className="flex gap-4">
              <Button variant="primary">
                <Link href="/contact">Contact us</Link>
              </Button>
              <Button variant="secondary">
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-square">
            <Image
              src={image}
              alt="Packing coffee beans"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      </section>
    </>
  );
}
