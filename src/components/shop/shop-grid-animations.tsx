"use client";

import * as React from "react";
import { useStaggerReveal, useCardTilt } from "@/lib/animation";

type ShopGridAnimationsProps = {
  children: React.ReactNode;
  /**
   * Hash of active filter/sort. When it changes, stagger reveal re-fires so the
   * new visible cards animate in. (Cards fully remount on filter change, so a
   * Flip-based reorder is unnecessary.)
   */
  filterSignal?: string;
};

/**
 * Client wrapper around the shop grid. Wires the shared stagger-reveal +
 * card-tilt primitives via the `[data-reveal]` / `[data-tilt]` contract.
 *
 * Pin/ScrollTrigger logic for the grid itself lives in `shop-animations.tsx`
 * and is intentionally not touched here.
 */
export function ShopGridAnimations({ children, filterSignal = "" }: ShopGridAnimationsProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  useStaggerReveal(rootRef, [filterSignal], {
    each: 0.06,
    distance: 32,
    duration: 0.7,
    start: "top 90%",
  });

  useCardTilt(rootRef, { max: 5, scale: 1.015 });

  return (
    <div ref={rootRef} data-shop-grid-anim>
      {children}
    </div>
  );
}
