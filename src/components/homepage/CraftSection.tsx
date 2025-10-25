import Head from "next/head";
import ContentBlock from "../common/ContentBlock";

export default function CraftSection() {
  const crafts = [
    {
      subtitle: "Craft",
      title: "Roasted with intention, brewed with care",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image:
        "https://images.pexels.com/photos/7175974/pexels-photo-7175974.jpeg",
      buttons: [
        { label: "Our Story", href: "/about", variant: "secondary" as const },
        { label: "Explore", href: "/about", variant: "tertiary" as const },
      ],
    },
    {
      subtitle: "Passion",
      title: "Connecting coffee lovers with global traditions",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image:
        "https://images.pexels.com/photos/6205781/pexels-photo-6205781.jpeg",
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
      title: "Sustainable practices that support global communities",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image:
        "https://images.pexels.com/photos/7125537/pexels-photo-7125537.jpeg",
      buttons: [
        { label: "Learn More", href: "/about", variant: "secondary" as const },
        { label: "Explore", href: "/about", variant: "tertiary" as const },
      ],
    },
    {
      subtitle: "Innovation",
      title: "Reimagining coffee through modern techniques",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image:
        "https://images.pexels.com/photos/6280321/pexels-photo-6280321.jpeg",
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
    <>
      <Head>
        {crafts.map(({ image }) => (
          <link key={image} rel="preload" as="image" href={image} />
        ))}
      </Head>

      <div>
        {crafts.map((item, index) => (
          <ContentBlock
            contentClassName="!p-0"
            key={index}
            subtitle={item.subtitle}
            title={item.title}
            text={item.text}
            image={item.image}
            buttons={item.buttons}
            imagePosition={index % 2 === 0 ? "right" : "left"}
            className="py-16"
          />
        ))}
      </div>
    </>
  );
}
