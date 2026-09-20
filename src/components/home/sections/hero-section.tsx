import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/layout/page-transition";
import { COPY } from "@/lib/content/copy-constants";
import { HOME_HERO_IMAGE } from "@/lib/shop/product-assets";
import { HeroSectionAnimations } from "./hero-section-animations";

/** H3 split: dark type panel (legible) + framed object plane. No scramble on brand. */
export function HeroSection() {
  const headlineSentence = COPY.heroHeadingLines.join(" ");

  return (
    <section
      id="hero-section"
      data-animate-section="hero"
      className="relative overflow-hidden bg-bg-deep"
    >
      <div
        className="grid min-h-[100svh] lg:grid-cols-2"
        style={{ paddingTop: "var(--site-header-height)" }}
      >
        {/* Type panel — guaranteed contrast */}
        <div
          className="relative z-10 flex flex-col justify-center bg-bg-deep order-2 lg:order-1"
          style={{
            padding: "clamp(2.5rem, 6vh, 4rem) clamp(1.25rem, 4vw, 3.5rem)",
            minHeight: "min(52svh, 520px)",
          }}
        >
          <p
            data-animate="hero-label"
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              margin: 0,
              marginBottom: 16,
            }}
          >
            {COPY.brandName}
          </p>

          <div
            data-animate="hero-accent"
            aria-hidden="true"
            className="bg-brand-bright"
            style={{ height: 2, width: 56, marginBottom: 24, transformOrigin: "left center" }}
          />

          <h1
            data-animate="hero-heading"
            aria-label={headlineSentence}
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
              lineHeight: 0.98,
              letterSpacing: "0.04em",
              margin: 0,
              marginBottom: 18,
              fontWeight: 400,
              maxWidth: "14ch",
            }}
          >
            {COPY.heroHeadingLines.map((line, i) => (
              <span key={line} className="block" aria-hidden="true">
                {i === COPY.heroHeadingLines.length - 1 ? (
                  <span className="text-brand-bright">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p
            data-hero-sub
            className="text-text-muted"
            style={{
              maxWidth: 380,
              fontSize: 15,
              lineHeight: 1.65,
              margin: 0,
              marginBottom: 28,
            }}
          >
            {COPY.heroSub}
          </p>

          <div data-hero-ctas className="flex flex-wrap items-center" style={{ gap: 12 }}>
            <Button
              render={<TransitionLink href="/shop" />}
              variant="brand"
              size="lg"
              className="font-display uppercase"
              style={{ letterSpacing: "0.14em" }}
            >
              {COPY.heroCta}
            </Button>
            <Button
              render={<TransitionLink href="#letter-section" />}
              variant="ghost"
              size="lg"
              className="font-display uppercase"
              style={{ letterSpacing: "0.14em" }}
            >
              {COPY.heroCtaSecondary}
            </Button>
          </div>
        </div>

        {/* Object plane */}
        <div
          data-hero-media
          className="relative order-1 lg:order-2 min-h-[42svh] lg:min-h-full"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          <Image
            src={HOME_HERO_IMAGE}
            alt="Framed diecast sculpture by FrameClub"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                "linear-gradient(to bottom, transparent 55%, var(--bg-deep) 100%)",
            }}
          />
        </div>
      </div>

      <HeroSectionAnimations />
    </section>
  );
}
