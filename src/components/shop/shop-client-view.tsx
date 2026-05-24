"use client";

import * as React from "react";
import { CatalogProductCard } from "@/components/shop/catalog-product-card";
import type { Product } from "@/lib/db/types";

type ShopClientViewProps = {
  products: Product[];
};

export function ShopClientView({ products }: ShopClientViewProps) {
  const [filter, setFilter] = React.useState<string>("all");
  const [sort, setSort] = React.useState<"featured" | "lead" | "year">("featured");

  const brands = React.useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.brand?.toLowerCase()).filter(Boolean)))],
    [products],
  );

  const filtered = React.useMemo(() => {
    const base = products.filter(
      (p) => filter === "all" || p.brand?.toLowerCase() === filter,
    );
    if (sort === "lead") {
      return [...base].sort((a, b) => (a.deliveryDays ?? 0) - (b.deliveryDays ?? 0));
    }
    if (sort === "year") {
      return [...base].sort((a, b) => {
        const aYear = parseInt(a.years ?? "0", 10);
        const bYear = parseInt(b.years ?? "0", 10);
        return bYear - aYear;
      });
    }
    return base;
  }, [products, filter, sort]);

  return (
    <div style={{ paddingTop: "calc(7.5rem + 60px)" }}>
      <section
        style={{
          background: "var(--bg-deep)",
          padding: "80px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            width: "min(calc(100% - 2rem), 80rem)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginBottom: 48,
            }}
          >
            <p
              data-animate-heading
              style={{
                fontFamily: "var(--font-body, Inter, sans-serif)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              § Collection · 2026 Edition
            </p>

            <h1
              style={{
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                fontWeight: 400,
                lineHeight: 0.92,
                margin: 0,
              }}
            >
              THE{" "}
              <span style={{ color: "var(--brand-bright)" }}>COLLECTION.</span>
            </h1>

            <p
              style={{
                maxWidth: 640,
                fontSize: 16,
                lineHeight: 1.7,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              {products.length} frames in this drop. One flat price. Every unit
              handbuilt to spec. Filter, configure, ship.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 24,
              paddingTop: 32,
              borderTop: "0.5px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginRight: 16,
                }}
              >
                Filter ▸
              </span>
              {brands.map((b) => {
                const active = filter === b;
                return (
                  <button
                    key={b}
                    onClick={() => setFilter(b)}
                    style={{
                      padding: "10px 16px",
                      fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      border: active
                        ? "1px solid var(--brand-bright)"
                        : "1px solid var(--border)",
                      background: active
                        ? "color-mix(in srgb, var(--brand) 16%, transparent)"
                        : "transparent",
                      color: active ? "var(--text-primary)" : "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      borderRadius: 0,
                    }}
                  >
                    {b === "all" ? "All" : b}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Sort ▸
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "featured" | "lead" | "year")}
                style={{
                  background: "var(--bg-base)",
                  color: "var(--text-primary)",
                  border: "0.5px solid var(--border)",
                  padding: "10px 14px",
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  borderRadius: 0,
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value="featured">Featured</option>
                <option value="lead">Lead Time</option>
                <option value="year">Year (Newest)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "var(--bg-surface)",
          padding: "60px 0 120px",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            width: "min(calc(100% - 2rem), 80rem)",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: 80,
                textAlign: "center",
                border: "0.5px dashed var(--border)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                No frames match your filters.
              </p>
            </div>
          ) : (
            <div
              data-shop-grid
              data-animate-page="shop"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
              }}
            >
              {filtered.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
