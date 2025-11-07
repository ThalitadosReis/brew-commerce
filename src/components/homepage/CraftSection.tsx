import ContentBlock from "@/components/common/ContentBlock";
import { CRAFT_IMAGES } from "@/lib/images/home";

export function CraftSection() {
  const crafts = [
    {
      subtitle: "Craft",
      title: "Roasted with intention, brewed with care",
      text: "Every bean roasted to highlight its unique flavor profile.",
      image: CRAFT_IMAGES[0],
      href: "/about",
    },
    {
      subtitle: "Passion",
      title: "Connecting coffee lovers with global traditions",
      text: "Bringing communities together through shared experiences.",
      image: CRAFT_IMAGES[1],
      href: "/collection",
    },
    {
      subtitle: "Heritage",
      title: "Sustainable practices that support communities",
      text: "Ethical sourcing that ensures fairness and sustainability.",
      image: CRAFT_IMAGES[2],
      href: "/about",
    },
    {
      subtitle: "Innovation",
      title: "Reimagining coffee through modern techniques",
      text: "Combining craftsmanship with technology for consistency.",
      image: CRAFT_IMAGES[3],
      href: "/contact",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-24">
      {crafts.map((item, index) => (
        <ContentBlock
          key={index}
          contentClassName="!p-0"
          subtitle={item.subtitle}
          title={item.title}
          text={item.text}
          image={item.image}
          buttons={
            item.href
              ? [{ label: "Discover", href: item.href, variant: "secondary" }]
              : undefined
          }
          imagePosition={index % 2 === 0 ? "right" : "left"}
          className="py-6"
          priority={false}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}
    </section>
  );
}
