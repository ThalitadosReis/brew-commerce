import Head from "next/head";
import Image from "next/image";

export default function CoffeeMoments() {
  const images = [
    "https://images.pexels.com/photos/6439132/pexels-photo-6439132.jpeg",
    "https://images.pexels.com/photos/7125756/pexels-photo-7125756.jpeg",
    "https://images.pexels.com/photos/7125537/pexels-photo-7125537.jpeg",
    "https://images.pexels.com/photos/7125433/pexels-photo-7125433.jpeg",
    "https://images.pexels.com/photos/7125689/pexels-photo-7125689.jpeg",
    "https://images.pexels.com/photos/7125565/pexels-photo-7125565.jpeg",
    "https://images.pexels.com/photos/13819623/pexels-photo-13819623.jpeg",
    "https://images.pexels.com/photos/30658807/pexels-photo-30658807.jpeg",
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
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-4xl lg:text-6xl font-heading">
              Coffee moments
            </h2>
            <p className="text-body">
              Explore the beauty and craft behind our coffee
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.slice(0, 8).map((src, index) => (
            <div
              key={index}
              className={`
                relative block w-full aspect-square overflow-hidden
                  ${index >= 4 ? "hidden md:block" : ""}
                  ${index >= 6 ? "md:hidden lg:block" : ""} 
              `}
            >
              <Image
                src={src}
                alt={`Coffee moment ${index + 1}`}
                width={500}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
