"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ProductForm,
  type ProductPayload,
} from "@/components/admin/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Loading from "@/components/common/Loading";
import type { Product } from "@/types/product";

import {
  GlobeHemisphereWestIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  WarningIcon,
} from "@phosphor-icons/react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 text-black shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="space-y-2">
          <h4 className="text-2xl lg:text-3xl">Delete product?</h4>
          <p className="text-sm lg:text-base text-black/75">
            This action cannot be undone. The product will be removed from the
            catalog immediately.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-black/20 px-4 py-2 text-sm font-semibold text-black transition hover:bg-black/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const prices =
    product.sizes.length > 0
      ? product.sizes.map((size) => size.price)
      : [product.price];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock < 10;
  const stockIndicatorClass = isOutOfStock
    ? "text-red-600"
    : isLowStock
    ? "text-amber-600"
    : "text-black";

  return (
    <tr>
      <td className="pl-4 py-4 align-top">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/10">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-black/50">
                <ImageIcon size={16} />
              </div>
            )}
          </div>
          <div>
            <div className="truncate text-sm font-semibold text-black">
              {product.name}
            </div>
            <div className="max-w-sm line-clamp-2 text-xs text-black/75">
              {product.description}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden p-4 align-top md:table-cell">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm ">
            <TagIcon size={16} />
            <span>{product.category}</span>
          </div>
          <div className="flex items-center gap-2 text-sm ">
            <GlobeHemisphereWestIcon size={16} />
            <span>{product.country}</span>
          </div>
        </div>
      </td>
      <td className="hidden p-4 align-top text-sm md:table-cell">
        CHF {minPrice.toFixed(2)} – {maxPrice.toFixed(2)}
      </td>
      <td className="hidden p-4 align-top text-sm md:table-cell">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${stockIndicatorClass}`}>
            {isOutOfStock ? "Out of stock" : totalStock}
          </span>
          {(isOutOfStock || isLowStock) && (
            <WarningIcon size={16} className={`${stockIndicatorClass}`} />
          )}
        </div>
      </td>
      <td className="p-4 text-right align-top">
        <div className="inline-flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex p-2 items-center justify-center rounded-md border border-black/10 transition hover:bg-black/5"
            aria-label={`Edit ${product.name}`}
          >
            <PencilIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product._id)}
            className="flex p-2 items-center justify-center rounded-md border border-black/10 transition hover:bg-black/5"
            aria-label={`Delete ${product.name}`}
          >
            <TrashIcon size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProductsManager() {
  const { token, user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalState, setModalState] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });
  const [savingProduct, setSavingProduct] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const actionParam = searchParams?.get("action");
  const [searchQuery, setSearchQuery] = useState(
    (searchParams?.get("search") ?? "").trim().toLowerCase()
  );

  const openModal = useCallback((product?: Product) => {
    setModalState({ open: true, product: product ?? null });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ open: false, product: null });
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/admin-login");
      return;
    }
    setReady(true);
  }, [authLoading, isAuthenticated, user, router]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch("/api/admin/products", {
        headers,
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        showToast("Session expired. Please sign in again.", "error");
        router.replace("/admin-login");
        setProducts([]);
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast(
        error instanceof Error ? error.message : "Unable to load products",
        "error"
      );
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [token, showToast, router]);

  useEffect(() => {
    if (ready) fetchProducts();
  }, [ready, fetchProducts]);

  useEffect(() => {
    if (!ready) return;
    if (actionParam === "new" && !modalState.open) {
      openModal();
      router.replace("/admin?tab=products", { scroll: false });
    }
  }, [actionParam, ready, modalState.open, openModal, router]);

  const handleProductSave = useCallback(
    async (payload: ProductPayload, productId?: string) => {
      try {
        setSavingProduct(true);
        const url = productId
          ? `/api/admin/products/${productId}`
          : "/api/admin/products";
        const method = productId ? "PUT" : "POST";
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(url, {
          method,
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          showToast("Session expired. Please sign in again.", "error");
          router.replace("/admin-login");
          return;
        }
        if (!response.ok) {
          throw new Error(data.error || "Failed to save product");
        }

        showToast(
          productId
            ? "Product updated successfully"
            : "Product created successfully",
          "success"
        );
        await fetchProducts();
        closeModal();
      } catch (error) {
        console.error("Error saving product:", error);
        showToast(
          error instanceof Error
            ? error.message
            : "An error occurred while saving the product",
          "error"
        );
      } finally {
        setSavingProduct(false);
      }
    },
    [token, showToast, router, fetchProducts, closeModal]
  );

  const handleDelete = useCallback(
    async (productId: string) => {
      try {
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
          headers,
          credentials: "include",
        });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          showToast("Session expired. Please sign in again.", "error");
          router.replace("/admin-login");
          return;
        }
        if (!response.ok) {
          throw new Error(data.error || "Failed to delete product");
        }
        showToast("Product deleted successfully", "success");
        await fetchProducts();
        setDeleteId(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        showToast(
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the product",
          "error"
        );
      }
    },
    [token, showToast, router, fetchProducts]
  );

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((product) => {
      const name = product.name?.toLowerCase() ?? "";
      const category = product.category?.toLowerCase() ?? "";
      const country = product.country?.toLowerCase() ?? "";
      return (
        name.includes(searchQuery) ||
        category.includes(searchQuery) ||
        country.includes(searchQuery)
      );
    });
  }, [products, searchQuery]);

  if (authLoading || !ready) {
    return <Loading message="Checking admin permissions..." />;
  }
  if (!user || user.role !== "admin") {
    return <Loading message="Redirecting..." />;
  }
  if (loadingProducts) {
    return <Loading message="Fetching products..." />;
  }

  const productCount = filteredProducts.length;

  return (
    <React.Fragment>
      <section className="space-y-4 md:space-y-6 lg:space-y-8">
        <header className="rounded-2xl border border-black/10 bg-white p-6 shadow-lg shadow-black/10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div className="flex-1 space-y-2">
              <small className="inline-flex uppercase text-black/75 rounded-full bg-black/5 px-4 py-2 tracking-[0.16em]">
                Catalog
              </small>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl lg:text-5xl leading-tight">
                  Product Management
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-black/75">
                  Maintain listings, imagery, and inventory levels with clarity
                  across your entire assortment.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openModal()}
              className="w-fit flex items-center gap-2 rounded-full bg-black/5 hover:bg-black/10 px-4 py-2 text-sm font-medium transition"
            >
              <PlusIcon size={16} />
              New product
            </button>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-lg shadow-black/10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h4 className="text-2xl lg:text-3xl">Inventory</h4>
              <p className="text-sm lg:text-base text-black/75">
                Complete list of products with pricing and stock levels.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon
                size={16}
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
              />
              <input
                type="text"
                placeholder="Search by order ID or product..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-full border border-black/20 bg-white px-3 py-2 pl-9 text-sm text-black outline-none focus:ring-1 focus:ring-black/25"
              />
            </div>
          </div>

          <div className="mt-6 lg:mt-8 overflow-x-auto">
            {productCount > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-black/5 text-xs uppercase tracking-wide text-black/75">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="hidden px-6 py-3 font-semibold md:table-cell">
                      Details
                    </th>
                    <th className="hidden px-6 py-3 font-semibold md:table-cell">
                      Price range
                    </th>
                    <th className="hidden px-6 py-3 font-semibold md:table-cell">
                      Stock
                    </th>
                    <th className="px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {filteredProducts.map((productItem) => (
                    <ProductRow
                      key={productItem._id}
                      product={productItem}
                      onEdit={openModal}
                      onDelete={(productId) => setDeleteId(productId)}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="mt-16 flex flex-col items-center py-16 text-center">
                <h5>No products found</h5>
                <p className="text-black/50">
                  {searchQuery
                    ? "No items match your search criteria."
                    : "Start by adding your first product to the catalog."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ProductForm
        open={modalState.open}
        product={modalState.product}
        submitting={savingProduct}
        onClose={closeModal}
        onSubmit={handleProductSave}
      />

      <ConfirmDeleteModal
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </React.Fragment>
  );
}
