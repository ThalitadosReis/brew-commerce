import ContentBlock from "@/components/common/ContentBlock";
import { CRAFT_IMAGES } from "@/lib/images/home";

export function CraftSection() {
  const crafts = [
    {
      subtitle: "Craft",
      title: "Roasted with intention, brewed with care",
      text: "Every bean roasted to highlight its unique flavor profile.",
      image: CRAFT_IMAGES[0],
      buttons: [
        { label: "Our Story", href: "/about", variant: "secondary" as const },
        { label: "Explore", href: "/about", variant: "tertiary" as const },
      ],
    },
    {
      subtitle: "Passion",
      title: "Connecting coffee lovers with global traditions",
      text: "Bringing communities together through shared experiences.",
      image: CRAFT_IMAGES[1],
      buttons: [
        {
          label: "Our Collection",
          href: "/collection",
          variant: "secondary" as const,
        },
        { label: "Explore", href: "/collection", variant: "tertiary" as const },
      ],
    },
    {
      subtitle: "Heritage",
      title: "Sustainable practices that support communities",
      text: "Ethical sourcing that ensures fairness and sustainability.",
      image: CRAFT_IMAGES[2],
      buttons: [
        { label: "Learn More", href: "/about", variant: "secondary" as const },
        { label: "Explore", href: "/about", variant: "tertiary" as const },
      ],
    },
    {
      subtitle: "Innovation",
      title: "Reimagining coffee through modern techniques",
      text: "Combining craftsmanship with technology for consistency.",
      image: CRAFT_IMAGES[3],
      buttons: [
        {
          label: "Get in Touch",
          href: "/contact",
          variant: "secondary" as const,
        },
        { label: "Explore", href: "/contact", variant: "tertiary" as const },
      ],
    },
  ];

  return (
    <div>
      {crafts.map((item, index) => (
        <ContentBlock
          key={index}
          contentClassName="!p-0"
          subtitle={item.subtitle}
          title={item.title}
          text={item.text}
          image={item.image}
          buttons={item.buttons}
          imagePosition={index % 2 === 0 ? "right" : "left"}
          className="py-16"
          priority={false}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}
    </div>
  );
}
