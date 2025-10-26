import Section from "../common/Section";
import Card from "@/components/common/Card";
import { ABOUT_IMAGES } from "@/lib/images.about";

export default function AboutSection() {
  return (
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
          image={ABOUT_IMAGES[0]}
        />
        <Card
          subtitle="Ethical"
          title="Fair trade practices that support coffee-growing communities"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
          image={ABOUT_IMAGES[1]}
        />
      </div>
    </section>
  );
}
