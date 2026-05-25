"use client";

import { useRef } from "react";
import { useStaggerReveal } from "@/lib/animation";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

export function SocialProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(sectionRef, [], { each: 0.08, distance: 32 });

  return (
    <div ref={sectionRef}>
      {/* Testimonial */}
      <div
        className="bg-bg-surface"
        style={{ padding: "clamp(48px, 7vw, 110px) 0" }}
      >
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2rem), 80rem)" }}
        >
          <div
            className="social-proof-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 80,
              alignItems: "start",
            }}
          >
            <p
              data-reveal
              className="font-body text-text-muted"
              style={{ ...KICKER, paddingTop: 16 }}
            >
              Customer · Karachi
            </p>
            <div data-reveal>
              <p
                className="font-display uppercase text-text-primary"
                style={{
                  fontSize: "clamp(1rem, 3vw, 2.6rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.15,
                  margin: "0 0 48px",
                  fontWeight: 400,
                }}
              >
                &ldquo;I bought one for myself, then three more before the year was out — one for my brother, one for my father, one for the office.
                <span className="text-brand-bright"> Nothing else on my wall feels this finished.&rdquo;</span>
              </p>
              <div data-reveal className="flex items-center" style={{ gap: 24 }}>
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
                  AK
                </div>
                <div>
                  <div
                    className="font-display uppercase text-text-primary"
                    style={{ fontSize: 18, letterSpacing: "0.06em" }}
                  >
                    Ahmed Kaleem
                  </div>
                  <p
                    className="font-body text-text-muted"
                    style={KICKER}
                  >
                    Four frames · Since 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
