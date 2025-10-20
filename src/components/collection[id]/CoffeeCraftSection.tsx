import Image from "next/image";
import Head from "next/head";

export default function CoffeeCraftSection() {
  const image =
    "https://images.pexels.com/photos/7175961/pexels-photo-7175961.jpeg";

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h5 className="mb-1 text-lg font-heading">Craft</h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
              The art of coffee roasting
            </h2>
            <p className="font-body">
              We select only the finest beans from sustainable farms. Each batch
              is roasted with precision and care.
            </p>
            <ul className="list-disc pl-5 font-light">
              <li className="pl-2">
                Small batch roasting ensures maximum flavor
              </li>
              <li className="pl-2">Direct trade with Ethiopian farmers</li>
              <li className="pl-2">
                Sustainable and ethical coffee production
              </li>
            </ul>
          </div>

          <div className="relative aspect-square">
            <Image
              src={image}
              alt="The art of coffee roasting"
              width={600}
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
