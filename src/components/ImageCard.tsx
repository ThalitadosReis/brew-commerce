"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@phosphor-icons/react";

interface ImageCardProps {
  id: string | number;
  name: string;
  images: string[];
  price: number;
  country: string;
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
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
      className={`flex flex-col h-full bg-secondary/10 rounded-2xl ${className}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist?.();
            }}
            className="relative p-2 bg-white rounded-full group"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon size={20} weight={isInWishlist ? "fill" : "light"} />

            {/* hover effect */}
            {!isInWishlist && (
              <HeartIcon
                size={20}
                weight="fill"
                className="absolute inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            )}
          </button>

          <span className="relative px-4 py-1 text-white bg-secondary rounded-md font-body text-xs pointer-events-none">
            {country}
          </span>
        </div>

        <Link
          href={`/collection/${id}`}
          className="relative block w-full h-full group overflow-hidden"
        >
          <Image
            src={images[0]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
      </div>

      <div className="p-6 text-center">
        <h3 className="font-display text-xl text-primary hover:text-secondary transition-colors">
          {name}
        </h3>
        <span className="font-body text-sm text-secondary/70">CHF{price}</span>
      </div>
    </div>
  );
}
