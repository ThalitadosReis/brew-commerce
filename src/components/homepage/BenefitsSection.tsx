import {
  CoffeeIcon,
  TimerIcon,
  PlantIcon,
  HandHeartIcon,
} from "@phosphor-icons/react";
import Section from "@/components/common/Section";

export function BenefitsSection() {
  const iconClasses = "h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9";
  const benefits = [
    {
      title: "Why choose our coffee",
      text: "Premium beans, perfectly roasted, ethically sourced.",
      icon: <CoffeeIcon weight="light" className={iconClasses} />,
    },
    {
      title: "Expert roasting",
      text: "Every batch roasted with precision and care.",
      icon: <TimerIcon weight="light" className={iconClasses} />,
    },
    {
      title: "Sustainable practices",
      text: "Supporting farmers and protecting the environment.",
      icon: <PlantIcon weight="light" className={iconClasses} />,
    },
    {
      title: "Crafted for you",
      text: "Coffee designed to enhance your experience.",
      icon: <HandHeartIcon weight="light" className={iconClasses} />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <Section
        subtitle="Benefits"
        title="Highest grade Arabica beans"
        description="Quality, sustainability, and taste in every cup."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="max-w-xs mx-auto flex flex-col items-center gap-2 text-center"
          >
            <div className="text-black">{benefit.icon}</div>
            <h5 className="text-lg font-semibold text-black">
              {benefit.title}
            </h5>
            <p className="text-sm text-black/60">{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
