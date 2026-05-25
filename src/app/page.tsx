import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomeAnimations } from "@/components/home/home-animations";
import { HomeSectionScroll } from "@/components/home/home-section-scroll";
import {
  HeroSection,
  WhatIsThisSection,
  LetterSection,
  HowItWorksSection,
  FeaturedCollectionSection,
  CustomizationSection,
  SocialProofSection,
  FinalCTASection,
} from "@/components/home/sections";
import { getProducts } from "@/lib/shop/data";

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 3);
  const totalProductCount = allProducts.length;

  return (
    <>
      <Suspense fallback={null}>
        <HomeSectionScroll />
      </Suspense>
      <main id="main-content" className="scroll-margin-site-header pb-0">
        <HomeAnimations>
          <HeroSection />

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
            style={{ padding: "56px 0" }}
          >
            <div
              className="mx-auto"
              style={{ width: "min(calc(100% - 2rem), 80rem)" }}
            >
              <FeaturedCollectionSection products={featuredProducts} totalCount={totalProductCount} />
            </div>
          </section>

          <section data-animate-section="customization" className="bg-bg-deep py-8 md:py-10 lg:py-12">
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
            style={{ padding: "72px 0" }}
          >
            <FinalCTASection />
          </section>
        </HomeAnimations>
      </main>

      <SiteFooter />
    </>
  );
}
