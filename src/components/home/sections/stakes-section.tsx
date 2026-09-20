import Image from "next/image";
import { COPY } from "@/lib/content/copy-constants";
import { HOME_HERO_IMAGE } from "@/lib/shop/product-assets";

const BEFORE_SRC = "/Assets/Cars/gtr.jpg";
const AFTER_SRC = HOME_HERO_IMAGE;

export function StakesSection() {
  return (
    <div
      id="stakes-section"
      className="bg-bg-base scroll-margin-site-header"
      style={{ padding: "clamp(4rem, 10vh, 8rem) 0" }}
    >
      <div className="frame-container">
        <p
          className="font-body uppercase text-text-muted"
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.28em",
            margin: 0,
            marginBottom: 20,
          }}
        >
          {COPY.stakesKicker}
        </p>

        <div
          className="grid gap-10 md:gap-16"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}
        >
          <div>
            <h2
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                lineHeight: 0.95,
                letterSpacing: "0.03em",
                margin: 0,
                marginBottom: 20,
                maxWidth: "14ch",
              }}
            >
              {COPY.stakesHeading}
            </h2>
            <p
              className="text-text-muted"
              style={{ fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 420 }}
            >
              {COPY.stakesBody}
            </p>
          </div>

          <div
            className="grid gap-px bg-border"
            style={{ gridTemplateColumns: "1fr 1fr", minHeight: 260 }}
            data-stakes-compare
          >
            <figure className="relative bg-bg-surface m-0 overflow-hidden" style={{ minHeight: 260 }}>
              <Image
                src={BEFORE_SRC}
                alt="Diecast sitting loose like a toy"
                fill
                sizes="(max-width: 768px) 50vw, 280px"
                className="object-cover grayscale opacity-70"
              />
              <figcaption
                className="absolute inset-x-0 bottom-0"
                style={{
                  padding: 16,
                  background: "linear-gradient(to top, rgba(14,14,14,0.92), transparent)",
                }}
              >
                <p
                  className="font-body uppercase text-text-muted"
                  style={{ fontSize: 10, letterSpacing: "0.22em", margin: 0, marginBottom: 6 }}
                >
                  Before
                </p>
                <p
                  className="font-display uppercase text-text-primary"
                  style={{ fontSize: 18, letterSpacing: "0.06em", margin: 0, lineHeight: 1 }}
                >
                  Box on a shelf
                </p>
              </figcaption>
            </figure>

            <figure
              className="relative bg-bg-elevated m-0 overflow-hidden border-l-2 border-brand-bright"
              style={{ minHeight: 260 }}
            >
              <Image
                src={AFTER_SRC}
                alt="Framed diecast hung as a finished piece"
                fill
                sizes="(max-width: 768px) 50vw, 280px"
                className="object-cover"
              />
              <figcaption
                className="absolute inset-x-0 bottom-0"
                style={{
                  padding: 16,
                  background: "linear-gradient(to top, rgba(14,14,14,0.92), transparent)",
                }}
              >
                <p
                  className="font-body uppercase text-brand-bright"
                  style={{ fontSize: 10, letterSpacing: "0.22em", margin: 0, marginBottom: 6 }}
                >
                  After
                </p>
                <p
                  className="font-display uppercase text-text-primary"
                  style={{ fontSize: 18, letterSpacing: "0.06em", margin: 0, lineHeight: 1 }}
                >
                  Hung. Specced. Yours.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}
