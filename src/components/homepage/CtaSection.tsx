import Image from "next/image";

import Button from "@/components/common/Button";
import { CTA_IMAGE } from "@/lib/images";

type CtaButton = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
};

type CtaSectionProps = {
  subtitle?: string;
  title?: string;
  buttons?: CtaButton[];
  image?: string;
};

export function CtaSection({
  subtitle = "Start your journey",
  title = "Coffee that\u2019s worth caring about",
  buttons = [
    { label: "Shop coffee", href: "/collection", variant: "primary" },
    { label: "Contact us", href: "/contact", variant: "outline" },
  ],
  image = CTA_IMAGE,
}: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-900 px-4 md:px-6 py-14 lg:py-24">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="Coffee"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
          priority={false}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-500 mb-3">
          {subtitle}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white max-w-xl mb-8">
          {title}
        </h2>
        <div className="flex flex-wrap gap-4">
          {buttons.map((btn) => (
            <Button
              key={btn.href}
              as="a"
              href={btn.href}
              variant={btn.variant ?? "primary"}
              className={btn.variant === "outline" ? "text-white" : ""}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
