import Head from "next/head";
import Section from "../common/Section";
import Card from "@/components/common/Card";

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
        <Section
          subtitle="Pure"
          title="Why our coffee is different"
          description="Sustainable, ethical, and delicious coffee that makes a difference"
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <Card
            subtitle="Sustainable"
            title="Supporting farmers and protecting the environment with every cup"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
            image={images[0]}
          />
          <Card
            subtitle="Ethical"
            title="Fair trade practices that support coffee-growing communities"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
            image={images[1]}
          />
        </div>
      </section>
    </>
  );
}
