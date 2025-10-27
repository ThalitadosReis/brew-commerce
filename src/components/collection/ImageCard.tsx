import React from "react";
import Image from "next/image";
import Link from "next/link";

import { useFavorites } from "@/contexts/FavoritesContext";
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
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isProductFavorite = isFavorite(id);

  const handleFavoritesToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProductFavorite) {
      removeFromFavorites(id);
    } else if (product) {
      addToFavorites(product);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative p-4 flex items-center justify-center bg-black/10 w-full overflow-hidden group">
        <button
          onClick={handleFavoritesToggle}
          className="absolute top-4 left-4 z-10 p-2 bg-white hover:bg-white/50 rounded-full transition-colors"
          title={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon
            size={20}
            weight={isProductFavorite ? "fill" : "light"}
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
