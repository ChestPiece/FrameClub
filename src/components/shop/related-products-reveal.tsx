"use client";

import * as React from "react";
import { useStaggerReveal } from "@/lib/animation";

type RelatedProductsRevealProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Tiny client wrapper that applies the shared stagger reveal to its
 * `[data-reveal]` children. Used by `related-products-section.tsx` so the
 * server component stays minimal.
 */
export function RelatedProductsReveal({ children, className }: RelatedProductsRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  useStaggerReveal(ref, [], { each: 0.07, distance: 28, duration: 0.7, start: "top 90%" });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
