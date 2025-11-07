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
  return (
    <div
      className={`flex flex-col ${
        imagePosition === "right" ? "md:flex-row" : "md:flex-col"
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
          imagePosition === "right"
            ? "md:w-1/2 min-h-64 lg:min-h-80"
            : "h-64 lg:h-full"
        }`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover ${
            imagePosition === "bottom" ? "object-[50%_40%]" : ""
          }`}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}
