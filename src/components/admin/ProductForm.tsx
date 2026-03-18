"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";

import type { Product, ProductSize } from "@/types/product";
import {
  ProductFormData,
  initialProductFormState,
} from "@/types/productsManagement";

import {
  CaretDownIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
} from "@phosphor-icons/react";

const DEFAULT_IMAGE_PRIMARY =
  "https://res.cloudinary.com/douen1dwv/image/upload/v1760905463/default/mockup-coffee_p93gic.png";
const DEFAULT_IMAGE_SECONDARY =
  "https://res.cloudinary.com/douen1dwv/image/upload/v1760956234/default/mockup-coffee2_pswggc.jpg";

const BASE_SIZES: ProductSize["size"][] = ["250g", "500g", "1kg"];
const CATEGORY_OPTIONS = [
  "Light",
  "Light-Medium",
  "Medium",
  "Medium-Dark",
  "Dark",
  "Blend",
  "Decaf",
  "Seasonal",
];

export type ProductPayload = {
  name: string;
  description: string;
  category: string;
  country: string;
  price: number;
  stock: number;
  sizes: ProductSize[];
  images: string[];
};

type BuildPayloadResult =
  | { ok: true; payload: ProductPayload }
  | { ok: false; message: string };

function getDefaultSizes(
  product: Product | null,
  price: number,
  stock: number
): ProductSize[] {
  if (product && product.sizes.length > 0) {
    return product.sizes.map((entry) => ({ ...entry }));
  }
  return [{ size: "250g", price, stock }];
}

function buildProductPayload(formData: ProductFormData): BuildPayloadResult {
  const sizeMap = new Map<ProductSize["size"], ProductSize>();

  formData.sizes.forEach((sizeEntry) => {
    const priceValue = Number(sizeEntry.price);
    const stockValue = Number(sizeEntry.stock);
    sizeMap.set(sizeEntry.size, {
      size: sizeEntry.size,
      price: Number.isFinite(priceValue) && priceValue > 0 ? priceValue : 0,
      stock: Number.isFinite(stockValue) && stockValue > 0 ? stockValue : 0,
    });
  });

  const sanitizedSizes = Array.from(sizeMap.values()).filter(
    (size) => size.price > 0
  );

  if (!sanitizedSizes.length) {
    return { ok: false, message: "Add at least one size with a price." };
  }

  const totalStock = sanitizedSizes.reduce(
    (total, size) => total + Math.max(size.stock, 0),
    0
  );
  const minPrice = Math.min(...sanitizedSizes.map((size) => size.price));

  const category = formData.category.trim();
  if (!category) {
    return { ok: false, message: "Category is required." };
  }

  if (!formData.name.trim() || !formData.description.trim()) {
    return { ok: false, message: "Name and description are required." };
  }

  const normalizedImages = (() => {
    const hero = formData.image?.trim() || DEFAULT_IMAGE_PRIMARY;
    const additional = formData.images
      .map((image) => image.trim())
      .filter((image) => image && image !== hero);
    const extras = Array.from(new Set(additional));
    const ordered = [hero, ...extras];

    if (ordered.length === 1) {
      ordered.push(
        hero === DEFAULT_IMAGE_PRIMARY
          ? DEFAULT_IMAGE_SECONDARY
          : DEFAULT_IMAGE_PRIMARY
      );
    }

    return Array.from(new Set(ordered));
  })();

  return {
    ok: true,
    payload: {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category,
      country: formData.country.trim(),
      price: minPrice,
      stock: totalStock,
      sizes: sanitizedSizes,
      images: normalizedImages,
    },
  };
}

function buildFormState(product: Product | null): ProductFormData {
  if (product) {
    const heroImage = product.images?.[0] ?? DEFAULT_IMAGE_PRIMARY;
    const gallery =
      product.images && product.images.length > 1
        ? product.images.slice(1)
        : [DEFAULT_IMAGE_SECONDARY];

    return {
      name: product.name,
      description: product.description,
      image: heroImage,
      images: gallery,
      category: product.category,
      country: product.country,
      sizes: getDefaultSizes(product, product.price, product.stock),
    };
  }

  return {
    ...initialProductFormState,
    image: DEFAULT_IMAGE_PRIMARY,
    images: [DEFAULT_IMAGE_SECONDARY],
  };
}

export interface ProductFormProps {
  open: boolean;
  product: Product | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductPayload, productId?: string) => Promise<void>;
}

export function ProductForm({
  open,
  product,
  submitting,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    buildFormState(product)
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setFormData(buildFormState(product));
    setNewImageUrl("");
    setUploadingImage(false);
  }, [open, product]);

  const heroOptions = useMemo(() => {
    const unique = new Set<string>([
      DEFAULT_IMAGE_PRIMARY,
      DEFAULT_IMAGE_SECONDARY,
    ]);
    if (formData.image?.trim()) unique.add(formData.image.trim());
    formData.images.forEach((image) => {
      if (image) unique.add(image);
    });
    return Array.from(unique);
  }, [formData.image, formData.images]);

  const categoryOptions = useMemo(() => {
    const unique = new Set<string>(CATEGORY_OPTIONS);
    if (formData.category.trim()) unique.add(formData.category.trim());
    return Array.from(unique);
  }, [formData.category]);

  const canAddMoreSizes = formData.sizes.length < BASE_SIZES.length;

  const handleSizeSelect = useCallback(
    (index: number, nextSize: ProductSize["size"]) => {
      setFormData((prev) => {
        if (prev.sizes[index].size === nextSize) return prev;
        const isDuplicate = prev.sizes.some(
          (sizeEntry, sizeIndex) =>
            sizeIndex !== index && sizeEntry.size === nextSize
        );
        if (isDuplicate) return prev;
        const nextSizes = [...prev.sizes];
        nextSizes[index] = { ...nextSizes[index], size: nextSize };
        return { ...prev, sizes: nextSizes };
      });
    },
    []
  );

  const addSizeRow = useCallback(() => {
    setFormData((prev) => {
      const remaining = BASE_SIZES.filter(
        (size) => !prev.sizes.some((entry) => entry.size === size)
      );
      if (!remaining.length) return prev;
      return {
        ...prev,
        sizes: [...prev.sizes, { size: remaining[0], price: 0, stock: 0 }],
      };
    });
  }, []);

  const removeSizeRow = useCallback((index: number) => {
    setFormData((prev) => {
      if (prev.sizes.length === 1) return prev;
      return {
        ...prev,
        sizes: prev.sizes.filter((_, sizeIndex) => sizeIndex !== index),
      };
    });
  }, []);

  const handleHeroSelect = useCallback((imageUrl: string) => {
    setFormData((prev) => {
      const trimmed = imageUrl.trim();
      if (!trimmed || prev.image === trimmed) return prev;
      const nextGallery = prev.images.filter((image) => image !== trimmed);
      const previousHero = prev.image?.trim();
      if (
        previousHero &&
        previousHero !== trimmed &&
        previousHero !== DEFAULT_IMAGE_PRIMARY &&
        previousHero !== DEFAULT_IMAGE_SECONDARY
      ) {
        nextGallery.push(previousHero);
      }
      return {
        ...prev,
        image: trimmed,
        images: Array.from(new Set(nextGallery)),
      };
    });
  }, []);

  const handleAddImageLink = useCallback(() => {
    const candidate = newImageUrl.trim();
    if (!candidate) return;
    if (!/^https?:\/\//i.test(candidate)) return;
    setFormData((prev) => {
      if (prev.image === candidate || prev.images.includes(candidate)) return prev;
      return { ...prev, images: [...prev.images, candidate] };
    });
    setNewImageUrl("");
  }, [newImageUrl]);

  const handleUploadFromDevice = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) return;
      if (!file.type.startsWith("image/")) return;

      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => {
          if (prev.image === base64 || prev.images.includes(base64)) return prev;
          return { ...prev, images: [...prev.images, base64] };
        });
        setUploadingImage(false);
      };
      reader.onerror = () => {
        console.error("Failed to read image file.");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const removeImageByValue = useCallback((image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((stored) => stored !== image),
    }));
  }, []);

  const updateSizePrice = useCallback((index: number, value: string) => {
    setFormData((prev) => {
      const next = [...prev.sizes];
      next[index].price = parseFloat(value) || 0;
      return { ...prev, sizes: next };
    });
  }, []);

  const updateSizeStock = useCallback((index: number, value: string) => {
    setFormData((prev) => {
      const next = [...prev.sizes];
      next[index].stock = parseInt(value, 10) || 0;
      return { ...prev, sizes: next };
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = buildProductPayload(formData);
    if (!result.ok) return;
    await onSubmit(result.payload, product?._id);
  };

  const handleBackdropClick = useCallback(() => {
    if (!submitting) {
      onClose();
    }
  }, [submitting, onClose]);

  if (!open) return null;

  const inputClass =
    "w-full border-b border-black/20 bg-transparent px-0 py-2 text-sm text-black outline-none placeholder:text-black/30 focus:border-black transition-colors";
  const selectClass =
    "w-full appearance-none border-b border-black/20 bg-transparent px-0 py-2 pr-6 text-sm text-black outline-none focus:border-black transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl overflow-hidden border border-black/10 bg-white"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-1">
              {product ? "Edit" : "New"}
            </p>
            <h5 className="text-xl font-semibold tracking-[-0.02em] text-black">
              {product ? "Edit product" : "Create product"}
            </h5>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={submitting}
            className="flex h-8 w-8 items-center justify-center border border-black/10 text-black transition hover:bg-black/5 disabled:opacity-60"
          >
            <XIcon size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[80vh] flex-col"
          noValidate
        >
          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
            {/* Basic info */}
            <section className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
                Basic info
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Name *
                  </span>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    placeholder="Name of the coffee product"
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Country *
                  </span>
                  <input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    required
                    placeholder="Origin country"
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Category *
                  </span>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className={selectClass}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <CaretDownIcon
                      size={13}
                      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-black/40"
                    />
                  </div>
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                  Description *
                </span>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={3}
                  placeholder="Describe the coffee product"
                  className="w-full border-b border-black/20 bg-transparent px-0 py-2 text-sm text-black outline-none placeholder:text-black/30 focus:border-black transition-colors resize-none"
                />
              </label>
            </section>

            {/* Images */}
            <section className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/40 mb-0.5">
                    Images
                  </p>
                  <p className="text-xs text-black/40">
                    Select the hero image shown on product cards.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {heroOptions.map((image) => {
                  const isHero = formData.image === image;
                  const isDefault =
                    image === DEFAULT_IMAGE_PRIMARY ||
                    image === DEFAULT_IMAGE_SECONDARY;
                  const removable =
                    !isDefault && formData.images.includes(image);

                  return (
                    <div
                      key={image}
                      className={`relative overflow-hidden border transition ${
                        isHero
                          ? "border-black"
                          : "border-black/15 hover:border-black/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleHeroSelect(image)}
                        className="relative block h-full w-full text-left focus:outline-none"
                      >
                        <div className="relative h-24 w-full bg-black/5">
                          <Image
                            src={image}
                            alt="Product thumbnail"
                            fill
                            className="object-cover"
                            sizes="144px"
                            unoptimized
                          />
                        </div>
                        <span
                          className={`absolute bottom-1.5 right-1.5 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium ${
                            isHero
                              ? "bg-black text-white"
                              : "bg-white/95 text-black/60"
                          }`}
                        >
                          {isHero ? "Hero" : "Set"}
                        </span>
                      </button>

                      {removable && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImageByValue(image);
                          }}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center border border-black/15 bg-white text-black transition hover:bg-black/10"
                          aria-label="Remove image"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      Add by URL
                    </span>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.example.com/beans.jpg"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageLink}
                    className="shrink-0 border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-black/5"
                  >
                    Add
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileUploadInputRef.current?.click()}
                    className="inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-black/5"
                  >
                    <UploadIcon size={13} />
                    {uploadingImage ? "Uploading..." : "Upload"}
                  </button>
                  <input
                    ref={fileUploadInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadFromDevice}
                  />
                  <span className="text-xs text-black/40">
                    JPG, PNG up to 5MB.
                  </span>
                </div>
              </div>
            </section>

            {/* Sizes */}
            <section className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/40 mb-0.5">
                    Pricing & stock
                  </p>
                  <p className="text-xs text-black/40">
                    Set price and stock per bag size.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addSizeRow}
                  disabled={!canAddMoreSizes}
                  className="inline-flex items-center gap-1.5 border border-black/15 px-3 py-2 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <PlusIcon size={13} />
                  Add size
                </button>
              </div>

              <div className="divide-y divide-black/5 border border-black/10">
                {formData.sizes.map((sizeEntry, index) => (
                  <div
                    key={`${sizeEntry.size}-${index}`}
                    className="grid gap-4 bg-white px-5 py-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
                  >
                    <label className="block space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                        Size
                      </span>
                      <div className="relative">
                        <select
                          value={sizeEntry.size}
                          onChange={(e) =>
                            handleSizeSelect(
                              index,
                              e.target.value as ProductSize["size"]
                            )
                          }
                          className={selectClass}
                        >
                          {BASE_SIZES.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                        <CaretDownIcon
                          size={12}
                          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-black/40"
                        />
                      </div>
                    </label>

                    <label className="block space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                        Price (CHF)
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.05"
                        value={sizeEntry.price}
                        onChange={(e) => updateSizePrice(index, e.target.value)}
                        placeholder="0.00"
                        className={inputClass}
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                        Stock
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={sizeEntry.stock}
                        onChange={(e) => updateSizeStock(index, e.target.value)}
                        placeholder="0"
                        className={inputClass}
                      />
                    </label>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeSizeRow(index)}
                        disabled={formData.sizes.length === 1}
                        className="border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-black/10 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="border border-black/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-black/5 disabled:opacity-60"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-black px-4 py-2 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : product
                ? "Save changes"
                : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
