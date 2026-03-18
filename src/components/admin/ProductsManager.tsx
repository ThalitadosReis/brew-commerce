"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { ProductForm, type ProductPayload } from "@/components/admin/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
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

function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-sm border border-black/10 bg-white p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-3">
          Confirm
        </p>
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-black mb-2">
          Delete product?
        </h3>
        <p className="text-sm text-neutral-500 mb-6">
          This action cannot be undone. The product will be removed from the catalog immediately.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-black/15 hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}) {
  const prices = product.sizes.length > 0 ? product.sizes.map((s) => s.price) : [product.price];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock < 10;
  const stockClass = isOutOfStock ? "text-red-500" : isLowStock ? "text-amber-600" : "text-black/60";

  return (
    <tr className="border-b border-black/5 hover:bg-neutral-50 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-black/5">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" unoptimized />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <ImageIcon size={14} className="text-black/30" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-black truncate">{product.name}</p>
            <p className="text-xs text-black/40 line-clamp-1 max-w-xs">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-5 py-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-black/50">
            <TagIcon size={12} />
            {product.category}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-black/50">
            <GlobeHemisphereWestIcon size={12} />
            {product.country}
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-5 py-4 text-sm text-black/60 tabular-nums">
        CHF {minPrice.toFixed(2)} – {maxPrice.toFixed(2)}
      </td>
      <td className="hidden md:table-cell px-5 py-4">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium ${stockClass}`}>
            {isOutOfStock ? "Out of stock" : totalStock}
          </span>
          {(isOutOfStock || isLowStock) && <WarningIcon size={14} className={stockClass} />}
        </div>
      </td>
      <td className="px-5 py-4 text-right">
        <div className="inline-flex gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-1.5 border border-black/10 hover:bg-black/5 transition-colors"
            aria-label={`Edit ${product.name}`}
          >
            <PencilIcon size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product._id)}
            className="p-1.5 border border-black/10 hover:bg-black/5 transition-colors"
            aria-label={`Delete ${product.name}`}
          >
            <TrashIcon size={14} />
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

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalState, setModalState] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });
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
  const closeModal = useCallback(() => setModalState({ open: false, product: null }), []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== "admin") { router.replace("/admin-login"); return; }
    setReady(true);
  }, [authLoading, isAuthenticated, user, router]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch("/api/admin/products", { headers, credentials: "include" });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) { router.replace("/admin-login"); setProducts([]); return; }
      if (!response.ok) throw new Error(data.error || "Failed to fetch products");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [token, router]);

  useEffect(() => { if (ready) fetchProducts(); }, [ready, fetchProducts]);

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
        const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const response = await fetch(url, { method: productId ? "PUT" : "POST", headers, credentials: "include", body: JSON.stringify(payload) });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) { router.replace("/admin-login"); return; }
        if (!response.ok) throw new Error(data.error || "Failed to save product");
        await fetchProducts();
        closeModal();
      } catch (error) {
        console.error("Error saving product:", error);
      } finally {
        setSavingProduct(false);
      }
    },
    [token, router, fetchProducts, closeModal]
  );

  const handleDelete = useCallback(
    async (productId: string) => {
      try {
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE", headers, credentials: "include" });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) { router.replace("/admin-login"); return; }
        if (!response.ok) throw new Error(data.error || "Failed to delete product");
        await fetchProducts();
        setDeleteId(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    [token, router, fetchProducts]
  );

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((p) => {
      const name = p.name?.toLowerCase() ?? "";
      const category = p.category?.toLowerCase() ?? "";
      const country = p.country?.toLowerCase() ?? "";
      return name.includes(searchQuery) || category.includes(searchQuery) || country.includes(searchQuery);
    });
  }, [products, searchQuery]);

  if (authLoading || !ready) return <Loading message="Checking admin permissions..." />;
  if (!user || user.role !== "admin") return <Loading message="Redirecting..." />;
  if (loadingProducts) return <Loading message="Fetching products..." />;

  return (
    <React.Fragment>
      <section className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-2">Catalog</p>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-black">
              Product management
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Manage listings, images, pricing, and stock levels.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <MagnifyingGlassIcon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-black/15 bg-white px-3 py-2 pl-9 text-sm outline-none focus:border-black/30 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => openModal()}
              className="flex shrink-0 items-center gap-2 bg-black px-4 py-2 text-xs uppercase tracking-[0.15em] text-white hover:bg-black/85 transition-colors"
            >
              <PlusIcon size={14} />
              New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-black/10 bg-white overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-black/10">
                  <tr>
                    <th className="px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Product</th>
                    <th className="hidden md:table-cell px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Details</th>
                    <th className="hidden md:table-cell px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Price</th>
                    <th className="hidden md:table-cell px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Stock</th>
                    <th className="px-5 py-3 text-right text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <ProductRow
                      key={p._id}
                      product={p}
                      onEdit={openModal}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <ImageIcon size={32} className="text-black/20" />
              <div>
                <p className="text-sm font-medium text-black">No products found</p>
                <p className="text-xs text-black/40 mt-0.5">
                  {searchQuery ? "No items match your search." : "Add your first product to get started."}
                </p>
              </div>
            </div>
          )}
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
