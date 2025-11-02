"use client";

import Image from "next/image";
import Button from "./Button";

interface CardProps {
  title: string;
  subtitle?: string;
  description: string;
  href?: string;
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
}: CardProps) {
  return (
    <div
      className={`flex flex-col ${
        imagePosition === "right" ? "md:flex-row" : "md:flex-col"
      } border border-black/25 overflow-hidden ${className}`}
    >
      <div className="flex flex-col justify-center flex-1">
        <div className="p-8 space-y-4">
          {subtitle && <small>{subtitle}</small>}
          <h5>{title}</h5>
          <p>{description}</p>
          {href && (
            <Button as="link" href={href} variant="tertiary">
              Learn more
            </Button>
          )}
        </div>
      </div>

      <div
        className={`relative shrink-0 w-full ${
          imagePosition === "right"
            ? "md:w-1/2 min-h-[300px]"
            : "h-[300px] lg:h-full"
        }`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}
