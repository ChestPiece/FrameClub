import { describe, expect, it } from "vitest";
import { COPY } from "@/lib/content/copy-constants";

describe("locked copy contracts", () => {
  it("matches hero sub-copy (kinetic redesign)", () => {
    expect(COPY.heroSub).toBe(
      "Handcrafted diecast frames. One workshop in Lahore. One price. Zero compromise.",
    );
  });

  it("matches hero eyebrow", () => {
    expect(COPY.heroEyebrow).toBe("EST. LAHORE · MADE TO ORDER");
  });

  it("matches hero heading lines", () => {
    expect(COPY.heroHeadingLines).toEqual(["BUILT ONCE.", "FRAMED FOREVER."]);
  });

  it("matches trust line from CLAUDE.md", () => {
    expect(COPY.trustLine).toBe(
      "Nationwide Delivery 🇵🇰 | Secure Payment | Handcrafted to Order",
    );
  });

  it("matches hero CTA (neutral site-wide; per-frame prices on PDP)", () => {
    expect(COPY.heroCta).toBe("ORDER YOUR FRAME");
  });

  it("matches final CTA heading from CLAUDE.md", () => {
    expect(COPY.finalCtaHeading).toBe("READY TO FRAME YOUR OBSESSION?");
  });
});
