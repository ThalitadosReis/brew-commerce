// ─── Hero ─────────────────────────────────────────────────────────────────────
export const HERO_IMAGE =
  "https://images.pexels.com/photos/4816479/pexels-photo-4816479.jpeg";

// ─── Homepage ─────────────────────────────────────────────────────────────────
// Used for OriginsSection country cards
export const FEATURE_IMAGES = [
  "https://images.pexels.com/photos/7125492/pexels-photo-7125492.jpeg",
  "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg",
  "https://images.pexels.com/photos/30658797/pexels-photo-30658797.jpeg",
];

export const CTA_IMAGE =
  "https://images.pexels.com/photos/4820847/pexels-photo-4820847.jpeg";

// ─── About ────────────────────────────────────────────────────────────────────
export const ABOUT_IMAGES = [
  "https://images.pexels.com/photos/7125434/pexels-photo-7125434.jpeg",
  "https://images.pexels.com/photos/29745520/pexels-photo-29745520.jpeg",
];

export const STORY_IMAGES = [
  "https://images.pexels.com/photos/13819623/pexels-photo-13819623.jpeg",
  "https://images.pexels.com/photos/7125537/pexels-photo-7125537.jpeg",
  "https://images.pexels.com/photos/7125433/pexels-photo-7125433.jpeg",
  "https://images.pexels.com/photos/7125565/pexels-photo-7125565.jpeg",
  "https://images.pexels.com/photos/7125756/pexels-photo-7125756.jpeg",
  "https://images.pexels.com/photos/6439132/pexels-photo-6439132.jpeg",
];

export const TEAM_AVATARS = [
  "https://randomuser.me/api/portraits/women/45.jpg",
  "https://randomuser.me/api/portraits/men/31.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/67.jpg",
  "https://randomuser.me/api/portraits/men/12.jpg",
  "https://randomuser.me/api/portraits/women/51.jpg",
];

// ─── Collection ───────────────────────────────────────────────────────────────
export const QUALITY_IMAGES = [
  "https://images.pexels.com/photos/30658829/pexels-photo-30658829.jpeg",
  "https://images.pexels.com/photos/22679447/pexels-photo-22679447.jpeg",
  "https://images.pexels.com/photos/30658791/pexels-photo-30658791.jpeg",
];

// Changed from 4820846 — now uses a craft/roasting image from the pool
export const COLLECTION_CTA_IMAGE =
  "https://images.pexels.com/photos/7175961/pexels-photo-7175961.jpeg";

// ─── Contact ──────────────────────────────────────────────────────────────────
export const CONTACT_LOCATION_IMAGES = [
  "https://images.pexels.com/photos/7125689/pexels-photo-7125689.jpeg",
  "https://images.pexels.com/photos/7125565/pexels-photo-7125565.jpeg",
  "https://images.pexels.com/photos/30658807/pexels-photo-30658807.jpeg",
];

// ─── Products ─────────────────────────────────────────────────────────────────
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

export const FLAVOUR_TABS = {
  flavor: "https://images.pexels.com/photos/5461668/pexels-photo-5461668.jpeg",
  roast: "https://images.pexels.com/photos/4816461/pexels-photo-4816461.jpeg",
  brew: "https://images.pexels.com/photos/4820675/pexels-photo-4820675.jpeg",
} as const;

// ─── Static preload arrays ────────────────────────────────────────────────────
export const ABOUT_STATIC_IMAGES = [...ABOUT_IMAGES, ...STORY_IMAGES, ...TEAM_AVATARS];

export const COLLECTION_STATIC_IMAGES = [...QUALITY_IMAGES, COLLECTION_CTA_IMAGE];

export const CONTACT_STATIC_IMAGES = [...CONTACT_LOCATION_IMAGES];

export const PRODUCT_STATIC_IMAGES = [
  ...Object.values(FLAVOUR_TABS),
  ...MOMENTS_IMAGES,
];
