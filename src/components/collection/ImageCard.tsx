import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product";
import FavoriteToggleButton from "../common/FavoriteToggleButton";

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
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative flex items-center justify-center bg-black/10 w-full overflow-hidden group">
        <FavoriteToggleButton
          productId={id}
          product={product}
          preventDefault
          stopPropagation
        />

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

      <div className="text-center">
        <h6 className="text-lg lg:text-xl text-black/75">
          {name} / {country}
        </h6>
        <p className="text-sm lg:text-base font-semibold">from CHF{price}</p>
      </div>
    </div>
  );
}
