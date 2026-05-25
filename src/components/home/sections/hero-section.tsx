import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/layout/page-transition";
import { COPY } from "@/lib/content/copy-constants";
import { HERO_MARQUEE_IMAGES } from "@/lib/shop/product-assets";
import { HeroSectionAnimations } from "./hero-section-animations";

export function HeroSection() {
  const headlineSentence = COPY.heroHeadingLines.join(" ");
  const marqueeLabels = HERO_MARQUEE_IMAGES.map((m) => m.label);

  return (
    <section
      id="hero-section"
      data-animate-section="hero"
      className="relative overflow-hidden bg-bg-deep texture-overlay"
    >
      {/* Radial vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 88%, color-mix(in srgb, var(--brand) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* ============ ACT 1 — IGNITION ============ */}
        <div
          data-hero-act="1"
          className="relative flex flex-col justify-end"
          style={{
            minHeight: "min(78vh, 760px)",
            paddingTop: "calc(6rem + 8px)",
            paddingBottom: 48,
          }}
        >
          <div
            className="mx-auto w-full"
            style={{ width: "min(calc(100% - 2rem), 80rem)" }}
          >
            {/* Eyebrow rule */}
            <div
              className="grid items-center"
              style={{
                gridTemplateColumns: "auto 1fr",
                gap: 20,
                marginBottom: 28,
              }}
            >
              <p
                data-animate="hero-label"
                className="font-body uppercase text-text-muted"
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.32em",
                  margin: 0,
                }}
              >
                {COPY.heroEyebrow}
              </p>
              <span
                data-animate="hero-accent"
                aria-hidden="true"
                className="block bg-brand-bright"
                style={{ height: 1, width: "100%", transformOrigin: "left center" }}
              />
            </div>

            {/* Headline */}
            <h1
              data-animate="hero-heading"
              data-hero-headline
              aria-label={headlineSentence}
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(2.25rem, 8vw, 7.5rem)",
                lineHeight: 0.9,
                letterSpacing: "0.01em",
                margin: 0,
                marginBottom: 28,
                fontWeight: 400,
              }}
            >
              {COPY.heroHeadingLines.map((line, i) => (
                <span key={line} data-hero-line className="block" aria-hidden="true">
                  {i === COPY.heroHeadingLines.length - 1 ? (
                    <span className="text-brand-bright">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            {/* Sub + CTAs row */}
            <div
              className="grid items-end"
              style={{
                gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                gap: 32,
              }}
            >
              <p
                data-hero-sub
                className="text-text-muted"
                style={{
                  maxWidth: 480,
                  fontSize: 15,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {COPY.heroSub}
              </p>

              <div
                data-hero-ctas
                className="flex flex-wrap items-center"
                style={{ gap: 16, justifyContent: "flex-end" }}
              >
                <Button
                  render={<TransitionLink href="/shop" />}
                  variant="brand"
                  size="lg"
                  className="font-display uppercase"
                  style={{ letterSpacing: "0.14em" }}
                >
                  {COPY.heroCta} →
                </Button>
                <Button
                  render={<TransitionLink href="/about" />}
                  variant="ghost"
                  size="lg"
                  className="font-display uppercase"
                  style={{ letterSpacing: "0.14em" }}
                >
                  {COPY.heroCtaSecondary}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer rule of act 1 */}
          <svg
            aria-hidden="true"
            data-hero-svg-accent
            className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
            viewBox="0 0 1440 1"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="0.5" x2="1440" y2="0.5" stroke="var(--brand)" strokeWidth="1" />
          </svg>
        </div>

        {/* ============ ACT 2 — MARQUEE REVEAL ============ */}
        <div
          data-hero-act="2"
          className="relative bg-bg-base"
          style={{ paddingTop: 56, paddingBottom: 56, minHeight: "min(72vh, 680px)" }}
        >
          <div
            className="mx-auto"
            style={{ width: "min(calc(100% - 2rem), 80rem)" }}
          >
            <div
              className="grid items-center"
              style={{
                gridTemplateColumns: "auto 1fr auto",
                gap: 24,
                marginBottom: 28,
              }}
            >
              <p
                className="font-body uppercase text-text-muted"
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.32em",
                  margin: 0,
                }}
              >
                The Collection · 05 Builds
              </p>
              <span aria-hidden="true" className="block" style={{ height: 1, background: "var(--border)" }} />
              <p
                className="font-body uppercase text-text-muted"
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.32em",
                  margin: 0,
                }}
              >
                Scroll →
              </p>
            </div>
          </div>

          {/* Horizontal photo strip scrub */}
          <div
            data-hero-marquee-viewport
            className="relative overflow-hidden"
            style={{ height: "min(40vh, 360px)" }}
          >
            <div
              data-hero-marquee-track
              className="flex h-full"
              style={{ gap: 24, paddingInline: "5vw", willChange: "transform" }}
            >
              {HERO_MARQUEE_IMAGES.map((img) => (
                <figure
                  key={img.src}
                  data-hero-marquee-item
                  className="relative flex-none bg-bg-surface"
                  style={{
                    width: "min(40vh, 360px)",
                    height: "100%",
                    aspectRatio: "1 / 1",
                    borderBottom: "1px solid color-mix(in srgb, var(--brand-bright) 60%, transparent)",
                    willChange: "transform",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 80vw, 40vw"
                    className="object-cover"
                  />
                  <figcaption
                    className="font-display uppercase text-text-primary"
                    style={{
                      position: "absolute",
                      left: 16,
                      bottom: 16,
                      fontSize: 14,
                      letterSpacing: "0.18em",
                      background: "rgba(14,14,14,0.78)",
                      padding: "8px 12px",
                    }}
                  >
                    {img.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

        </div>

        {/* ============ ACT 3 — HANDOFF ============ */}
        <div
          data-hero-act="3"
          className="relative flex items-center justify-center bg-bg-deep"
          style={{ minHeight: "32vh", paddingBlock: 48 }}
        >
          <div
            className="mx-auto flex flex-col items-center"
            style={{ width: "min(calc(100% - 2rem), 64rem)", gap: 16 }}
          >
            <p
              className="font-body uppercase text-text-muted"
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.32em",
                margin: 0,
              }}
            >
              Your Build Starts Here
            </p>
            <TransitionLink
              href="/shop"
              data-hero-handoff
              data-button-motion="true"
              data-button-motion-level="strong"
              className="font-display uppercase text-text-primary group inline-flex items-center justify-center"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
                lineHeight: 0.95,
                letterSpacing: "0.02em",
                margin: 0,
                textAlign: "center",
                gap: "0.4em",
                cursor: "pointer",
                textDecoration: "none",
              }}
              aria-label={`${COPY.heroHandoff} — Explore the collection`}
            >
              <span data-hero-handoff-text>{COPY.heroHandoff}</span>
              <span
                data-hero-handoff-arrow
                aria-hidden="true"
                className="text-brand-bright inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              >
                →
              </span>
            </TransitionLink>
          </div>
        </div>

        {/* Vertical kinetic marquee (decorative, fixed right edge during Act 2) */}
        <div
          aria-hidden="true"
          role="presentation"
          data-hero-vert-marquee
          className="pointer-events-none absolute top-0 right-0 hidden lg:flex"
          style={{
            height: "100%",
            width: 56,
            overflow: "hidden",
            borderLeft: "0.5px solid var(--border-subtle)",
          }}
        >
          <div
            data-hero-vert-track
            className="font-display uppercase text-text-muted"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: 14,
              letterSpacing: "0.32em",
              lineHeight: 1.1,
              paddingBlock: 24,
              whiteSpace: "nowrap",
              willChange: "transform",
            }}
          >
            {[...marqueeLabels, ...marqueeLabels, ...marqueeLabels].join("   ·   ")}
          </div>
        </div>
      </div>

      <HeroSectionAnimations />
    </section>
  );
}
