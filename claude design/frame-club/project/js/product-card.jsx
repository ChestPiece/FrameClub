// product-card.jsx — Refined catalog card

function FCProductCard({ product, onView, onQuickAdd }) {
  const [hover, setHover] = React.useState(false);
  const isPre = product.status === "preorder";
  const isOff = product.status === "unavailable";

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => !isOff && onView && onView()}
      style={{
        background: "var(--bg-base)",
        border: `0.5px solid ${hover ? "var(--brand-bright)" : "var(--border)"}`,
        display: "flex", flexDirection: "column",
        transition: "border-color 0.5s ease",
        opacity: isOff ? 0.72 : 1,
        position: "relative",
      }}>
      {/* Top spec rail (single line, quieter) */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto",
        padding: "14px 20px",
        borderBottom: "0.5px solid var(--border-subtle)",
        fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500,
        letterSpacing: "0.28em", color: "var(--text-muted)", textTransform: "uppercase",
        lineHeight: 1, alignItems: "center",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: 14, height: "0.5px", background: "var(--brand-bright)" }} />
          {product.brand}
        </span>
        <span>{product.sku}</span>
      </div>

      {/* Media — uses FCFrameMedia to crop out the marketing title text */}
      <div style={{ position: "relative", borderBottom: "0.5px solid var(--border-subtle)" }}>
        <FCFrameMedia src={product.image} alt={product.name} aspect="5 / 4" padding={20} />
        {/* hover wash */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at bottom right, color-mix(in srgb, var(--brand) 18%, transparent), transparent 60%)",
          opacity: hover ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: "none",
        }} />
        {/* Status (top-left) */}
        <div style={{ position: "absolute", left: 16, top: 16, zIndex: 2 }}>
          <FCStatusBadge status={product.status} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 22px 8px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: "0.06em", lineHeight: 1, color: "var(--text-primary)", margin: "0 0 10px", textTransform: "uppercase", fontWeight: 400 }}>{product.name}</h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>{product.years} · {product.brand}</p>
      </div>

      {/* Spec strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 0.5px 1fr 0.5px 1fr",
        margin: "20px 22px 0",
        borderTop: "0.5px solid var(--border-subtle)",
        borderBottom: "0.5px solid var(--border-subtle)",
      }}>
        {[
          { k: "Scale", v: "1:64" },
          { k: "Lead",  v: `${product.deliveryDays}D` },
          { k: "Year",  v: product.specs.year },
        ].map((s, i) => (
          <React.Fragment key={s.k}>
            <div style={{ padding: "12px 4px", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 9, letterSpacing: "0.24em", color: "var(--text-muted)", textTransform: "uppercase" }}>{s.k}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: "0.06em", color: "var(--text-primary)", lineHeight: 1 }}>{s.v}</span>
            </div>
            {i < 2 && <div style={{ background: "var(--border-subtle)" }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", padding: "20px 22px 24px", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.28em", color: "var(--text-muted)", textTransform: "uppercase" }}>Price · PK</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1 }}>Rs. {product.price.toLocaleString()}</span>
        </div>
        {isOff ? (
          <FCButton variant="muted" size="default" magnetic={false} onClick={(e) => { e.stopPropagation(); }}>Notify me</FCButton>
        ) : (
          <FCButton variant={isPre ? "outline" : "brand"} size="default" icon magnetic={false}
            onClick={(e) => { e.stopPropagation(); onQuickAdd && onQuickAdd(); }}>
            {isPre ? "Reserve" : "Order"}
          </FCButton>
        )}
      </div>
    </article>
  );
}

window.FCProductCard = FCProductCard;
