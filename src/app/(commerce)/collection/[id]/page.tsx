"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";

import CoffeeCraftSection from "@/components/collection[id]/CoffeeCraftSection";
import FlavourSection from "@/components/collection[id]/FlavourSection";
import CoffeeMoments from "@/components/collection[id]/CoffeeMoments";
import ProductSection from "@/components/collection[id]/ProductSection";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);

          // dynamically preload the product’s main image
          const heroImage = data?.product?.images?.[0];
          if (heroImage) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = heroImage;
            document.head.appendChild(link);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/5">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black/70 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/70 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/5 py-24 space-y-24">
      <ProductSection product={product} />
      <CoffeeCraftSection />
      <FlavourSection />
      <CoffeeMoments />
    </div>
  );
}
