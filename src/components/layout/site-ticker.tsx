 "use client";

import * as React from "react";

const TICKER_ITEMS = [
  "NATIONWIDE DELIVERY — RS. 5,000",
  "HANDCRAFTED TO ORDER",
  "BUILT IN PAKISTAN 🇵🇰",
  "SECURE PAYMENT VIA PAYFAST",
  "1:64 SCALE · ARCHIVAL FRAMING",
  "MADE-TO-ORDER · 7 DAY LEAD",
];

function TickerTrack() {
  return (
    <>
      {TICKER_ITEMS.map((item) => (
        <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 48 }}>
          <span>{item}</span>
          <span
            style={{
              color: "var(--brand-bright)",
              letterSpacing: 0,
            }}
          >
            ●
          </span>
        </span>
      ))}
    </>
  );
}

export function SiteTicker() {
  return (
    <div
      style={{
        height: "2.5rem",
        overflow: "hidden",
        borderBottom: "0.5px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="fc-ticker-track"
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-body)",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {/* Duplicate for seamless loop */}
        <TickerTrack />
        <TickerTrack />
      </div>
    </div>
  );
}
