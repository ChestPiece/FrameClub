import type { ProductCategory } from "@/lib/db/types";

/**
 * Per-slug product photography served from `public/Assets/Cars/`.
 * Add entries here when seeding new products so the catalog and detail pages
 * have a real image even if the DB row's `images` column is empty.
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
