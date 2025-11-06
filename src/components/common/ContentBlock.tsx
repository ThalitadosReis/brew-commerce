"use client";

import { ReactNode } from "react";
import Image from "next/image";
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
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center ${className} ${
          imagePosition === "left" ? "md:grid-flow-col-dense" : ""
        }`}
      >
        <div
          className={`flex flex-col justify-center space-y-4 p-6 ${
            imagePosition === "left" ? "md:order-2" : "md:order-1"
          } ${contentClassName}`}
        >
          <div className="max-w-lg space-y-2">
            {subtitle && (
              <h6 className="text-base md:text-lg lg:text-2xl text-black tracking-wide">
                {subtitle}
              </h6>
            )}
            <h4 className="text-2xl lg:text-3xl font-semibold leading-snug">
              {title}
            </h4>
            <div className="text-sm sm:text-base md:text-[1rem] lg:text-[1.1rem] leading-6 text-black/75 font-light">
              {text}
            </div>
          </div>

          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {buttons.map(({ label, href, variant = "primary" }, idx) => (
                <Button key={idx} as="link" href={href} variant={variant}>
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div
            className={`relative w-full h-64 sm:h-80 lg:h-[420px] ${
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
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentBlock;
