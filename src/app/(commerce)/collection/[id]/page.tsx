"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";

import Loading from "@/components/common/Loading";
import ProductSection from "@/components/collection[id]/ProductSection";
import { ProductPromisesSection } from "@/components/collection[id]/ProductPromisesSection";
import { SimilarProductsSection } from "@/components/collection[id]/SimilarProductsSection";
import { CtaSection } from "@/components/homepage/CtaSection";
import { COLLECTION_CTA_IMAGE } from "@/lib/images";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, allRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch("/api/products"),
        ]);

        if (productRes.ok) {
          const data = await productRes.json();
          setProduct(data.product);

          const heroImage = data?.product?.images?.[0];
          if (heroImage) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = heroImage;
            document.head.appendChild(link);
          }
        }

        if (allRes.ok) {
          const data = await allRes.json();
          setAllProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  if (loading) return <Loading message="Loading..." />;

  return (
    <>
      <ProductSection product={product} />
      {product && (
        <SimilarProductsSection
        currentProduct={product}
        allProducts={allProducts}
        />
      )}
      <ProductPromisesSection />
      <CtaSection
        subtitle="Keep exploring"
        title="Find your next favourite cup"
        buttons={[
          { label: "Browse all coffees", href: "/collection", variant: "primary" },
          { label: "Contact us", href: "/contact", variant: "outline" },
        ]}
        image={COLLECTION_CTA_IMAGE}
      />
    </>
  );
}
