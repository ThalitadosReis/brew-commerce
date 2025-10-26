"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

interface ButtonItem {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "tertiary" | "default";
}

interface ContentBlockProps {
  subtitle?: string;
  title: string;
  text: string | ReactNode;
  image?: string;
  buttons?: ButtonItem[];
  imagePosition?: "left" | "right" | "bottom";
  className?: string;
  contentClassName?: string;
  priority?: boolean;
  sizes?: string;
}

const ContentBlock = ({
  subtitle,
  title,
  text,
  image,
  buttons = [],
  imagePosition = "right",
  className = "",
  contentClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ContentBlockProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${className} ${
          imagePosition === "left" ? "md:grid-flow-col-dense" : ""
        }`}
      >
        <div
          className={`max-w-lg flex flex-col justify-center space-y-4 p-8 ${
            imagePosition === "left" ? "md:order-2" : "md:order-1"
          } ${contentClassName}`}
        >
          {subtitle && (
            <h5 className="mb-2 text-lg font-heading">{subtitle}</h5>
          )}

          <h2 className="text-4xl lg:text-5xl font-heading">{title}</h2>
          <div className="font-body text-black/70">{text}</div>

          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {buttons.map(({ label, href, variant = "primary" }, idx) => (
                <Button key={idx} variant={variant}>
                  <Link href={href}>{label}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div
            className={`relative w-full h-[300px] lg:h-[400px] ${
              imagePosition === "left" ? "md:order-1" : "md:order-2"
            }`}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes={sizes}
              className="object-cover"
              priority={priority}
              fetchPriority={priority ? "high" : "auto"}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentBlock;
