import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomeAnimations } from "@/components/home/home-animations";
import { HomeSectionScroll } from "@/components/home/home-section-scroll";
import {
  HeroSection,
  StakesSection,
  SolutionSection,
  LetterSection,
  HowItWorksSection,
  FeaturedCollectionSection,
  FinalCTASection,
} from "@/components/home/sections";
import { getProducts } from "@/lib/shop/data";

/* tastemaker · macrostructure: Long-Scroll Narrative · mood: elegant · hero: H3 · arc: hook->problem->solution->collection->proof->close · contrast: pass */

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 3);
  const totalProductCount = allProducts.length;

  return (
    <>
      <Suspense fallback={null}>
        <HomeSectionScroll />
      </Suspense>
      <main id="main-content" className="scroll-margin-site-header overflow-x-clip pb-0">
        <HomeAnimations>
          <HeroSection />

          <section data-animate-section="stakes">
            <StakesSection />
          </section>

          <section data-animate-section="solution">
            <SolutionSection />
          </section>

          <section data-animate-section="three-steps">
            <HowItWorksSection />
          </section>

          <section
            id="collection-section"
            data-animate-section="collection"
            className="bg-bg-surface"
            style={{ padding: "clamp(3.5rem, 8vh, 6rem) 0" }}
          >
            <div
              className="mx-auto"
              style={{ width: "min(calc(100% - 2rem), 80rem)" }}
            >
              <FeaturedCollectionSection products={featuredProducts} totalCount={totalProductCount} />
            </div>
          </section>

          <section data-animate-section="letter">
            <LetterSection />
          </section>

          <section data-animate-section="final-cta" className="bg-bg-deep relative overflow-hidden">
            <FinalCTASection />
          </section>
        </HomeAnimations>
      </main>

      <SiteFooter />
    </>
  );
}
