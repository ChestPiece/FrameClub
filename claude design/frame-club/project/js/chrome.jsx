// chrome.jsx — Frame Club site chrome (ticker, header, footer, cursor, curtain, progress)

const FC_NAV = [
  { route: "home",   label: "Explore" },
  { route: "shop",   label: "Collection" },
  { route: "story",  label: "Story" },
  { route: "contact",label: "Contact" },
];

const TICKER_ITEMS = [
  "NATIONWIDE DELIVERY — RS. 5,000",
  "HANDCRAFTED TO ORDER",
  "BUILT IN PAKISTAN \u{1F1F5}\u{1F1F0}",
  "SECURE PAYMENT VIA PAYFAST",
  "1:64 SCALE · ARCHIVAL FRAMING",
  "MADE-TO-ORDER · 7 DAY LEAD",
];

function FCSiteTicker() {
  return (
    <div style={{
      overflow: "hidden",
      height: "2.5rem",
      display: "flex", alignItems: "center",
      borderBottom: "0.5px solid var(--border-subtle)",
      background: "transparent",
    }}>
      <div className="fc-ticker-track" style={{
        fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
        letterSpacing: "0.28em", textTransform: "uppercase",
        color: "var(--text-muted)",
        paddingLeft: 48,
      }}>
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 48 }}>
            <span>{item}</span>
            <span style={{ color: "var(--brand-bright)", letterSpacing: 0 }}>●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function FCSiteHeader({ route, navigate, cartCount = 0 }) {
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
      background: "var(--bg-nav)",
      backdropFilter: "blur(20px) saturate(140%)",
      WebkitBackdropFilter: "blur(20px) saturate(140%)",
      borderBottom: "0.5px solid var(--border-subtle)",
    }}>
      <FCSiteTicker />
      <div style={{
        margin: "0 auto", width: "min(100% - 2rem, 80rem)",
        height: "5rem", display: "grid",
        gridTemplateColumns: "auto 1fr auto auto", alignItems: "center", gap: 24,
      }}>
        <a onClick={(e) => { e.preventDefault(); navigate("home"); }} href="#"
          style={{ display: "inline-flex", alignItems: "center", gap: 14, color: "var(--text-primary)", textDecoration: "none" }}>
          <img src="assets/FrameClub.png" alt="" width="34" height="34" style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.18em", lineHeight: 1 }}>THE FRAME CLUB</span>
        </a>
        <nav style={{ justifySelf: "center", display: "flex", gap: 8, alignItems: "center" }}>
          {FC_NAV.map((item) => {
            const active = route === item.route || (item.route === "shop" && route === "product");
            return (
              <a key={item.route} href="#"
                onClick={(e) => { e.preventDefault(); navigate(item.route); }}
                className="fc-nav-link"
                style={{
                  position: "relative", padding: "10px 16px",
                  fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.28em", textTransform: "uppercase", textDecoration: "none",
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  transition: "color 0.25s ease",
                }}>
                {active && (
                  <span style={{
                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                    width: 2, height: 14, background: "var(--brand-bright)",
                  }} />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>
        <button
          onClick={() => navigate("cart")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "transparent", color: "var(--text-primary)",
            border: "0.5px solid var(--border)",
            padding: "10px 14px", fontFamily: "var(--font-display)",
            fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
          <span>CART</span>
          <span style={{
            background: "var(--brand-bright)", color: "var(--text-primary)",
            minWidth: 18, height: 18, fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600,
            letterSpacing: 0, display: "inline-grid", placeItems: "center", padding: "0 4px",
          }}>{cartCount}</span>
        </button>
        <FCButton size="sm" onClick={() => navigate("shop")} style={{ padding: "12px 22px", fontSize: 12 }}>ORDER NOW</FCButton>
      </div>
    </header>
  );
}

function FCSiteFooter({ navigate }) {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-deep)", position: "relative", overflow: "hidden" }}>
      <FCContainer style={{ padding: "80px 0 32px" }}>
        {/* Massive Bebas wordmark */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(4rem, 16vw, 14rem)",
          letterSpacing: "0.04em",
          color: "var(--text-primary)",
          lineHeight: 0.9,
          marginBottom: 48,
          opacity: 0.96,
        }}>
          THE FRAME<br />
          <span style={{ color: "var(--brand-bright)" }}>CLUB.</span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48, paddingTop: 48, borderTop: "0.5px solid var(--border)",
        }}>
          <div>
            <FCKicker style={{ marginBottom: 16 }}>The Build</FCKicker>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)", margin: 0, maxWidth: 360 }}>
              Custom diecast car frames, handcrafted in Lahore and shipped nationwide.
              One SKU. Endless permutations. Built around your obsession.
            </p>
          </div>
          <div>
            <FCKicker style={{ marginBottom: 16 }}>Navigate</FCKicker>
            <div style={{ display: "grid", gap: 10 }}>
              {FC_NAV.map((n) => (
                <a key={n.route} href="#" onClick={(e) => { e.preventDefault(); navigate(n.route); }}
                  style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-primary)", textDecoration: "none" }}>
                  {n.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <FCKicker style={{ marginBottom: 16 }}>Logistics</FCKicker>
            <div style={{ display: "grid", gap: 10, fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-primary)" }}>
              <span>Shipping</span>
              <span>Returns</span>
              <span>FAQ</span>
              <span>Care Guide</span>
            </div>
          </div>
          <div>
            <FCKicker style={{ marginBottom: 16 }}>Workshop</FCKicker>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
              Studio 04, Block-C<br />
              Gulberg III · Lahore<br />
              hello@frameclub.pk
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 64, paddingTop: 24,
          borderTop: "0.5px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            © 2026 The Frame Club · Machined Monolith
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            NATIONWIDE DELIVERY <span style={{ color: "var(--brand-bright)" }}>●</span> SECURE PAYMENT <span style={{ color: "var(--brand-bright)" }}>●</span> HANDCRAFTED
          </span>
        </div>
      </FCContainer>
    </footer>
  );
}

// ---- Cursor / veil / progress (raw DOM, not React-controlled) -----------
function FCChromeMount() {
  return (
    <>
      <div className="fc-progress" />
      <div className="fc-cursor-dot" />
      <div className="fc-veil" />
    </>
  );
}

Object.assign(window, { FCSiteHeader, FCSiteFooter, FCSiteTicker, FCChromeMount });
