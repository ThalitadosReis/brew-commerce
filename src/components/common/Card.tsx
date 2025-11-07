"use client";

import Image from "next/image";
import Button from "./Button";

interface CardProps {
  title: string;
  subtitle?: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  image: string;
  className?: string;
  imagePosition?: "right" | "bottom";
}

export default function Card({
  title,
  subtitle,
  description,
  href,
  image,
  className = "",
  imagePosition = "right",
  ctaLabel = "Learn more",
}: CardProps) {
  const isBottom = imagePosition === "bottom";

  return (
    <div
      className={`flex flex-col ${
        isBottom ? "md:flex-row lg:flex-col" : "md:flex-row"
      } border border-black/25 overflow-hidden ${className}`}
    >
      <div className="flex flex-col justify-center flex-1">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            {subtitle && (
              <h6 className="text-sm md:text-base lg:text-lg text-black tracking-wide">
                {subtitle}
              </h6>
            )}
            <h4 className="text-xl lg:text-2xl font-semibold leading-tight">
              {title}
            </h4>
            <p className="text-sm lg:text-base leading-6 text-black/75 font-light">
              {description}
            </p>
          </div>
          {href && (
            <Button as="link" href={href} variant="tertiary">
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>

      <div
        className={`relative shrink-0 w-full ${
          isBottom
            ? "h-64 md:w-1/2 lg:w-full lg:h-full"
            : "h-64 md:w-1/2 lg:h-full"
        }`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover ${isBottom ? "object-[40%_50%]" : ""}`}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}
