import Head from "next/head";
import Section from "../common/Section";
import Card from "@/components/common/Card";

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
        <Section
          subtitle="Our craft"
          title="Exceptional coffee experiences"
          description="Carefully sourced beans from sustainable farms worldwide"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <Card
              subtitle="Origin"
              title="Single origin beans with unique flavor profiles"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
              href="/collection"
              image={images[0]}
            />
            <Card
              subtitle="Craft"
              title="Learn about our meticulous roasting process"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
              image={images[1]}
            />
          </div>

          <Card
            subtitle="brew."
            title="Reach out to us for brewing guidance"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."
            href="/contact"
            image={images[2]}
            imagePosition="bottom"
            className="h-full"
          />
        </div>
      </section>
    </>
  );
}
