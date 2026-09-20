import Image from "next/image";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { HOME_HERO_IMAGE } from "@/lib/shop/product-assets";

/** Media-backed close CTA. Reveal owned by HomeAnimations section batch — no nested hide. */
export function FinalCTASection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={HOME_HERO_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--bg-deep) 0%, rgba(14,14,14,0.88) 45%, rgba(14,14,14,0.72) 100%)",
          }}
        />
      </div>

      <div
        className="frame-container relative text-center"
        style={{ paddingBlock: "clamp(4rem, 10vh, 7rem)" }}
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
          Rs. 5,000 · Made to order
        </p>
        <h2
          className="font-display uppercase text-text-primary"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
            letterSpacing: "0.03em",
            lineHeight: 0.98,
            margin: "0 0 16px",
            fontWeight: 400,
          }}
        >
          Ready to frame your{" "}
          <span className="text-brand-bright">obsession?</span>
        </h2>
        <p
          className="text-text-muted"
          style={{
            maxWidth: 420,
            margin: "0 auto 28px",
            fontSize: 15,
            lineHeight: 1.65,
          }}
        >
          Flat price. Nationwide delivery. Seven days from payment to your door.
        </p>
        <Button
          render={<TransitionLink href="/shop" />}
          variant="brand"
          size="xl"
          className="font-display uppercase"
          style={{ letterSpacing: "0.16em" }}
        >
          ORDER NOW →
        </Button>
      </div>
    </div>
  );
}
