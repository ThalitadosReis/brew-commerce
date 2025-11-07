"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";

import Loading from "@/components/common/Loading";
import ProductSection from "@/components/collection[id]/ProductSection";
import FlavourSection from "@/components/collection[id]/FlavourSection";
import ImageGrid from "@/components/collection[id]/ImageGrid";
import ContentBlock from "@/components/common/ContentBlock";
import { CRAFT_IMAGE } from "@/lib/images/products";

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
    <>
      <ProductSection product={product} />

      <div className="bg-white">
        <ContentBlock
          className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 py-12 lg:py-24"
          contentClassName="!p-0"
          subtitle="Craft"
          title="The art of coffee roasting"
          text={
            <div className="space-y-4">
              <p>
                We select only the finest beans from sustainable farms. Each
                batch is roasted with precision and care.
              </p>
              <ul className="list-disc pl-4">
                <li>Small batch roasting ensures maximum flavor</li>
                <li>Direct trade with Ethiopian farmers</li>
                <li>Sustainable and ethical coffee production</li>
              </ul>
            </div>
          }
          image={CRAFT_IMAGE}
          imagePosition="left"
        />
      </div>

      <FlavourSection />
      <ImageGrid />
    </>
  );
}
