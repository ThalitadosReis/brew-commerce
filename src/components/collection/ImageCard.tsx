"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/types/product";
import { HeartIcon } from "@phosphor-icons/react";

interface ImageCardProps {
  id: string | number;
  name: string;
  images: string[];
  price: number;
  country: string;
  className?: string;
  product?: Product;
}

export default function ImageCard({
  id,
  name,
  images,
  price,
  country,
  className = "",
  product,
}: ImageCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isProductInWishlist = isInWishlist(id);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProductInWishlist) {
      removeFromWishlist(id);
    } else if (product) {
      addToWishlist(product);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative p-4 flex items-center justify-center bg-black/10 w-full overflow-hidden group">
        <button
          onClick={handleWishlistToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full transition-colors"
          title={
            isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <HeartIcon
            size={20}
            weight={isProductInWishlist || isHovered ? "fill" : "light"}
            className={`text-black transition-opacity ${
              isProductInWishlist && isHovered ? "opacity-50" : "opacity-100"
            }`}
          />
        </button>

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
        <h3 className="text-xl md:text-base font-heading">{name}</h3>
        <h3 className="text-xs font-light">{country}</h3>
        <span className="text-sm font-medium">from CHF{price}</span>
      </div>
    </div>
  );
}
