"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";

import CoffeeCraftSection from "@/components/product/CoffeeCraftSection";
import FlavourSection from "@/components/product/FlavourSection";
import CoffeeMoments from "@/components/product/CoffeeMoments";
import ProductSection from "@/components/product/ProductSection";

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
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-black/5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-black">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/5 py-24 space-y-24 lg:space-y-32">
      <ProductSection product={product} />
      <CoffeeCraftSection />
      <FlavourSection />
      <CoffeeMoments />
    </div>
  );
}
