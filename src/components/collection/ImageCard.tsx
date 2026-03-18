import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

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
  product: _product,
}: ImageCardProps) {
  void _product;
  return (
    <div className={`space-y-3 bg-neutral-200 ${className}`}>
      <Link href={`/collection/${id}`} className="block group">
        <div className="relative w-full overflow-hidden">
          <Image
            src={images[0]}
            alt={name}
            width={400}
            height={500}
            className="w-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
          />
          {images[1] && (
            <Image
              src={images[1]}
              alt={`${name} alternate`}
              width={400}
              height={500}
              className="absolute inset-0 w-full object-cover opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
            />
          )}
        </div>
      </Link>

      <div className="text-center space-y-1 py-2">
        <h6 className="text-sm uppercase tracking-[0.15em] text-neutral-900">
          {name}
        </h6>
        <p className="text-xs tracking-widest text-neutral-500 uppercase">
          {country}
        </p>
        <p className="text-sm text-neutral-700 pt-1">From ${price}</p>
      </div>
    </div>
  );
}
