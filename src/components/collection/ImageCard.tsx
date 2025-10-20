"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ImageCardProps {
  id: string | number;
  name: string;
  images: string[];
  price: number;
  country: string;
  className?: string;
}

export default function ImageCard({
  id,
  name,
  images,
  price,
  country,
  className = "",
}: ImageCardProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="p-4 flex items-center justify-center bg-black/10 w-full overflow-hidden">
        <Link href={`/collection/${id}`} className="block group">
          <Image
            src={images[0]}
            alt={name}
            width={300}
            height={300}
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-xl md:text-base font-heading text-primary">{name}</h3>
        <h3 className="text-xs font-light">{country}</h3>
        <span className="text-sm font-medium">from CHF{price}</span>
      </div>
    </div>
  );
}
