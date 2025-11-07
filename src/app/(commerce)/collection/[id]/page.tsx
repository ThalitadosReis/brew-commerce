"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";

import Loading from "@/components/common/Loading";
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

  if (loading) return <Loading message="Loading..." />;

  return (
    <div className="bg-black/5 pt-12 pb-32 space-y-24">
      <ProductSection product={product} />
      <CoffeeCraftSection />
      <FlavourSection />
      <CoffeeMoments />
    </div>
  );
}
