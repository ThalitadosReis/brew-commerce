import Section from "../common/Section";
import Card from "@/components/common/Card";
import { FEATURE_IMAGES } from "@/lib/images/home";

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-8">
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
            description="Learn about our direct-trade relationships with small farms worldwide."
            href="/collection"
            image={FEATURE_IMAGES[0]}
          />
          <Card
            subtitle="Craft"
            title="Our meticulous roasting process"
            description="Each batch roasted to highlight the natural flavors of its origin."
            href="/about"
            image={FEATURE_IMAGES[1]}
          />
        </div>

        <Card
          subtitle="Contact"
          title="Reach out to us for brewing guidance"
          description="Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."
          href="/contact"
          image={FEATURE_IMAGES[2]}
          imagePosition="bottom"
          className="h-full"
        />
      </div>
    </section>
  );
}
