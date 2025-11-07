import Section from "../common/Section";
import Card from "@/components/common/Card";
import { FEATURE_IMAGES } from "@/lib/images/home";

export function FeaturesSection() {
  return (
    <section className="bg-white/90 py-24 px-4 md:px-6">
      <Section
        subtitle="Craft to cup"
        title="Every step tailored for flavor"
        description="From farm relationships and roast profiles to the people guiding you—discover what shapes each cup."
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card
            subtitle="Origin"
            title="Single origin beans with unique flavor profiles"
            description="Trace every cup back to handpicked partners we work with directly across Ethiopia, Colombia, and Costa Rica."
            image={FEATURE_IMAGES[0]}
          />
          <Card
            subtitle="Craft"
            title="Our meticulous roasting process"
            description="Small-batch roasts dialed for sweetness and clarity, paired with detailed brew guides you can follow at home."
            image={FEATURE_IMAGES[1]}
          />
        </div>

        <Card
          subtitle="Contact"
          title="Reach out to us for brewing guidance"
          description="Have a question about grind size or water ratios? Our team replies within one business day."
          ctaLabel="Contact us"
          href="/contact"
          image={FEATURE_IMAGES[2]}
          imagePosition="bottom"
          className="h-full"
        />
      </div>
    </section>
  );
}
