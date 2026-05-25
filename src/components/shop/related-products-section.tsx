import Image from "next/image";
import { TransitionLink } from "@/components/layout/page-transition";
import { formatPkr } from "@/lib/utils";
import type { Product } from "@/lib/db/types";
import { RelatedProductsReveal } from "@/components/shop/related-products-reveal";

type RelatedProductsSectionProps = {
  related: Product[];
};

export function RelatedProductsSection({ related }: RelatedProductsSectionProps) {
  if (related.length === 0) return null;

  return (
    <section className="frame-container py-28">
      <h2 className="display-kicker text-4xl leading-none sm:text-5xl md:text-6xl">YOU MIGHT ALSO LIKE</h2>
      <p className="mt-4 text-text-muted">Other frames you might obsess over.</p>

      <RelatedProductsReveal className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {related.map((item) => (
          <article key={item.id} data-reveal className="group">
            <div className="relative mb-5 aspect-4/5 overflow-hidden bg-bg-deep">
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain p-6 transition duration-700"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
                <span className="display-kicker border border-bg-base bg-text-primary px-6 py-2 text-xs text-bg-base">
                  VIEW FRAME
                </span>
              </div>
            </div>

            <h3 className="display-kicker text-3xl leading-none">{item.name}</h3>
            <p className="mt-1 text-sm text-text-muted">{formatPkr(item.price)}</p>
            <TransitionLink href={`/shop/${item.slug}`} className="sr-only">
              View {item.name}
            </TransitionLink>
          </article>
        ))}
      </RelatedProductsReveal>
    </section>
  );
}
