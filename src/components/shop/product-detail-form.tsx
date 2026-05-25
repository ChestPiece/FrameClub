"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TransitionLink } from "@/components/layout/page-transition";
import {
  useProductCtaPulse,
  useVariantSwatchSpring,
} from "@/components/product/product-animations";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { FOOTBALL_FRAME_COPY, WHATSAPP_LINK } from "@/lib/content/copy-constants";
import { formatPkr } from "@/lib/utils";
import type { Product } from "@/lib/db/types";

type ProductDetailFormProps = {
  product: Product;
};

const FRAME_FINISHES = [
  { value: "matte-black", swatch: "#141313", label: "Matte Black" },
  { value: "carbon", swatch: "#2a2a2a", label: "Carbon" },
  { value: "graphite", swatch: "#353434", label: "Graphite" },
  { value: "obsidian", swatch: "#0e0e0e", label: "Obsidian" },
];

const PLATE_OPTIONS = [
  { value: "spec", label: "Performance Spec", desc: "Shows power, torque, top speed" },
  { value: "edition", label: "Edition Plate", desc: "Frame serial + edition number" },
  { value: "owner", label: "Owner's Plate", desc: "Custom text (added after order)" },
  { value: "none", label: "No Plate", desc: "Clean interior only" },
];

const BACKGROUND_PRESETS = [
  { value: "carbon", label: "Carbon Fibre" },
  { value: "race", label: "Racing Circuit" },
  { value: "atlas", label: "Atlas Map" },
  { value: "monolith", label: "Monolith" },
  { value: "heritage", label: "Heritage" },
];

const FRAME_COLOR_MAP: Record<string, string> = {
  "matte-black": "#141313",
  carbon: "#1c1b1b",
  graphite: "#3a3a3a",
  obsidian: "#0a0a0a",
};

function findSpec(product: Product, keys: string[]): string {
  const lookup = product.specs ?? [];
  for (const spec of lookup) {
    const label = spec.label.toLowerCase();
    if (keys.some((k) => label.includes(k))) return spec.value;
  }
  return "";
}

export function ProductDetailForm({ product }: ProductDetailFormProps) {
  const [background, setBackground] = useState<string>(BACKGROUND_PRESETS[0].value);
  const [finish, setFinish] = useState<string>(FRAME_FINISHES[0].value);
  const [plate, setPlate] = useState<string>(PLATE_OPTIONS[0].value);
  const [qty, setQty] = useState<number>(1);
  const [tab, setTab] = useState<"spec" | "notes" | "shipping">("spec");
  const tiltRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const popSwatch = useVariantSwatchSpring();
  useProductCtaPulse(ctaRef);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const MAX = 8;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (-py * MAX).toFixed(2);
      const ry = (px * MAX).toFixed(2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transition = "transform 0.6s ease";
      el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
      window.setTimeout(() => {
        if (el) el.style.transition = "";
      }, 600);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const frameColor = FRAME_COLOR_MAP[finish] ?? "#141313";
  const bgLabel = BACKGROUND_PRESETS.find((b) => b.value === background)?.label ?? "";
  const finishLabel = FRAME_FINISHES.find((f) => f.value === finish)?.label ?? "";
  const plateLabel = PLATE_OPTIONS.find((p) => p.value === plate)?.label ?? "";

  const power = findSpec(product, ["power", "hp"]);
  const torque = findSpec(product, ["torque"]);
  const topSpeed = findSpec(product, ["top speed", "speed"]);
  const zeroToHundred = findSpec(product, ["0-100", "0–100", "0 to 100", "acceleration"]);
  const year = findSpec(product, ["year"]) || product.years;

  const specPairs: { key: string; value: string }[] =
    plate === "spec"
      ? [
          { key: "POWER", value: power },
          { key: "TORQUE", value: torque },
          { key: "TOP SPEED", value: topSpeed },
          { key: "0–100", value: zeroToHundred },
          { key: "YEAR", value: year },
        ]
      : [];

  const ctaLabel =
    product.status === "unavailable"
      ? "Notify Me When Available"
      : product.status === "preorder"
        ? `Reserve · ${formatPkr(product.price)}`
        : `Add to Order · ${formatPkr(product.price)}`;

  if (product.category === "football") {
    return <FootballFrameDetail product={product} />;
  }

  return (
    <>
      {/* Breadcrumb rail */}
      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          paddingTop: 24,
        }}
      >
        <div
          className="font-body text-text-muted"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 24,
            borderBottom: "0.5px solid var(--border-subtle)",
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          <div>
            <TransitionLink href="/" className="hover:text-text-primary">
              Home
            </TransitionLink>
            {" › "}
            <TransitionLink href="/shop" className="hover:text-text-primary">
              Collection
            </TransitionLink>
            {" › "}
            <span className="text-text-primary">
              {product.brand} {product.name}
            </span>
          </div>
          <div>{product.id.slice(0, 8).toUpperCase()}</div>
        </div>
      </div>

      {/* Main grid */}
      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          padding: "40px 0 80px",
        }}
      >
        <div className="product-detail-grid">
          {/* LEFT — Frame Preview */}
          <div className="product-detail-left">
            <div
              ref={tiltRef}
              data-fc-tilt
              style={{
                position: "relative",
                aspectRatio: "4/5",
                background: "var(--bg-deep)",
                padding: 36,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 24,
                  background: frameColor,
                  border: "1px solid var(--border)",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.6)",
                  padding: 24,
                  transition: "background 0.6s ease",
                }}
              >
                <div
                  className={`fc-bg-${background}`}
                  style={{
                    position: "absolute",
                    inset: 24,
                    border: "0.5px solid rgba(245,245,245,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="font-display text-text-muted"
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      zIndex: 2,
                    }}
                  >
                    MINIAUTO · 1:64
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      bottom: 0,
                      width: 28,
                      transform: "translateX(-50%)",
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(245,245,245,0.04), rgba(245,245,245,0.12), rgba(245,245,245,0.04))",
                      mixBlendMode: "screen",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: product.images[0] ? `url(${product.images[0]})` : undefined,
                      backgroundSize: "auto 200%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 92%",
                    }}
                  />
                  {plate !== "none" ? (
                    <div
                      style={{
                        position: "absolute",
                        left: 16,
                        right: 16,
                        bottom: 12,
                        display: "grid",
                        gridTemplateColumns: "repeat(5,1fr)",
                        gap: 10,
                        alignItems: "end",
                        background: "rgba(20,19,19,0.7)",
                        padding: "8px 10px",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {(plate === "spec"
                        ? specPairs
                        : [
                            { key: "PLATE", value: plateLabel.toUpperCase() },
                            { key: "EDITION", value: "" },
                            { key: "SERIAL", value: "" },
                            { key: "SCALE", value: "1:64" },
                            { key: "YEAR", value: year },
                          ]
                      ).map((s) => (
                        <div key={s.key}>
                          <div
                            className="font-body text-text-muted"
                            style={{
                              fontSize: 7,
                              letterSpacing: "0.22em",
                              textTransform: "uppercase",
                            }}
                          >
                            {s.key}
                          </div>
                          <div
                            className="font-display text-text-primary"
                            style={{ fontSize: 11, letterSpacing: "0.04em" }}
                          >
                            {s.value || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Config chips */}
            <div
              className="font-body text-text-muted"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
                marginTop: 24,
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              <div style={{ padding: 8, border: "0.5px solid var(--border)" }}>{bgLabel}</div>
              <div style={{ padding: 8, border: "0.5px solid var(--border)" }}>{finishLabel}</div>
              <div style={{ padding: 8, border: "0.5px solid var(--border)" }}>{plateLabel}</div>
            </div>
          </div>

          {/* RIGHT — Config */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div data-reveal>
              <StatusBadge status={product.status} />
            </div>

            {/* Header */}
            <div data-reveal style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div
                className="font-body text-text-muted"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {product.brand} · Heritage Edition
              </div>
              <h1
                className="font-display text-text-primary"
                style={{
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 0.95,
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {product.name}
              </h1>
              <div
                className="font-body text-text-muted"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                {product.years} · 1:64 SCALE{power ? ` · ${power}` : ""}
              </div>
            </div>

            {/* Description */}
            <p
              data-reveal
              className="text-text-muted"
              style={{ fontSize: 15, lineHeight: 1.75, maxWidth: 540, margin: 0 }}
            >
              {product.description}
            </p>

            {/* Price/Lead row */}
            <div
              data-reveal
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                paddingTop: 24,
                borderTop: "0.5px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  className="font-body text-text-muted"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Price · Pakistan
                </span>
                <span
                  className="font-display text-text-primary"
                  style={{ fontSize: 48, letterSpacing: "0.04em", lineHeight: 1 }}
                >
                  RS. {product.price.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 4,
                }}
              >
                <span
                  className="font-body text-text-muted"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Lead Time
                </span>
                <span
                  className="font-display text-brand-bright"
                  style={{ fontSize: 24, letterSpacing: "0.08em" }}
                >
                  7 DAYS
                </span>
              </div>
            </div>

            {/* Form — keeps GET to /checkout */}
            <form action="/checkout" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <input type="hidden" name="slug" value={product.slug} />
              <input type="hidden" name="background" value={background} />
              <input type="hidden" name="finish" value={finish} />
              <input type="hidden" name="plate" value={plate} />
              <input type="hidden" name="quantity" value={qty} />

              {product.status === "unavailable" ? (
                <div
                  data-reveal
                  style={{
                    padding: "24px",
                    border: "0.5px solid var(--border)",
                    textAlign: "center",
                  }}
                >
                  <p
                    className="font-body text-text-muted"
                    style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", margin: 0 }}
                  >
                    Configuration available when in stock
                  </p>
                </div>
              ) : (
              <>
              {/* A. Background */}
              <ConfigSection label="01 · Background" current={bgLabel}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                  {BACKGROUND_PRESETS.map((bg) => {
                    const active = background === bg.value;
                    return (
                      <button
                        type="button"
                        key={bg.value}
                        data-button-motion="true"
                        data-button-motion-level="subtle"
                        onClick={(e) => {
                          setBackground(bg.value);
                          popSwatch(e.currentTarget);
                        }}
                        aria-label={bg.label}
                        aria-pressed={active}
                        style={{
                          aspectRatio: "1",
                          border: active
                            ? "1px solid var(--brand-bright)"
                            : "0.5px solid var(--border)",
                          background: "transparent",
                          overflow: "hidden",
                          position: "relative",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <div
                          className={`fc-bg-${bg.value}`}
                          style={{ position: "absolute", inset: 0 }}
                        />
                        {active ? (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 4,
                              right: 4,
                              width: 6,
                              height: 6,
                              background: "var(--brand-bright)",
                            }}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </ConfigSection>

              {/* B. Frame Finish */}
              <ConfigSection label="02 · Frame Finish" current={finishLabel}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                  {FRAME_FINISHES.map((f) => {
                    const active = finish === f.value;
                    return (
                      <button
                        type="button"
                        key={f.value}
                        data-button-motion="true"
                        data-button-motion-level="subtle"
                        onClick={(e) => {
                          setFinish(f.value);
                          popSwatch(e.currentTarget);
                        }}
                        aria-label={f.label}
                        aria-pressed={active}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          border: active
                            ? "1px solid var(--brand-bright)"
                            : "0.5px solid var(--border)",
                          background: "transparent",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            background: f.swatch,
                            aspectRatio: "5/2",
                            borderBottom: "0.5px solid var(--border-subtle)",
                          }}
                        />
                        <div
                          className={`font-body ${active ? "text-text-primary" : "text-text-muted"}`}
                          style={{
                            padding: "8px 6px",
                            fontSize: 8,
                            letterSpacing: "0.24em",
                            textTransform: "uppercase",
                          }}
                        >
                          {f.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ConfigSection>

              {/* C. Spec Plate */}
              <ConfigSection label="03 · Spec Plate" current={plateLabel}>
                <div style={{ display: "grid", gap: 6 }}>
                  {PLATE_OPTIONS.map((p) => {
                    const active = plate === p.value;
                    return (
                      <button
                        type="button"
                        key={p.value}
                        data-button-motion="true"
                        data-button-motion-level="subtle"
                        onClick={(e) => {
                          setPlate(p.value);
                          popSwatch(e.currentTarget);
                        }}
                        aria-pressed={active}
                        style={{
                          padding: "14px 16px",
                          border: active
                            ? "1px solid var(--brand-bright)"
                            : "0.5px solid var(--border)",
                          background: active
                            ? "color-mix(in srgb, var(--brand) 12%, transparent)"
                            : "transparent",
                          textAlign: "left",
                          display: "grid",
                          gridTemplateColumns: "auto 1fr auto",
                          gap: 14,
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            border: active
                              ? "1px solid var(--brand-bright)"
                              : "1px solid var(--border)",
                            display: "inline-grid",
                            placeItems: "center",
                          }}
                        >
                          {active ? (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                background: "var(--brand-bright)",
                              }}
                            />
                          ) : null}
                        </span>
                        <span>
                          <span
                            className="font-display text-text-primary"
                            style={{
                              fontSize: 16,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            {p.label}
                          </span>
                          <span
                            className="font-body text-text-muted"
                            style={{ fontSize: 11 }}
                          >
                            {p.desc}
                          </span>
                        </span>
                        <span />
                      </button>
                    );
                  })}
                </div>
              </ConfigSection>
              </>
              )}

              {/* Qty + CTA */}
              <div
                data-reveal
                style={{
                  display: "grid",
                  gridTemplateColumns: product.status === "unavailable" ? "1fr" : "auto 1fr",
                  gap: 16,
                  paddingTop: 24,
                  borderTop: "0.5px solid var(--border)",
                }}
              >
                {product.status !== "unavailable" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    border: "0.5px solid var(--border)",
                  }}
                >
                  <button
                    type="button"
                    data-button-motion="true"
                    data-button-motion-level="minimal"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="text-text-primary"
                    style={{
                      padding: "0 16px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                  <span
                    className="font-display text-text-primary"
                    style={{
                      padding: "12px 20px",
                      fontSize: 18,
                      letterSpacing: "0.08em",
                      display: "inline-grid",
                      placeItems: "center",
                      borderLeft: "0.5px solid var(--border)",
                      borderRight: "0.5px solid var(--border)",
                      minWidth: 56,
                    }}
                  >
                    {qty.toString().padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    data-button-motion="true"
                    data-button-motion-level="minimal"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="text-text-primary"
                    style={{
                      padding: "0 16px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
                )}

                {product.status === "unavailable" ? (
                  <Button
                    ref={ctaRef}
                    render={<TransitionLink href={`/contact?intent=notify&product=${product.slug}`} />}
                    variant="muted"
                    size="lg"
                    className="display-kicker w-full justify-center"
                  >
                    {ctaLabel}
                  </Button>
                ) : (
                  <Button
                    ref={ctaRef}
                    type="submit"
                    variant="brand"
                    size="lg"
                    className="display-kicker w-full justify-center"
                  >
                    {ctaLabel}
                  </Button>
                )}
              </div>

              {/* Trust strip */}
              <div
                data-reveal
                className="font-body text-text-muted"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 16,
                  paddingTop: 24,
                  borderTop: "0.5px solid var(--border-subtle)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                <span>✓ Nationwide Delivery</span>
                <span>✓ Secure PayFast</span>
                <span>✓ Built In Lahore</span>
              </div>
            </form>

            <Link
              href={WHATSAPP_LINK}
              className="font-body text-text-muted hover:text-text-primary"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Ask a question on WhatsApp →
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          padding: "80px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "0.5px solid var(--border)",
            marginBottom: 32,
          }}
        >
          {(
            [
              ["spec", "Spec Sheet"],
              ["notes", "Build Notes"],
              ["shipping", "Shipping"],
            ] as const
          ).map(([k, label]) => {
            const active = tab === k;
            return (
              <button
                key={k}
                type="button"
                data-button-motion="true"
                data-button-motion-level="subtle"
                onClick={() => setTab(k)}
                className={`font-display ${active ? "text-text-primary" : "text-text-muted"}`}
                style={{
                  padding: "16px 32px",
                  background: "transparent",
                  border: "none",
                  borderBottom: active
                    ? "2px solid var(--brand-bright)"
                    : "2px solid transparent",
                  fontSize: 14,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {tab === "spec" ? (
          <div data-reveal className="product-tab-grid">
            <div>
              <SpecRow k="Marque" v={product.brand} />
              <SpecRow k="Model" v={product.name} />
              <SpecRow k="Production" v="Made-to-order" />
              <SpecRow k="Edition" v="Heritage" />
              <SpecRow k="SKU" v={product.id.slice(0, 8).toUpperCase()} last />
            </div>
            <div>
              <SpecRow k="Power" v={power || "—"} />
              <SpecRow k="Torque" v={torque || "—"} />
              <SpecRow k="Top Speed" v={topSpeed || "—"} />
              <SpecRow k="0–100 km/h" v={zeroToHundred || "—"} />
              <SpecRow k="Year" v={year || "—"} last />
            </div>
          </div>
        ) : null}

        {tab === "notes" ? (
          <div
            data-reveal
            className="product-tab-grid text-text-muted"
            style={{ fontSize: 15, lineHeight: 1.7 }}
          >
            <p style={{ margin: 0 }}>
              Each frame is assembled by hand in Lahore using laser-cut steel, museum-grade
              acrylic, and a CNC-machined backplate. The diecast model is mounted on a hidden
              spine so it appears to float against the chosen backdrop.
            </p>
            <p style={{ margin: 0 }}>
              Finishes are powder-coated for depth and longevity. The frame is sealed against
              dust, and the front panel is anti-reflective so the model reads cleanly under
              gallery lighting.
            </p>
          </div>
        ) : null}

        {tab === "shipping" ? (
          <div
            data-reveal
            className="text-text-muted"
            style={{ maxWidth: 720, fontSize: 15, lineHeight: 1.7 }}
          >
            <p style={{ margin: 0, marginBottom: 16 }}>
              Frames ship nationwide via insured courier. Lead time is 7 working days from confirmed payment. Tracking is sent the moment the frame leaves
              the workshop.
            </p>
            <p style={{ margin: 0 }}>
              Payment is upfront via PayFast — no cash on delivery. Every frame is inspected
              twice before it goes out, and packaged in a custom crate to survive the trip.
            </p>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        .product-detail-left {
          position: relative;
        }
        .product-tab-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .product-detail-grid {
            grid-template-columns: 1.05fr 0.95fr;
            gap: 64px;
          }
          .product-detail-left {
            position: sticky;
            top: 160px;
          }
          .product-tab-grid {
            grid-template-columns: 1fr 1fr;
            gap: 64px;
          }
        }
      `}</style>
    </>
  );
}

function ConfigSection({
  label,
  current,
  children,
}: {
  label: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div data-reveal style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <span
          className="font-body text-text-muted"
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          className="font-display text-brand-bright"
          style={{
            fontSize: 14,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {current}
        </span>
      </div>
      {children}
    </div>
  );
}

function FootballFrameDetail({ product }: { product: Product }) {
  const quoteHref = `/contact?intent=custom-frame&product=${encodeURIComponent(product.slug)}`;
  const heroImage = product.images[0];

  return (
    <>
      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          paddingTop: 24,
        }}
      >
        <div
          className="font-body text-text-muted"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 24,
            borderBottom: "0.5px solid var(--border-subtle)",
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          <div>
            <TransitionLink href="/" className="hover:text-text-primary">
              Home
            </TransitionLink>
            {" › "}
            <TransitionLink href="/shop" className="hover:text-text-primary">
              Collection
            </TransitionLink>
            {" › "}
            <span className="text-text-primary">{product.name}</span>
          </div>
          <div>{product.id.slice(0, 8).toUpperCase()}</div>
        </div>
      </div>

      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          padding: "40px 0 80px",
        }}
      >
        <div className="football-detail-grid">
          <div
            style={{
              position: "relative",
              aspectRatio: "4/5",
              background: "var(--bg-deep)",
              padding: 14,
              border: "0.5px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {heroImage ? (
              <div
                style={{
                  position: "absolute",
                  inset: 14,
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div data-reveal>
              <StatusBadge status={product.status} />
            </div>

            <div data-reveal>
              <div
                className="font-body text-text-muted"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {product.brand} · Football Frames
              </div>
              <h1
                className="font-display text-text-primary"
                style={{
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 0.95,
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {product.name}
              </h1>
            </div>

            <p
              data-reveal
              className="text-text-muted"
              style={{ fontSize: 15, lineHeight: 1.75, maxWidth: 540, margin: 0 }}
            >
              {product.description || FOOTBALL_FRAME_COPY.detailLede}
            </p>

            <div
              data-reveal
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                paddingTop: 24,
                borderTop: "0.5px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  className="font-body text-text-muted"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Price · Pakistan
                </span>
                <span
                  className="font-display text-text-primary"
                  style={{ fontSize: 32, letterSpacing: "0.04em", lineHeight: 1 }}
                >
                  {FOOTBALL_FRAME_COPY.priceLine.toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 4,
                }}
              >
                <span
                  className="font-body text-text-muted"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Reply Time
                </span>
                <span
                  className="font-display text-brand-bright"
                  style={{ fontSize: 24, letterSpacing: "0.08em" }}
                >
                  1 DAY
                </span>
              </div>
            </div>

            <div
              data-reveal
              style={{
                display: "grid",
                gap: 12,
                padding: "20px",
                border: "0.5px solid var(--border)",
              }}
            >
              <span
                className="font-body text-text-muted"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                Brief covers
              </span>
              <ul
                className="font-body text-text-primary"
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  fontSize: 13,
                  lineHeight: 1.9,
                }}
              >
                <li>· Team / club</li>
                <li>· Player name &amp; jersey number</li>
                <li>· Frame size (S · M · L)</li>
                <li>· Reference image (optional)</li>
              </ul>
            </div>

            <div data-reveal>
              <Button
                render={<TransitionLink href={quoteHref} />}
                variant="brand"
                size="lg"
                className="display-kicker w-full justify-center"
              >
                {FOOTBALL_FRAME_COPY.detailCta}
              </Button>
            </div>

            <Link
              href={WHATSAPP_LINK}
              className="font-body text-text-muted hover:text-text-primary"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Or talk to the workshop on WhatsApp →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .football-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .football-detail-grid {
            grid-template-columns: 1.05fr 0.95fr;
            gap: 64px;
          }
        }
      `}</style>
    </>
  );
}

function SpecRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        padding: "14px 0",
        borderBottom: last ? "none" : "0.5px solid var(--border-subtle)",
        alignItems: "baseline",
      }}
    >
      <span
        className="font-body text-text-muted"
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        {k}
      </span>
      <span
        className="font-display text-text-primary"
        style={{ fontSize: 18, letterSpacing: "0.04em" }}
      >
        {v}
      </span>
    </div>
  );
}
