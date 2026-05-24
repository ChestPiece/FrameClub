"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/layout/page-transition";
import { formatPkr } from "@/lib/utils";
import type { Product } from "@/lib/db/types";
import { FCHairline } from "@/components/home/fc-hairline";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};


type FeaturedCollectionSectionProps = {
  products: Product[];
};

export function FeaturedCollectionSection({
  products,
}: FeaturedCollectionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady || products.length === 0) return;
      const grid = gridRef.current;
      if (!grid) return;
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-featured-product-card]",
        grid,
      );
      if (cards.length !== products.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { y: 0, opacity: 1, clipPath: "none", clearProps: "all" });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          cards,
          { y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: { trigger: grid, start: "top 75%", once: true },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady, products] },
  );

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          marginBottom: 48,
          gap: 16,
        }}
      >
        <div>
          <p
            className="font-body text-text-muted"
            style={{ ...KICKER, marginBottom: 16 }}
          >
            Chapter Four · The Collection
          </p>
          <h2
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1,
              letterSpacing: "0.04em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Featured builds
          </h2>
        </div>
        <Button
          render={<TransitionLink href="/shop" />}
          variant="outline"
          className="font-display uppercase"
          style={{
            padding: "14px 22px",
            fontSize: 12,
            letterSpacing: "0.14em",
          }}
        >
          View all · {products.length}
        </Button>
      </div>

      <FCHairline />

      {products.length === 0 ? (
        <div style={{ marginTop: 32 }}>
          <EmptyState
            label="THE COLLECTION"
            title="COMING SOON"
            description="New frames are being added. Follow us on Instagram for updates."
            cta={{ label: "VISIT INSTAGRAM", href: "https://instagram.com/frameclub__" }}
          />
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginTop: 32,
          }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              data-featured-product-card
              data-motion-reveal
              className="group min-w-0"
              style={{ opacity: 0 }}
            >
              <TransitionLink
                href={`/shop/${product.slug}`}
                className="block"
              >
                <div
                  className="relative w-full overflow-hidden bg-bg-deep"
                  style={{ aspectRatio: "4/5", border: "0.5px solid var(--border-subtle)" }}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-6 grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                </div>
                <div style={{ paddingTop: 20 }}>
                  <div
                    className="flex items-start justify-between"
                    style={{ gap: 12, marginBottom: 8 }}
                  >
                    <h3
                      className="font-display uppercase text-text-primary"
                      style={{
                        fontSize: 20,
                        letterSpacing: "0.06em",
                        lineHeight: 1,
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {product.name}
                    </h3>
                    <span
                      className="font-display text-brand-bright shrink-0"
                      style={{
                        fontSize: 13,
                        letterSpacing: "0.14em",
                      }}
                    >
                      {formatPkr(product.price)}
                    </span>
                  </div>
                  <p
                    className="font-body uppercase text-text-muted"
                    style={{ ...KICKER, marginBottom: 12 }}
                  >
                    {product.brand}
                  </p>
                  <StatusBadge status={product.status} />
                </div>
              </TransitionLink>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
