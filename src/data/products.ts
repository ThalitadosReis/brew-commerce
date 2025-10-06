import { Product } from "@/types/cart";

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    price: 24.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Bright, floral notes with citrus undertones",
    country: "Ethiopia",
    roast: "Light",
    sizes: ["250g", "500g", "1kg"],
  },
  {
    id: 2,
    name: "Colombian Supremo",
    price: 22.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Rich, full-bodied with chocolate finish",
    country: "Colombia",
    roast: "Medium",
    sizes: ["250g", "500g", "1kg"],
  },
  {
    id: 3,
    name: "Brazil Santos",
    price: 19.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Smooth, nutty flavor with low acidity",
    country: "Brazil",
    roast: "Medium",
    sizes: ["250g", "500g"],
  },
  {
    id: 4,
    name: "Guatemala Antigua",
    price: 26.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Medium body with spicy and smoky notes",
    country: "Guatemala",
    roast: "Medium-Dark",
    sizes: ["500g", "1kg"],
  },
  {
    id: 5,
    name: "Tarrazú",
    price: 25.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Crisp acidity with wine-like characteristics",
    country: "Costa Rica",
    roast: "Light-Medium",
    sizes: ["250g", "500g", "1kg"],
  },
  {
    id: 6,
    name: "Blue Mountain",
    price: 42.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Mild flavor with excellent balance",
    country: "Jamaica",
    roast: "Medium",
    sizes: ["250g"],
  },
  {
    id: 7,
    name: "Kenya AA",
    price: 28.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Wine-like acidity with blackcurrant notes",
    country: "Kenya",
    roast: "Light-Medium",
    sizes: ["250g", "500g", "1kg"],
  },
  {
    id: 8,
    name: "Peru Organic",
    price: 21.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Organic certification with caramel sweetness",
    country: "Peru",
    roast: "Medium",
    sizes: ["500g", "1kg"],
  },
  {
    id: 9,
    name: "Sumatra Mandheling",
    price: 23.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Full body with earthy and herbal notes",
    country: "Indonesia",
    roast: "Dark",
    sizes: ["250g", "500g"],
  },
  {
    id: 10,
    name: "Yemen Mocha",
    price: 35.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Distinctive wine-like flavor with chocolate notes",
    country: "Yemen",
    roast: "Medium-Dark",
    sizes: ["250g", "500g", "1kg"],
  },
  {
    id: 11,
    name: "Panama Geisha",
    price: 48.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Exotic floral aroma with jasmine and bergamot",
    country: "Panama",
    roast: "Light",
    sizes: ["250g", "500g"],
  },
  {
    id: 12,
    name: "Mexico Chiapas",
    price: 20.99,
    images: ["/images/mockup-coffee.png", "/images/mockup-coffee2.jpg"],
    description: "Medium body with nutty and chocolate undertones",
    country: "Mexico",
    roast: "Medium-Dark",
    sizes: ["250g", "500g", "1kg"],
  },
];

// Export roast options for filtering
export const roastLevels = [
  "Light",
  "Light-Medium",
  "Medium",
  "Medium-Dark",
  "Dark",
] as const;

export type RoastLevel = (typeof roastLevels)[number];

// Export countries for filtering
export const countries = [
  "Ethiopia",
  "Colombia",
  "Brazil",
  "Guatemala",
  "Costa Rica",
  "Jamaica",
  "Kenya",
  "Peru",
  "Indonesia",
  "Yemen",
  "Panama",
  "Mexico",
] as const;

export type Country = (typeof countries)[number];

// Export sizes for filtering
export const sizes = ["250g", "500g", "1kg"] as const;

export type Size = (typeof sizes)[number];
