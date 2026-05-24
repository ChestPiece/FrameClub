// shop.jsx — Collection (filterable grid)

function FCShopScreen({ navigate, viewProduct, addToCart }) {
  const products = window.FC_PRODUCTS;
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("featured");
  const ref = React.useRef(null);

  const brands = ["all", ...Array.from(new Set(products.map(p => p.brand.toLowerCase())))];

  const filtered = products
    .filter(p => filter === "all" || p.brand.toLowerCase() === filter)
    .sort((a, b) => {
      if (sort === "lead") return a.deliveryDays - b.deliveryDays;
      if (sort === "year") return parseInt(b.specs.year) - parseInt(a.specs.year);
      return 0;
    });

  React.useEffect(() => {
    FCMotion.rise(ref.current, "[data-fc-rise]", { duration: 0.9, stagger: 0.04, delay: 0.1 });
    FCMotion.bindMagnetic(ref.current);
  }, [filter, sort]);

  return (
    <div ref={ref} data-screen-label="Shop" style={{ paddingTop: "calc(7.5rem + 60px)" }}>
      {/* HERO HEADER */}
      <section style={{ background: "var(--bg-deep)", padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
        <FCContainer>
          <div data-fc-rise style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 48 }}>
            <FCKicker>§ Collection · 2026 Edition</FCKicker>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 8vw, 7rem)",
              letterSpacing: "0.04em", textTransform: "uppercase",
              margin: 0, color: "var(--text-primary)", fontWeight: 400, lineHeight: 0.92,
            }}>
              THE <span style={{ color: "var(--brand-bright)" }}>COLLECTION.</span>
            </h1>
            <p style={{ maxWidth: 640, fontSize: 16, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
              {filtered.length} frames in this drop. One flat price. Every unit handbuilt to spec. Filter, configure, ship.
            </p>
          </div>

          {/* Filter bar */}
          <div data-fc-rise style={{
            display: "grid", gridTemplateColumns: "1fr auto", gap: 24,
            paddingTop: 32, borderTop: "0.5px solid var(--border)",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <FCKicker style={{ marginRight: 16 }}>Filter ▸</FCKicker>
              {brands.map(b => (
                <button key={b} onClick={() => setFilter(b)} data-magnetic data-magnetic-strength="0.2"
                  style={{
                    border: `1px solid ${filter === b ? "var(--brand-bright)" : "var(--border)"}`,
                    background: filter === b ? "color-mix(in srgb, var(--brand) 16%, transparent)" : "transparent",
                    color: filter === b ? "var(--text-primary)" : "var(--text-muted)",
                    padding: "10px 16px",
                    fontFamily: "var(--font-display)", fontSize: 11,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    transition: "all 0.25s ease",
                  }}>
                  {b}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <FCKicker>Sort ▸</FCKicker>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                style={{
                  background: "var(--bg-base)", color: "var(--text-primary)",
                  border: "0.5px solid var(--border)", padding: "10px 14px",
                  fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "none",
                }}>
                <option value="featured">Featured</option>
                <option value="lead">Lead Time</option>
                <option value="year">Year (Newest)</option>
              </select>
            </div>
          </div>
        </FCContainer>
      </section>

      {/* GRID */}
      <section style={{ background: "var(--bg-surface)", padding: "60px 0 120px" }}>
        <FCContainer>
          {filtered.length === 0 ? (
            <div style={{ padding: 80, textAlign: "center", border: "0.5px dashed var(--border)" }}>
              <FCKicker>No frames match your filters.</FCKicker>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {filtered.map((p, i) => (
                <div key={p.id} data-fc-rise>
                  <FCProductCard product={p} onView={() => viewProduct(p)} onQuickAdd={() => addToCart(p)} />
                </div>
              ))}
            </div>
          )}
        </FCContainer>
      </section>
    </div>
  );
}

window.FCShopScreen = FCShopScreen;
