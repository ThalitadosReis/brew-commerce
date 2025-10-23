import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";

export default function ContactSection() {
  const image =
    "https://images.pexels.com/photos/4820847/pexels-photo-4820847.jpeg";

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid auto-cols-fr grid-cols-1 overflow-hidden md:grid-cols-2 bg-black/5">
          <div className="flex flex-col justify-center p-8 space-y-8">
            <div className="max-w-lg space-y-4">
              <h2 className="text-4xl lg:text-5xl font-heading">
                Start your coffee journey today
              </h2>
              <p className="font-body text-black/70">
                Join our community and discover exceptional coffee delivered
                straight to your door.
              </p>
            </div>

            {/* links */}
            <div className="flex gap-4">
              <Button variant="primary">
                <Link href="/contact">Contact us</Link>
              </Button>
              <Button variant="secondary">
                <Link href="/collection">Browse</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <Image
              src={image}
              alt="Packing coffee beans"
              width={800}
              height={600}
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
