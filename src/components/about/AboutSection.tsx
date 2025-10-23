import Head from "next/head";
import Image from "next/image";

export default function AboutSection() {
  const images = [
    "https://images.pexels.com/photos/7125434/pexels-photo-7125434.jpeg",
    "https://images.pexels.com/photos/29745520/pexels-photo-29745520.jpeg",
  ];

  return (
    <>
      <Head>
        {images.map((src, idx) => (
          <link key={idx} rel="preload" as="image" href={src} />
        ))}
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12 lg:mb-24">
          <div className="mx-auto text-center space-y-4">
            <h5 className="text-lg font-heading">Pure</h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
              Why our coffee is different
            </h2>
            <p className="text-body">
              Sustainable, ethical, and delicious coffee that makes a difference
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col md:flex-row border border-black/10 overflow-hidden relative">
            <div className="flex flex-col justify-center flex-1">
              <div className="p-6 space-y-4">
                <p className="mb-1 font-heading">Sustainable</p>
                <h3 className="font-semibold">
                  Supporting farmers and protecting the environment with every
                  cup
                </h3>
                <p className="text-body text-black/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros elementum tristique.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-1/2 relative aspect-square">
              <Image
                src={images[0]}
                alt="Sustainable coffee"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row border border-black/10 overflow-hidden relative">
            <div className="flex flex-col justify-center flex-1">
              <div className="p-6 space-y-4">
                <p className="mb-1 font-heading">Ethical</p>
                <h3 className="font-semibold">
                  Fair trade practices that support coffee-growing communities
                </h3>
                <p className="text-black/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros elementum tristique.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-1/2 relative aspect-square">
              <Image
                src={images[1]}
                alt="Ethical coffee"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
