import { SiteFooter } from "@/components/layout/site-footer";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { AboutHero } from "@/components/about/about-hero";
import { AboutTimeline } from "@/components/about/about-timeline";
import { AboutPullQuote } from "@/components/about/about-pull-quote";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

export default function AboutPage() {
  return (
    <>
      <main id="main-content" className="scroll-margin-site-header pb-0">
        {/* Hero */}
        <AboutHero />

        {/* The Premise — workshop voice */}
        <section
          className="bg-bg-surface"
          style={{ padding: "100px 0 90px" }}
        >
          <div className="mx-auto" style={{ width: "min(calc(100% - 2rem), 80rem)" }}>
            <div style={{ maxWidth: 920, marginBottom: 56 }}>
              <p className="font-body text-text-muted" style={{ ...KICKER, marginBottom: 24 }}>
                Chapter One · The Origin
              </p>
              <h2
                className="font-display uppercase text-text-primary"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: 1.02,
                  letterSpacing: "0.04em",
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                STARTED IN INSTAGRAM DMS.
                <br />
                <span className="text-brand-bright">50+ FRAMES LATER.</span>
              </h2>
            </div>

            <div
              className="grid about-body-grid"
              style={{ gap: 80, alignItems: "start" }}
            >
              <p className="font-body text-text-muted" style={{ ...KICKER, paddingTop: 12 }}>
                Multan, Pakistan
              </p>
              <div className="flex flex-col" style={{ gap: 28 }}>
                <p
                  className="text-text-primary"
                  style={{ fontSize: 18, lineHeight: 1.75, margin: 0 }}
                >
                  Frame Club began as a single piece on a single shelf — a Carrera GT
                  on a carbon backdrop, built for ourselves. A friend asked where to
                  buy one. There was nowhere. So we built him one. Then another. Then fifty.
                </p>
                <p
                  className="text-text-muted"
                  style={{ fontSize: 18, lineHeight: 1.75, margin: 0 }}
                >
                  Today every order is the same conversation: what car, what backdrop,
                  what should the plate say. The workshop in Multan handles the rest —
                  sourcing the diecast, finishing the wood, mounting the spec plate,
                  sealing the glass. Seven days from confirmed payment to your door.
                  No warehouse, no inventory, no compromise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline — three phases */}
        <AboutTimeline />

        {/* Pull-quote — workshop voice */}
        <AboutPullQuote />

        {/* Final CTA */}
        <section
          className="bg-bg-deep relative overflow-hidden"
          style={{ padding: "110px 0" }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--brand) 28%, transparent), transparent 65%)",
            }}
          />
          <div
            className="mx-auto text-center"
            style={{
              position: "relative",
              width: "min(calc(100% - 2rem), 80rem)",
            }}
          >
            <p className="font-body text-text-muted" style={{ ...KICKER, marginBottom: 32 }}>
              Chapter Four · The Invitation
            </p>
            <h2
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4.5rem)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
                margin: "0 0 32px",
                fontWeight: 400,
              }}
            >
              WHERE SPEED <span className="text-brand-bright">MEETS ART.</span>
            </h2>
            <p
              className="text-text-muted"
              style={{
                maxWidth: 540,
                margin: "0 auto 48px",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Built for people who collect stories as seriously as they collect cars.
              Pick a model. Specify a build. Receive a frame, made one at a time.
            </p>
            <Button
              render={<TransitionLink href="/shop" />}
              variant="brand"
              size="xl"
              className="font-display uppercase"
              style={{
                padding: "18px 40px",
                fontSize: 17,
                letterSpacing: "0.18em",
                border: "1px solid var(--brand-bright)",
                background: "var(--brand-bright)",
              }}
            >
              ORDER NOW →
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />

      <style>{`
        .about-body-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .about-body-grid {
            grid-template-columns: 1fr 1.6fr;
          }
        }
      `}</style>
    </>
  );
}
