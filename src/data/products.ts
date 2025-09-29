import { Product } from "@/types/cart";

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    price: 24.99,
    image: "/mockup-coffee.png",
    description: "Bright, floral notes with citrus undertones",
    country: "Ethiopia",
    roast: "Light"
  },
  {
    id: 2,
    name: "Colombian Supremo",
    price: 22.99,
    image: "/mockup-coffee.png",
    description: "Rich, full-bodied with chocolate finish",
    country: "Colombia",
    roast: "Medium"
  },
  {
    id: 3,
    name: "Brazil Santos",
    price: 19.99,
    image: "/mockup-coffee.png",
    description: "Smooth, nutty flavor with low acidity",
    country: "Brazil",
    roast: "Medium"
  },
  {
    id: 4,
    name: "Guatemala Antigua",
    price: 26.99,
    image: "/mockup-coffee.png",
    description: "Medium body with spicy and smoky notes",
    country: "Guatemala",
    roast: "Medium-Dark"
  },
  {
    id: 5,
    name: "Costa Rica Tarrazú",
    price: 25.99,
    image: "/mockup-coffee.png",
    description: "Crisp acidity with wine-like characteristics",
    country: "Costa Rica",
    roast: "Light-Medium"
  },
  {
    id: 6,
    name: "Jamaica Blue Mountain",
    price: 42.99,
    image: "/mockup-coffee.png",
    description: "Mild flavor with excellent balance",
    country: "Jamaica",
    roast: "Medium"
  },
  {
    id: 7,
    name: "Kenya AA",
    price: 28.99,
    image: "/mockup-coffee.png",
    description: "Wine-like acidity with blackcurrant notes",
    country: "Kenya",
    roast: "Light-Medium"
  },
  {
    id: 8,
    name: "Peru Organic",
    price: 21.99,
    image: "/mockup-coffee.png",
    description: "Organic certification with caramel sweetness",
    country: "Peru",
    roast: "Medium"
  },
  {
    id: 9,
    name: "Sumatra Mandheling",
    price: 23.99,
    image: "/mockup-coffee.png",
    description: "Full body with earthy and herbal notes",
    country: "Indonesia",
    roast: "Dark"
  },
  {
    id: 10,
    name: "Yemen Mocha",
    price: 35.99,
    image: "/mockup-coffee.png",
    description: "Distinctive wine-like flavor with chocolate notes",
    country: "Yemen",
    roast: "Medium-Dark"
  },
  {
    id: 11,
    name: "Panama Geisha",
    price: 48.99,
    image: "/mockup-coffee.png",
    description: "Exotic floral aroma with jasmine and bergamot",
    country: "Panama",
    roast: "Light"
  },
  {
    id: 12,
    name: "Mexico Chiapas",
    price: 20.99,
    image: "/mockup-coffee.png",
    description: "Medium body with nutty and chocolate undertones",
    country: "Mexico",
    roast: "Medium-Dark"
  }
];

// Export roast options for filtering
export const roastLevels = [
  "Light",
  "Light-Medium", 
  "Medium",
  "Medium-Dark",
  "Dark"
] as const;

export type RoastLevel = typeof roastLevels[number];

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
  "Mexico"
] as const;

export type Country = typeof countries[number];