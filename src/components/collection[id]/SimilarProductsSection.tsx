import type { Product } from "@/types/product";
import ImageCard from "@/components/collection/ImageCard";

interface SimilarProductsSectionProps {
  currentProduct: Product;
  allProducts: Product[];
}

export function SimilarProductsSection({
  currentProduct,
  allProducts,
}: SimilarProductsSectionProps) {
  const similar = allProducts
    .filter(
      (p) =>
        p._id !== currentProduct._id &&
        p.category === currentProduct.category
    )
    .slice(0, 4);

  if (similar.length === 0) return null;

  return (
    <section className="bg-white px-4 md:px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-2">
            {currentProduct.category} roast
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-black">
            You might also like
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {similar.map((product) => {
            const minPrice =
              product.sizes.length > 0
                ? Math.min(...product.sizes.map((s) => s.price))
                : product.price;

            return (
              <ImageCard
                key={product._id}
                id={product._id}
                name={product.name}
                images={product.images}
                price={minPrice}
                country={product.country}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
