import type { ProductCategory } from "@/lib/db/types";

/**
 * Per-slug product photography served from `public/Assets/Cars/`.
 * Temporary studio references until DB `images` are populated — catalog
 * labels these "Studio reference" so we don't fake unique photography.
 */
const PRODUCT_IMAGE_MAP: Record<string, string[]> = {
  // Cars
  "nissan-gtr": ["/Assets/Cars/gtr.jpg"],
  "gtr": ["/Assets/Cars/gtr.jpg"],
  "porsche": ["/Assets/Cars/porsche.jpg"],
  "porsche-911": ["/Assets/Cars/porsche.jpg"],
  "pagani": ["/Assets/Cars/pagani.jpg"],
  "pagani-huayra": ["/Assets/Cars/pagani.jpg"],
  "lamborghini": ["/Assets/Cars/lamborghini.jpg"],
  "lamborghini-aventador": ["/Assets/Cars/lamborghini.jpg"],
  "bugatti": ["/Assets/Cars/bugatti.jpg"],
  "bugatti-chiron": ["/Assets/Cars/bugatti.jpg"],

  // Football frames
  "custom-football-frame-classic": [
    "/Assets/Cars/FootballFrames/footbal frmaes.jpg",
  ],
  "custom-football-frame-modern": [
    "/Assets/Cars/FootballFrames/footballframe2.jpg",
  ],
};

const FALLBACK_BY_CATEGORY: Record<ProductCategory, string[]> = {
  diecast: ["/Assets/Cars/gtr.jpg"],
  football: ["/Assets/Cars/FootballFrames/footbal frmaes.jpg"],
};

export function productImages(slug: string, category: ProductCategory = "diecast"): string[] {
  return PRODUCT_IMAGE_MAP[slug] ?? FALLBACK_BY_CATEGORY[category];
}

export const HOME_HERO_IMAGE = "/Assets/Cars/frame_club intro image.jpg";

/**
 * Kinetic hero marquee imagery — used in the scroll-pinned Act 2 of the home hero.
 * Order is the on-screen scrub order; labels feed the vertical Bebas marquee.
 */
export const HERO_MARQUEE_IMAGES: ReadonlyArray<{ src: string; label: string; alt: string }> = [
  { src: "/Assets/Cars/bugatti.jpg",     label: "BUGATTI",     alt: "Bugatti diecast frame" },
  { src: "/Assets/Cars/gtr.jpg",         label: "GTR",         alt: "Nissan GTR diecast frame" },
  { src: "/Assets/Cars/lamborghini.jpg", label: "LAMBORGHINI", alt: "Lamborghini diecast frame" },
  { src: "/Assets/Cars/pagani.jpg",      label: "PAGANI",      alt: "Pagani diecast frame" },
  { src: "/Assets/Cars/porsche.jpg",     label: "PORSCHE",     alt: "Porsche diecast frame" },
] as const;

export const HERO_HANDOFF_IMAGE = "/Assets/Cars/lamborghini.jpg";
