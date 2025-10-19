import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const imageUrl =
  "https://images.pexels.com/photos/4820847/pexels-photo-4820847.jpeg";

export default function SubscribeSection() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" href={imageUrl} />
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid auto-cols-fr grid-cols-1 overflow-hidden md:grid-cols-2 bg-black/5">
          <div className="flex flex-col justify-center p-8">
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
            <div className="mt-8 flex gap-4">
              <Link
                href="/contact"
                className="text-white bg-black hover:opacity-70 font-medium px-6 py-3"
              >
                Subscribe
              </Link>
              <Link
                href="/collection"
                className="bg-black/5 hover:bg-black/10 font-medium px-6 py-3"
              >
                Browse
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <Image
              src={imageUrl}
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
