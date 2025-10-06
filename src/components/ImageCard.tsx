"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface ImageCardProps {
  id: number;
  name: string;
  images: string[];
  price: number;
  country: string;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
  className?: string;
}

export default function ImageCard({
  id,
  name,
  images,
  price,
  country,
  isInWishlist,
  onToggleWishlist,
  className = "",
}: ImageCardProps) {
  return (
    <div
      className={`flex flex-col h-full bg-muted/10 rounded-3xl ${className}`}
    >
      {/* image container */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist();
            }}
            className="p-2 bg-white rounded-full hover:bg-neutral transition-colors relative z-20"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist ? "text-primary fill-primary" : "text-secondary"
              }`}
            />
          </button>

          <span className="px-4 py-1 text-white bg-secondary rounded-lg font-body text-xs relative z-20 pointer-events-none">
            {country}
          </span>
        </div>

        <Link
          href={`/collection/${id}`}
          className="relative block w-full h-full group"
        >
          <Image
            src={images[0]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />

          {images[1] && (
            <Image
              src={images[1]}
              alt={`${name} alternate`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>
      </div>

      <div className="mt-2 p-6 block text-center">
        <h3 className="font-display text-lg text-primary hover:text-secondary transition-colors">
          {name}
        </h3>

        <span className="text-sm text-muted">CHF{price}</span>
      </div>
    </div>
  );
}
