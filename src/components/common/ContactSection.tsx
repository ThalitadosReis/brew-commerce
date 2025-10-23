import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";

interface ButtonItem {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "tertiary" | "default";
}

interface ContactSectionProps {
  title: string;
  text: string;
  image: string;
  buttons: ButtonItem[];
  className?: string;
}

const ContactSection = ({
  title,
  text,
  image,
  buttons = [],
  className = "",
}: ContactSectionProps) => {
  if (!image) return null;

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

      <section className="max-w-7xl mx-auto px-6">
        <div
          className={`grid auto-cols-fr grid-cols-1 overflow-hidden md:grid-cols-2 ${className}`}
        >
          <div className="flex flex-col justify-center p-8 space-y-8">
            <div className="max-w-lg space-y-4">
              <h2 className="text-4xl lg:text-5xl font-heading">{title}</h2>
              <p className="font-body text-black/70">{text}</p>
            </div>

            {buttons.length > 0 && (
              <div className="flex gap-4">
                {buttons.map(({ label, href, variant = "primary" }, idx) => (
                  <Button key={idx} variant={variant}>
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
