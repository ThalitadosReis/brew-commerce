import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";

export default function CraftSection() {
  const crafts = [
    {
      tag: "Craft",
      image:
        "https://images.pexels.com/photos/7175974/pexels-photo-7175974.jpeg",
      title: "Roasted with intention, brewed with care",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      link: "/about",
      buttonText: "Our Story",
    },
    {
      tag: "Passion",
      image:
        "https://images.pexels.com/photos/6205781/pexels-photo-6205781.jpeg",
      title: "Connecting coffee lovers with global traditions",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      link: "/collection",
      buttonText: "Our Collection",
    },
    {
      tag: "Heritage",
      image:
        "https://images.pexels.com/photos/7125537/pexels-photo-7125537.jpeg",
      title: "Sustainable practices that support global communities",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      link: "/about",
      buttonText: "Learn More",
    },
    {
      tag: "Innovation",
      image:
        "https://images.pexels.com/photos/6280321/pexels-photo-6280321.jpeg",
      title: "Reimagining coffee through modern techniques",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      link: "/contact",
      buttonText: "Get in Touch",
    },
  ];

  return (
    <>
      <Head>
        {crafts.map(({ image }) => (
          <link key={image} rel="preload" as="image" href={image} />
        ))}
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div className="relative grid md:grid-cols-2">
          {/* content */}
          <div className="flex flex-col">
            {crafts.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-start justify-center py-8 md:h-screen space-y-4"
              >
                <h5 className="mb-1 text-lg font-heading">{item.tag}</h5>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
                  {item.title}
                </h2>
                <p className="font-body text-black/70">{item.text}</p>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="secondary">
                    <Link href={item.link}> {item.buttonText}</Link>
                  </Button>
                  <Button variant="tertiary">
                    <Link href={item.link}>Explore</Link>
                  </Button>
                </div>

                {/* mobile image block */}
                <div className="mt-10 block w-full md:hidden">
                  <div className="relative w-full h-[300px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={`Craft process step ${i + 1}: ${item.title}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* sticky image */}
          <div className="sticky top-0 hidden md:h-screen md:block">
            <div className="relative top-[10%] w-fit h-4/5 overflow-hidden">
              <div className="relative z-10">
                {crafts.map((item, i) => (
                  <div
                    key={i}
                    className="flex h-screen w-full items-center justify-center pb-[20vh]"
                  >
                    <div className="relative w-3/4">
                      <Image
                        src={item.image}
                        alt={`Craft display image ${i + 1}`}
                        width={800}
                        height={600}
                        className="object-contain w-full"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
