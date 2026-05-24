import Image from "next/image";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { TransitionLink } from "@/components/layout/page-transition";
import { HomeAnimations } from "@/components/home/home-animations";
import { HomeSectionScroll } from "@/components/home/home-section-scroll";
import { WhatIsThisSection } from "@/components/home/what-is-this-section";
import { LetterSection } from "@/components/home/letter-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { FeaturedCollectionSection } from "@/components/home/featured-collection-section";
import { CustomizationSection } from "@/components/home/customization-section";
import { SocialProofSection } from "@/components/home/social-proof-section";
import { FinalCTASection } from "@/components/home/final-cta-section";
import { Button } from "@/components/ui/button";
import { DIECAST_PRODUCT_IMAGES } from "@/lib/shop/diecast-assets";
import { getProducts } from "@/lib/shop/data";

const HERO_STATS = [
  { k: "Standard lead", v: "07 days" },
  { k: "Unit price", v: "Rs. 5,000" },
  { k: "Frames built", v: "50+" },
];

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 3);
  const totalProductCount = allProducts.length;
  const heroProduct = featuredProducts[0];
  const heroImage = heroProduct?.images[0] ?? DIECAST_PRODUCT_IMAGES[0];
  const heroBrand = heroProduct?.brand ?? "Frame Club";
  const heroName = heroProduct?.name ?? "Featured Build";
  const heroSku = "FC-001";

  return (
    <>
      <Suspense fallback={null}>
        <HomeSectionScroll />
      </Suspense>
      <main id="main-content" className="scroll-margin-site-header pb-0">
        <HomeAnimations>
          <section
            id="hero-section"
            data-animate-section="hero"
            className="scroll-margin-site-header relative overflow-hidden bg-bg-deep texture-overlay"
            style={{ paddingTop: "calc(7.5rem + 64px)", paddingBottom: 96 }}
          >
            <div
              className="pointer-events-none absolute"
              style={{
                left: "-12vw",
                bottom: "-12vw",
                width: "60vw",
                height: "60vw",
                background:
                  "radial-gradient(circle at bottom left, color-mix(in srgb, var(--brand) 32%, transparent), transparent 60%)",
              }}
            />
            <div id="hero-pin-target" className="relative z-10">
              <div
                className="mx-auto"
                style={{ width: "min(calc(100% - 2rem), 80rem)" }}
              >
                {/* Meta band */}
                <div
                  data-fc-rise
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 32,
                    paddingBottom: 28,
                    marginBottom: 64,
                  }}
                >
                  <p
                    data-animate="hero-label"
                    className="font-body uppercase text-text-muted"
                    style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.28em" }}
                  >
                    Vol. 04 / 2026
                  </p>
                  <div style={{ height: 1, background: "var(--border)" }} />
                  <p
                    className="font-body uppercase text-text-muted"
                    style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.28em" }}
                  >
                    Handcrafted · Pakistan
                  </p>
                </div>

                <div
                  className="hero-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 0.9fr",
                    gap: 80,
                    alignItems: "center",
                  }}
                >
                    {/* LEFT */}
                    <div className="flex flex-col" style={{ gap: 40 }}>
                      <span
                        data-animate="hero-accent"
                        className="block bg-brand-bright"
                        style={{ width: 96, height: 1 }}
                      />
                      <h1
                        data-animate="hero-heading"
                        data-hero-headline
                        className="font-display uppercase text-text-primary"
                        style={{
                          fontSize: "clamp(3.5rem, 7.4vw, 6.5rem)",
                          lineHeight: 0.92,
                          letterSpacing: "0.03em",
                          margin: 0,
                          fontWeight: 400,
                        }}
                      >
                        <span data-hero-line className="block">Your favourite</span>
                        <span data-hero-line className="block">
                          <span className="text-brand-bright">car.</span> framed.
                        </span>
                        <span data-hero-line className="block">
                          <span className="text-brand-mid">forever.</span>
                        </span>
                      </h1>

                      <div data-hero-pin="subcopy-group">
                        <p
                          data-fc-rise
                          className="text-text-muted"
                          style={{
                            maxWidth: 520,
                            fontSize: 17,
                            lineHeight: 1.75,
                            margin: 0,
                          }}
                        >
                          Custom diecast frames, built one at a time in a Lahore workshop and shipped nationwide. A single price. Endless configurations. Zero compromise.
                        </p>

                        <div
                          data-fc-rise
                          className="flex flex-wrap items-center"
                          style={{ gap: 16, marginTop: 32 }}
                        >
                          <Button
                            render={<TransitionLink href="/shop" />}
                            variant="brand"
                            size="lg"
                            className="font-display uppercase"
                            style={{ letterSpacing: "0.14em" }}
                          >
                            ORDER YOUR FRAME →
                          </Button>
                          <Button
                            render={<TransitionLink href="/about" />}
                            variant="ghost"
                            size="lg"
                            className="font-display"
                          >
                            Read the story
                          </Button>
                        </div>

                        <div
                          data-fc-rise
                          className="grid"
                          style={{
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 24,
                            paddingTop: 32,
                            marginTop: 32,
                            borderTop: "0.5px solid var(--border-subtle)",
                          }}
                        >
                          {HERO_STATS.map((stat) => (
                            <div key={stat.k}>
                              <p
                                className="font-body uppercase text-text-muted"
                                style={{
                                  fontSize: 11,
                                  fontWeight: 500,
                                  letterSpacing: "0.28em",
                                  marginBottom: 8,
                                }}
                              >
                                {stat.k}
                              </p>
                              <span
                                className="font-display uppercase text-text-primary"
                                style={{ fontSize: 24, letterSpacing: "0.06em" }}
                              >
                                {stat.v}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div data-hero-pin="image" style={{ position: "relative" }}>
                      <div
                        style={{
                          border: "0.5px solid var(--border)",
                          background: "var(--bg-base)",
                          padding: 18,
                          position: "relative",
                          aspectRatio: "4/5",
                          willChange: "transform, clip-path",
                        }}
                      >
                        <Image
                          src={heroImage}
                          alt={heroName}
                          fill
                          fetchPriority="high"
                          loading="eager"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain grayscale mix-blend-luminosity brightness-75 transition-all duration-700 hover:grayscale-0 hover:mix-blend-normal"
                          style={{ padding: 18 }}
                        />
                        <div
                          className="grid items-end"
                          style={{
                            position: "absolute",
                            left: 18,
                            right: 18,
                            bottom: 18,
                            background:
                              "linear-gradient(to top, rgba(14,14,14,0.96), rgba(14,14,14,0))",
                            padding: "32px 20px 20px",
                            gridTemplateColumns: "1fr auto",
                            gap: 16,
                          }}
                        >
                          <div>
                            <p
                              className="font-body uppercase text-text-muted"
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                letterSpacing: "0.28em",
                                marginBottom: 6,
                              }}
                            >
                              This Edition · Vol. 04
                            </p>
                            <div
                              className="font-display uppercase text-text-primary"
                              style={{ fontSize: 22, letterSpacing: "0.08em" }}
                            >
                              {heroBrand} {heroName}
                            </div>
                          </div>
                          <span
                            className="font-display uppercase text-brand-bright"
                            style={{ fontSize: 14, letterSpacing: "0.16em" }}
                          >
                            {heroSku}
                          </span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <svg
              aria-hidden="true"
              data-hero-svg-accent
              className="absolute bottom-0 left-0 w-full h-px pointer-events-none"
              viewBox="0 0 1440 1"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="0.5" x2="1440" y2="0.5" stroke="var(--brand)" strokeWidth="1" />
            </svg>
          </section>

          <section data-animate-section="not-a-poster">
            <WhatIsThisSection />
          </section>

          <section data-animate-section="letter">
            <LetterSection />
          </section>

          <section data-animate-section="three-steps">
            <HowItWorksSection />
          </section>

          <section
            id="collection-section"
            data-animate-section="collection"
            className="bg-bg-surface"
            style={{ padding: "140px 0" }}
          >
            <div
              className="mx-auto"
              style={{ width: "min(calc(100% - 2rem), 80rem)" }}
            >
              <FeaturedCollectionSection products={featuredProducts} totalCount={totalProductCount} />
            </div>
          </section>

          <section data-animate-section="customization" className="bg-bg-deep py-16 md:py-24 lg:py-28">
            <div className="frame-container">
              <CustomizationSection />
            </div>
          </section>

          <section data-animate-section="social-proof">
            <SocialProofSection />
          </section>

          <section
            data-animate-section="final-cta"
            className="bg-bg-deep texture-overlay relative overflow-hidden"
            style={{ padding: "160px 0" }}
          >
            <FinalCTASection />
          </section>
        </HomeAnimations>
      </main>

      <SiteFooter />
    </>
  );
}
