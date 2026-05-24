import Image from "next/image";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Product } from "@/lib/db/types";
import { formatPkr } from "@/lib/utils";

type CatalogProductCardProps = {
  product: Product;
};

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const defaultBackground = product.backgrounds[0]?.value ?? "carbon-grid";
  const quickAddHref = `/checkout?slug=${encodeURIComponent(product.slug)}&background=${encodeURIComponent(defaultBackground)}`;

  return (
    <article
      data-animate-item
      data-flip-card
      data-reveal
      data-tilt
      className={`group flex flex-col bg-bg-elevated transition-colors duration-300 ${
        product.status === "unavailable" ? "opacity-75" : "opacity-100"
      }`}
    >
      <TransitionLink href={`/shop/${product.slug}`} className="block cursor-pointer">
        <div className="relative overflow-hidden bg-bg-deep">
          <div className="relative aspect-4/3 w-full overflow-hidden will-change-transform">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-5 sm:p-8 opacity-95 transition-[opacity,transform] duration-500 ease-out motion-safe:group-hover:scale-[1.04] group-hover:opacity-100"
            />
            <div className="absolute right-4 top-4 z-10 rotate-12 border border-brand bg-bg-surface/80 px-2 py-1 text-[10px] uppercase tracking-widest text-brand backdrop-blur-sm">
              MADE TO ORDER
            </div>
          </div>

          <div className="absolute left-4 top-4 z-20">
            <StatusBadge status={product.status} />
          </div>
        </div>

        <div className="border-t-2 border-border/50 p-8 transition-colors duration-300 group-hover:border-brand">
          <h2 className="display-kicker text-xl sm:text-2xl leading-none">{product.name}</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-muted">{product.brand}</p>
          <p className="mt-4 line-clamp-2 text-sm text-text-muted">{product.description}</p>
        </div>
      </TransitionLink>

      <div className="mt-auto space-y-4 px-8 pb-8">
        <div className="flex items-center justify-between bg-bg-deep px-3 py-2.5">
          <span className="technical-label text-[10px] text-text-muted">Price</span>
          <span className="display-kicker text-sm text-text-primary">{formatPkr(product.price)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            render={<TransitionLink href={`/shop/${product.slug}`} />}
            variant="outline"
            className="display-kicker min-touch-target w-full justify-center"
          >
            View Specs
          </Button>

          {product.status === "unavailable" ? (
            <Button
              render={<TransitionLink href={`/contact?product=${encodeURIComponent(product.slug)}`} />}
              variant="muted"
              className="display-kicker min-touch-target w-full justify-center"
            >
              Notify Me
            </Button>
          ) : (
            <Button
              render={<TransitionLink href={quickAddHref} />}
              variant="brand"
              className="display-kicker min-touch-target w-full justify-center"
            >
              Quick Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
