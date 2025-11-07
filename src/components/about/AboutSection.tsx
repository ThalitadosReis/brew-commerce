import Section from "../common/Section";
import Card from "@/components/common/Card";
import { ABOUT_IMAGES } from "@/lib/images/about";

export default function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-24">
      <Section
        subtitle="Pure"
        title="Why our coffee is different"
        description="Sustainable, ethical, and delicious coffee that makes a difference"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <Card
          subtitle="Sustainable"
          title="Supporting farmers and protecting the environment with every cup"
          description="We partner with small estates that prioritize regenerative farming, shade-grown crops, and responsible water use so each roast leaves a lighter footprint."
          image={ABOUT_IMAGES[0]}
        />
        <Card
          subtitle="Ethical"
          title="Fair trade practices that support coffee-growing communities"
          description="Every purchase reinvests in the people who harvest our beans through transparent pricing, education programs, and tools that help families thrive."
          image={ABOUT_IMAGES[1]}
        />
      </div>
    </section>
  );
}
