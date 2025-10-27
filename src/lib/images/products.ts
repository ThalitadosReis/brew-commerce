// CoffeeCraft
export const CRAFT_IMAGE =
  "https://images.pexels.com/photos/7175961/pexels-photo-7175961.jpeg";

// Flavour tabs
export const FLAVOUR_TABS = {
  flavor: "https://images.pexels.com/photos/5461668/pexels-photo-5461668.jpeg",
  roast: "https://images.pexels.com/photos/4816461/pexels-photo-4816461.jpeg",
  brew: "https://images.pexels.com/photos/4820675/pexels-photo-4820675.jpeg",
} as const;

// Coffee Moments
export const MOMENTS_IMAGES = [
  "https://images.pexels.com/photos/6439132/pexels-photo-6439132.jpeg",
  "https://images.pexels.com/photos/7125756/pexels-photo-7125756.jpeg",
  "https://images.pexels.com/photos/7125537/pexels-photo-7125537.jpeg",
  "https://images.pexels.com/photos/7125433/pexels-photo-7125433.jpeg",
  "https://images.pexels.com/photos/7125689/pexels-photo-7125689.jpeg",
  "https://images.pexels.com/photos/7125565/pexels-photo-7125565.jpeg",
  "https://images.pexels.com/photos/13819623/pexels-photo-13819623.jpeg",
  "https://images.pexels.com/photos/30658807/pexels-photo-30658807.jpeg",
];

export const PRODUCT_STATIC_IMAGES = [
  CRAFT_IMAGE,
  ...MOMENTS_IMAGES,
  FLAVOUR_TABS.flavor,
  FLAVOUR_TABS.roast,
  FLAVOUR_TABS.brew,
];
