import Image from "next/image";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/content/copy-constants";
import { HOME_HERO_IMAGE } from "@/lib/shop/product-assets";

/**
 * Replaces the fake home "live configurator" (stock car crop ≠ framed product).
 * Real configure lives on PDP — this band only proves the object + sends to shop.
 */
export function SolutionSection({ previewSrc = HOME_HERO_IMAGE }: { previewSrc?: string }) {
  return (
    <div className="bg-bg-deep" style={{ padding: "clamp(3rem, 8vh, 6rem) 0" }}>
      <div className="frame-container">
        <div
          className="grid items-stretch gap-0 lg:grid-cols-12 border border-border"
          data-solution-preview
        >
          <div
            className="relative lg:col-span-7 min-h-[280px] lg:min-h-[420px] bg-bg-base"
          >
            <Image
              src={previewSrc}
              alt="Finished FrameClub diecast frame"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
          </div>

          <div
            className="lg:col-span-5 flex flex-col justify-center bg-bg-surface"
            style={{ padding: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            <p
              className="font-body uppercase text-text-muted"
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.28em",
                margin: 0,
                marginBottom: 16,
              }}
            >
              {COPY.solutionKicker}
            </p>
            <h2
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                lineHeight: 0.95,
                letterSpacing: "0.03em",
                margin: 0,
                marginBottom: 16,
                maxWidth: "14ch",
              }}
            >
              {COPY.solutionHeading}
            </h2>
            <p
              className="text-text-muted"
              style={{ fontSize: 15, lineHeight: 1.65, margin: 0, marginBottom: 28, maxWidth: 360 }}
            >
              {COPY.solutionBody}
            </p>
            <Button
              render={<TransitionLink href="/shop" />}
              variant="brand"
              size="lg"
              className="font-display uppercase w-fit"
              style={{ letterSpacing: "0.14em" }}
            >
              {COPY.solutionCta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
