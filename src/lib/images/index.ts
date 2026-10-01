// Pexels serves full, unsized originals (often several MB) unless asked
// otherwise — these params request a pre-compressed, appropriately sized
// JPEG directly from their CDN instead. `width` should be the largest size
// the image is ever rendered at; Next's own image optimizer handles the
// smaller breakpoints from there.
const px = (url: string, width: number) =>
  `${url}?auto=compress&cs=tinysrgb&w=${width}`;

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const HERO_IMAGE = px(
  "https://images.pexels.com/photos/4816479/pexels-photo-4816479.jpeg",
  1920,
);

// ─── Homepage ─────────────────────────────────────────────────────────────────
// Used for OriginsSection country cards
export const FEATURE_IMAGES = [
  "https://images.pexels.com/photos/7125492/pexels-photo-7125492.jpeg",
  "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg",
  "https://images.pexels.com/photos/30658797/pexels-photo-30658797.jpeg",
].map((url) => px(url, 800));

export const CTA_IMAGE = px(
  "https://images.pexels.com/photos/4820847/pexels-photo-4820847.jpeg",
  1920,
);

// ─── About ────────────────────────────────────────────────────────────────────
export const ABOUT_IMAGES = [
  "https://images.pexels.com/photos/7125434/pexels-photo-7125434.jpeg",
  "https://images.pexels.com/photos/29745520/pexels-photo-29745520.jpeg",
].map((url) => px(url, 1200));

export const STORY_IMAGES = [
  "https://images.pexels.com/photos/13819623/pexels-photo-13819623.jpeg",
  "https://images.pexels.com/photos/7125537/pexels-photo-7125537.jpeg",
  "https://images.pexels.com/photos/7125433/pexels-photo-7125433.jpeg",
  "https://images.pexels.com/photos/7125565/pexels-photo-7125565.jpeg",
  "https://images.pexels.com/photos/7125756/pexels-photo-7125756.jpeg",
  "https://images.pexels.com/photos/6439132/pexels-photo-6439132.jpeg",
].map((url) => px(url, 1000));

// randomuser.me already serves small, fixed-size portraits — no transform needed.
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
].map((url) => px(url, 1000));

// Changed from 4820846 — now uses a craft/roasting image from the pool
export const COLLECTION_CTA_IMAGE = px(
  "https://images.pexels.com/photos/7175961/pexels-photo-7175961.jpeg",
  1920,
);

// ─── Contact ──────────────────────────────────────────────────────────────────
export const CONTACT_LOCATION_IMAGES = [
  "https://images.pexels.com/photos/7125689/pexels-photo-7125689.jpeg",
  "https://images.pexels.com/photos/7125565/pexels-photo-7125565.jpeg",
  "https://images.pexels.com/photos/30658807/pexels-photo-30658807.jpeg",
].map((url) => px(url, 1000));

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
].map((url) => px(url, 900));

export const FLAVOUR_TABS = {
  flavor: px("https://images.pexels.com/photos/5461668/pexels-photo-5461668.jpeg", 1000),
  roast: px("https://images.pexels.com/photos/4816461/pexels-photo-4816461.jpeg", 1000),
  brew: px("https://images.pexels.com/photos/4820675/pexels-photo-4820675.jpeg", 1000),
} as const;

// ─── Static preload arrays ────────────────────────────────────────────────────
export const ABOUT_STATIC_IMAGES = [...ABOUT_IMAGES, ...STORY_IMAGES, ...TEAM_AVATARS];

export const COLLECTION_STATIC_IMAGES = [...QUALITY_IMAGES, COLLECTION_CTA_IMAGE];

export const CONTACT_STATIC_IMAGES = [...CONTACT_LOCATION_IMAGES];

export const PRODUCT_STATIC_IMAGES = [
  ...Object.values(FLAVOUR_TABS),
  ...MOMENTS_IMAGES,
];
