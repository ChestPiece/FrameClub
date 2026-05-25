"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

export function AboutPullQuote() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const items = sectionRef.current?.querySelectorAll("[data-quote-rise]");
      if (!items || items.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(Array.from(items), { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          Array.from(items),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-bg-surface"
      style={{ padding: "100px 0" }}
    >
      <div className="mx-auto" style={{ width: "min(calc(100% - 2rem), 80rem)" }}>
        <div
          className="grid quote-grid"
          style={{ gap: 80, alignItems: "start" }}
        >
          <p
            data-quote-rise
            className="font-body text-text-muted"
            style={{ ...KICKER, paddingTop: 16, opacity: 0 }}
          >
            Chapter Three · The Promise
          </p>
          <div>
            <p
              data-quote-rise
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.6rem)",
                letterSpacing: "0.02em",
                lineHeight: 1.15,
                margin: "0 0 48px",
                fontWeight: 400,
                opacity: 0,
              }}
            >
              &ldquo;Every frame is the same conversation we had the first time —
              what car, what backdrop, what should the plate say.
              <span className="text-brand-bright"> Then we build it.&rdquo;</span>
            </p>
            <div
              data-quote-rise
              className="flex items-center"
              style={{ gap: 24, opacity: 0 }}
            >
              <div
                className="font-display text-text-primary"
                style={{
                  width: 56,
                  height: 56,
                  border: "0.5px solid var(--border)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                }}
              >
                TW
              </div>
              <div>
                <div
                  className="font-display uppercase text-text-primary"
                  style={{ fontSize: 18, letterSpacing: "0.06em" }}
                >
                  The Workshop
                </div>
                <p className="font-body text-text-muted" style={KICKER}>
                  Frame Club · Lahore
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .quote-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .quote-grid {
            grid-template-columns: auto 1fr;
          }
        }
      `}</style>
    </section>
  );
}
