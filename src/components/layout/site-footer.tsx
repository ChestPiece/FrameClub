"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/layout/page-transition";
import { useFooterReveal } from "@/components/layout/layout-animations";

const kickerStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: 16,
};

export function SiteFooter() {
  const wordmarkRef = React.useRef<HTMLDivElement>(null);
  const linksContainerRef = React.useRef<HTMLDivElement>(null);
  useFooterReveal(wordmarkRef, linksContainerRef);

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-deep)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          paddingTop: 80,
          paddingBottom: 32,
        }}
      >
        {/* Massive wordmark */}
        <div
          ref={wordmarkRef}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem, 16vw, 14rem)",
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
            lineHeight: 0.9,
            marginBottom: 48,
            opacity: 0.96,
          }}
        >
          THE FRAME
          <br />
          <span style={{ color: "var(--brand-bright)" }}>CLUB.</span>
        </div>

        {/* 4-col grid */}
        <div
          ref={linksContainerRef}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            paddingTop: 48,
            borderTop: "0.5px solid var(--border)",
          }}
        >
          {/* Col 1: The Build */}
          <div>
            <div data-reveal style={kickerStyle}>
              The Build
            </div>
            <p
              data-reveal
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--text-muted)",
                maxWidth: 360,
                margin: 0,
              }}
            >
              Custom diecast car frames, handcrafted in Lahore and shipped
              nationwide. One SKU. Endless permutations. Built around your
              obsession.
            </p>
          </div>

          {/* Col 2: Navigate */}
          <div>
            <div data-reveal style={kickerStyle}>
              Navigate
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Explore", href: "/" },
                { label: "Collection", href: "/shop" },
                { label: "Story", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  data-reveal
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Col 3: Logistics */}
          <div>
            <div data-reveal style={kickerStyle}>
              Logistics
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Shipping", "Returns", "FAQ", "Care Guide"].map((item) => (
                <span
                  key={item}
                  data-reveal
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-primary)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Workshop */}
          <div>
            <div data-reveal style={kickerStyle}>
              Workshop
            </div>
            <p
              data-reveal
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                lineHeight: 1.7,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Studio 04, Block-C
              <br />
              Gulberg III · Lahore
              <br />
              hello@frameclub.pk
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "0.5px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            © 2026 The Frame Club · Machined Monolith
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            NATIONWIDE DELIVERY{" "}
            <span style={{ color: "var(--brand-bright)" }}>●</span> SECURE
            PAYMENT <span style={{ color: "var(--brand-bright)" }}>●</span>{" "}
            HANDCRAFTED
          </span>
        </div>
      </div>
    </footer>
  );
}
