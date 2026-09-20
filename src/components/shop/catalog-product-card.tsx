import Image from "next/image";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Product } from "@/lib/db/types";
import { FOOTBALL_FRAME_COPY } from "@/lib/content/copy-constants";
import { formatPkr } from "@/lib/utils";

type CatalogProductCardProps = {
  product: Product;
};

const isStudioReference = (src: string) => src.startsWith("/Assets/");

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const defaultBackground = product.backgrounds[0]?.value ?? "carbon-grid";
  const quickAddHref = `/checkout?slug=${encodeURIComponent(product.slug)}&background=${encodeURIComponent(defaultBackground)}`;
  const isFootball = product.category === "football";
  const quoteHref = `/contact?intent=custom-frame&product=${encodeURIComponent(product.slug)}`;
  const heroSrc = product.images[0] ?? "";
  const showReferenceNote = isStudioReference(heroSrc);

  return (
    <article
      data-animate-item
      data-flip-card
      data-reveal
      className={`group flex flex-col overflow-hidden rounded-lg border border-border/60 bg-bg-deep transition-[border-color] duration-200 ${
        product.status === "unavailable" ? "opacity-75" : "opacity-100"
      }`}
    >
      <TransitionLink href={`/shop/${product.slug}`} className="block cursor-pointer">
        <div className="relative overflow-hidden bg-bg-base">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={heroSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-6 opacity-95 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>

          <div className="absolute left-3 top-3 z-20">
            <StatusBadge status={product.status} />
          </div>

          {showReferenceNote ? (
            <p
              className="absolute bottom-3 left-3 font-body uppercase text-text-muted"
              style={{ fontSize: 9, letterSpacing: "0.2em", margin: 0 }}
            >
              Studio reference
            </p>
          ) : null}
        </div>

        <div className="border-t border-border/50 p-6">
          <h2 className="display-kicker text-xl sm:text-2xl leading-none">{product.name}</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-muted">{product.brand}</p>
        </div>
      </TransitionLink>

      <div className="mt-auto space-y-3 px-6 pb-6">
        <div className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2.5">
          <span className="technical-label text-[10px] text-text-muted">Price</span>
          <span className="display-kicker text-sm text-text-primary">
            {isFootball ? FOOTBALL_FRAME_COPY.priceLine : formatPkr(product.price)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            render={<TransitionLink href={`/shop/${product.slug}`} />}
            variant="outline"
            className="display-kicker min-touch-target w-full justify-center"
          >
            Configure
          </Button>

          {isFootball ? (
            <Button
              render={<TransitionLink href={quoteHref} />}
              variant="brand"
              className="display-kicker min-touch-target w-full justify-center"
            >
              {FOOTBALL_FRAME_COPY.cardCta}
            </Button>
          ) : product.status === "unavailable" ? (
            <Button
              render={<TransitionLink href={`/contact?product=${encodeURIComponent(product.slug)}`} />}
              variant="muted"
              className="display-kicker min-touch-target w-full justify-center"
            >
              Notify Me
            </Button>
          ) : product.status === "preorder" ? (
            <Button
              render={<TransitionLink href={quickAddHref} />}
              variant="brand"
              className="display-kicker min-touch-target w-full justify-center"
            >
              Pre-Order
            </Button>
          ) : (
            <Button
              render={<TransitionLink href={quickAddHref} />}
              variant="brand"
              className="display-kicker min-touch-target w-full justify-center"
            >
              Order
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
