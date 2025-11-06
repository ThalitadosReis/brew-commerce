"use client";

import React from "react";

import { useFavorites } from "@/contexts/FavoritesContext";
import { Product } from "@/types/product";
import { HeartIcon } from "@phosphor-icons/react";
import Button from "./Button";

interface FavoriteToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  productId: string | number;
  product?: Product;
  iconSize?: number;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFavoriteToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export default function FavoriteToggleButton({
  productId,
  product,
  iconSize = 20,
  preventDefault = false,
  stopPropagation = false,
  onClick,
  onFavoriteToggle,
  title,
  "aria-label": ariaLabel,
  type,
  ...rest
}: FavoriteToggleButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isProductFavorite = isFavorite(productId);

  const defaultLabel = isProductFavorite
    ? "Remove from favorites"
    : "Add to favorites";

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) {
      event.preventDefault();
    }

    if (stopPropagation) {
      event.stopPropagation();
    }

    if (isProductFavorite) {
      removeFromFavorites(productId);
      onFavoriteToggle?.(false);
    } else if (product) {
      addToFavorites(product);
      onFavoriteToggle?.(true);
    }

    onClick?.(event);
  };

  return (
    <Button
      {...rest}
      type={type ?? "button"}
      title={title ?? defaultLabel}
      aria-label={ariaLabel ?? defaultLabel}
      onClick={handleButtonClick}
      className="absolute top-4 left-4 z-10 p-2 bg-white rounded-full border border-transparent hover:border-black/75 hover:border-dashed transition-all duration-300 ease-in-out"
    >
      <HeartIcon
        size={iconSize}
        weight={isProductFavorite ? "fill" : "light"}
      />
    </Button>
  );
}
