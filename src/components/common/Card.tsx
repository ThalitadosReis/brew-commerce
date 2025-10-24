"use client";

import Image from "next/image";
import Link from "next/link";
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
      } border border-black/20 overflow-hidden ${className}`}
    >
      <div className="flex flex-col justify-center flex-1">
        <div className="p-6 space-y-4">
          {subtitle && <p className="font-heading mb-1">{subtitle}</p>}
          <h3 className="text-xl font-medium">{title}</h3>
          <p className="text-black/70">{description}</p>

          {href && (
            <Button variant="tertiary" className="px-0 py-0">
              <Link href={href}>Learn more</Link>
            </Button>
          )}
        </div>
      </div>

      <div
        className={`relative flex-shrink-0 w-full ${
          imagePosition === "right" ? "md:w-1/2" : "h-[300px] md:h-auto"
        }`}
        style={imagePosition === "bottom" ? { minHeight: "100%" } : {}}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}
