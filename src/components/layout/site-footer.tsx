"use client";

import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/layout/page-transition";

const kickerStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: 16,
};

/** Slim site footer — no SplitText (nested accent span broke char opacity). */
export function SiteFooter() {
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
          paddingTop: 48,
          paddingBottom: 28,
        }}
      >
        <div
          className="font-display uppercase"
          style={{
            fontSize: "clamp(2rem, 8vw, 5.5rem)",
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
            lineHeight: 0.92,
            marginBottom: 40,
          }}
        >
          FRAME
          <span style={{ color: "var(--brand-bright)" }}>CLUB</span>
        </div>

        <div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            paddingTop: 32,
            borderTop: "0.5px solid var(--border)",
          }}
        >
          <div>
            <div style={kickerStyle}>Navigate</div>
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
                  className="font-display uppercase text-text-primary"
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </TransitionLink>
              ))}
            </div>
          </div>

          <div>
            <div style={kickerStyle}>Logistics</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Shipping", subject: "shipping" },
                { label: "Returns", subject: "returns" },
                { label: "FAQ", subject: "faq" },
              ].map((item) => (
                <TransitionLink
                  key={item.label}
                  href={`/contact?subject=${item.subject}`}
                  className="font-display uppercase text-text-primary"
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </TransitionLink>
              ))}
            </div>
          </div>

          <div>
            <div style={kickerStyle}>Workshop</div>
            <p
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
              Gulgasht · Multan
              <br />
              hello@frameclub.pk
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "0.5px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            className="font-body uppercase text-text-muted"
            style={{ fontSize: 10, letterSpacing: "0.28em" }}
          >
            © 2026 The Frame Club
          </span>
          <span
            className="font-body uppercase text-text-muted"
            style={{ fontSize: 10, letterSpacing: "0.22em" }}
          >
            Nationwide · PayFast · Handcrafted
          </span>
        </div>
      </div>
    </footer>
  );
}
