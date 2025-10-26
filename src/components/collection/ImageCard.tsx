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
          className="absolute top-4 left-4 z-10 p-2 bg-white hover:bg-white/50 rounded-full transition-colors"
          title={
            isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <HeartIcon
            size={20}
            weight={isProductInWishlist ? "fill" : "light"}
          />
        </button>

        <Link href={`/collection/${id}`} className="block group">
          <Image
            src={images[0]}
            alt={name}
            width={300}
            height={300}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-base md:text-lg font-heading font-semibold">
          {name} <span className="font-thin text-black/70">{country}</span>
        </h3>
        <p className="text-sm font-semibold">from CHF{price}</p>
      </div>
    </div>
  );
}
