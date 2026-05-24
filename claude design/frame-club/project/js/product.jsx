// product.jsx — Product detail with live configurator

function FCFramePreview({ product, bg, finish, qty }) {
  // Visual preview of the frame, reactive to choices
  const wrap = React.useRef(null);
  React.useEffect(() => {
    if (!wrap.current) return;
    // Animate transition when bg changes
    anime({
      targets: wrap.current.querySelector("[data-bg-layer]"),
      opacity: [0.7, 1],
      duration: 400,
      easing: "easeOutExpo",
    });
  }, [bg]);

  const bgClass = `fc-bg-${bg}`;
  const frameColor =
    finish === "matte-black"  ? "#141313" :
    finish === "carbon"       ? "#1c1b1b" :
    finish === "graphite"     ? "#3a3a3a" :
    finish === "obsidian"     ? "#0a0a0a" : "#141313";

  return (
    <div ref={wrap} data-fc-tilt style={{
      position: "relative", aspectRatio: "4 / 5",
      background: "var(--bg-deep)",
      padding: 36,
      transformStyle: "preserve-3d",
    }}>
      {/* Outer "frame" */}
      <div style={{
        position: "absolute", inset: 24,
        background: frameColor,
        border: "1px solid var(--border)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.6)",
        padding: 24,
        transition: "background 0.6s ease",
      }}>
        {/* Inner backdrop with selected pattern */}
        <div data-bg-layer className={bgClass} style={{
          position: "absolute", inset: 24,
          border: "0.5px solid rgba(245,245,245,0.06)",
          overflow: "hidden",
        }}>
          {/* MINIAUTO header rail */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.22em",
            color: "var(--text-muted)", textTransform: "uppercase",
          }}>MINIAUTO · 1:64</div>

          {/* central spine */}
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0, width: 28,
            transform: "translateX(-50%)",
            background: "linear-gradient(to bottom, rgba(245,245,245,0.04), rgba(245,245,245,0.12), rgba(245,245,245,0.04))",
            mixBlendMode: "screen",
          }} />

          {/* race number */}
          <div style={{
            position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)",
            fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: "0.04em",
            color: "var(--text-primary)", textShadow: "0 0 12px rgba(0,0,0,0.6)",
          }}>{product.sku.split("-")[1] || "07"}</div>

          {/* product image — cropped to hide marketing title overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${product.image})`,
            backgroundSize: "auto 200%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 92%",
          }} />

          {/* spec plate at bottom */}
          <div style={{
            position: "absolute", left: 16, right: 16, bottom: 12,
            display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
            gap: 10, alignItems: "end",
            background: "rgba(20,19,19,0.7)", padding: "8px 10px",
            backdropFilter: "blur(4px)",
          }}>
            {[
              { k: "POWER", v: product.specs.power },
              { k: "TORQUE", v: product.specs.torque },
              { k: "TOP SPEED", v: product.specs.topSpeed },
              { k: "0–100 KM/H", v: product.specs.zeroSixty },
              { k: "YEAR", v: product.specs.year },
            ].map(s => (
              <div key={s.k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 6, fontWeight: 600, letterSpacing: "0.24em", color: "var(--text-muted)" }}>{s.k}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.06em", color: "var(--text-primary)" }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* brand mark */}
          <div style={{
            position: "absolute", bottom: 38, right: 16,
            fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.16em",
            color: "var(--text-primary)",
          }}>{product.name.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function FCProductScreen({ product, navigate, addToCart }) {
  const ref = React.useRef(null);
  const [bg, setBg] = React.useState("carbon");
  const [finish, setFinish] = React.useState("matte-black");
  const [plate, setPlate] = React.useState("spec");
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("specs");

  React.useEffect(() => {
    FCMotion.rise(ref.current, "[data-fc-rise]", { duration: 0.9, stagger: 0.08, delay: 0.2 });
  }, [product]);

  if (!product) { navigate("shop"); return null; }
  const isOff = product.status === "unavailable";
  const isPre = product.status === "preorder";

  function handleAdd() {
    addToCart({ ...product, options: { bg, finish, plate }, qty });
    navigate("cart");
  }

  return (
    <div ref={ref} data-screen-label="Product Detail" style={{ paddingTop: "calc(7.5rem + 60px)" }}>
      {/* Breadcrumb / spec rail */}
      <FCContainer style={{ paddingTop: 24 }}>
        <div data-fc-rise style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingBottom: 24, borderBottom: "0.5px solid var(--border-subtle)",
          fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-muted)",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("shop"); }} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Collection</a>
            <span>›</span>
            <span style={{ color: "var(--text-primary)" }}>{product.brand} {product.name}</span>
          </div>
          <span>{product.sku} · {product.edition}</span>
        </div>
      </FCContainer>

      {/* MAIN: preview + configurator */}
      <FCContainer style={{ padding: "40px 0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 64, alignItems: "start" }}>
          {/* PREVIEW */}
          <div data-fc-rise style={{ position: "sticky", top: 160 }}>
            <FCFramePreview product={product} bg={bg} finish={finish} qty={qty} />
            <div style={{
              marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
              fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "center",
            }}>
              <span style={{ padding: 8, border: "0.5px solid var(--border)" }}>{window.FC_BACKGROUNDS.find(x => x.value === bg)?.label}</span>
              <span style={{ padding: 8, border: "0.5px solid var(--border)" }}>{window.FC_FRAME_FINISH.find(x => x.value === finish)?.label}</span>
              <span style={{ padding: 8, border: "0.5px solid var(--border)" }}>{window.FC_PLATE_OPTIONS.find(x => x.value === plate)?.label}</span>
            </div>
          </div>

          {/* CONFIG */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div data-fc-rise>
              <FCStatusBadge status={product.status} />
            </div>
            <div data-fc-rise>
              <FCKicker style={{ marginBottom: 16 }}>{product.brand} · Heritage Edition</FCKicker>
              <h1 style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 5.5rem)",
                letterSpacing: "0.04em", textTransform: "uppercase",
                margin: 0, color: "var(--text-primary)", lineHeight: 0.95, fontWeight: 400,
              }}>{product.name}</h1>
              <p style={{ marginTop: 8, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.28em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                {product.years} · {product.specs.power} · 1:64 SCALE
              </p>
            </div>

            <div data-fc-rise>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", margin: 0, maxWidth: 540 }}>{product.description}</p>
            </div>

            <div data-fc-rise style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, paddingTop: 24, borderTop: "0.5px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <FCKicker>Price · Pakistan</FCKicker>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1 }}>RS. {(product.price * qty).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <FCKicker>Lead Time</FCKicker>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "0.08em", color: "var(--brand-bright)" }}>{product.deliveryDays} DAYS</span>
              </div>
            </div>

            {/* CONFIGURATOR */}
            <div data-fc-rise style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <FCConfigSection label="01 · Background" current={window.FC_BACKGROUNDS.find(x => x.value === bg)?.label}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {window.FC_BACKGROUNDS.map((b) => (
                    <button key={b.value}
                      data-magnetic data-magnetic-strength="0.15"
                      onClick={() => setBg(b.value)}
                      style={{
                        position: "relative", aspectRatio: "1", padding: 0,
                        border: bg === b.value ? "1px solid var(--brand-bright)" : "0.5px solid var(--border)",
                        background: "transparent", overflow: "hidden", cursor: "none",
                        transition: "border-color 0.25s ease",
                      }}>
                      <div className={`fc-bg-${b.value}`} style={{ position: "absolute", inset: 0 }} />
                      {bg === b.value && <div style={{ position: "absolute", bottom: 4, right: 4, width: 6, height: 6, background: "var(--brand-bright)" }} />}
                    </button>
                  ))}
                </div>
              </FCConfigSection>

              <FCConfigSection label="02 · Frame Finish" current={window.FC_FRAME_FINISH.find(x => x.value === finish)?.label}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {window.FC_FRAME_FINISH.map((f) => (
                    <button key={f.value}
                      data-magnetic data-magnetic-strength="0.15"
                      onClick={() => setFinish(f.value)}
                      style={{
                        padding: 0,
                        border: finish === f.value ? "1px solid var(--brand-bright)" : "0.5px solid var(--border)",
                        background: "transparent", display: "flex", flexDirection: "column",
                        transition: "border-color 0.25s ease", cursor: "none",
                      }}>
                      <div style={{ background: f.swatch, aspectRatio: "5/2", borderBottom: "0.5px solid var(--border-subtle)" }} />
                      <span style={{
                        padding: "8px 6px", fontFamily: "var(--font-body)", fontSize: 8, letterSpacing: "0.24em",
                        textTransform: "uppercase", color: finish === f.value ? "var(--text-primary)" : "var(--text-muted)",
                      }}>{f.label}</span>
                    </button>
                  ))}
                </div>
              </FCConfigSection>

              <FCConfigSection label="03 · Spec Plate" current={window.FC_PLATE_OPTIONS.find(x => x.value === plate)?.label}>
                <div style={{ display: "grid", gap: 6 }}>
                  {window.FC_PLATE_OPTIONS.map((p) => (
                    <button key={p.value}
                      onClick={() => setPlate(p.value)}
                      style={{
                        padding: "14px 16px",
                        border: plate === p.value ? "1px solid var(--brand-bright)" : "0.5px solid var(--border)",
                        background: plate === p.value ? "color-mix(in srgb, var(--brand) 12%, transparent)" : "transparent",
                        color: "var(--text-primary)",
                        textAlign: "left", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
                        cursor: "none", transition: "all 0.25s ease",
                      }}>
                      <span style={{
                        width: 14, height: 14, border: `1px solid ${plate === p.value ? "var(--brand-bright)" : "var(--border)"}`,
                        display: "inline-grid", placeItems: "center",
                      }}>{plate === p.value && <span style={{ width: 6, height: 6, background: "var(--brand-bright)" }} />}</span>
                      <div>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>{p.label}</span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>{p.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </FCConfigSection>
            </div>

            {/* Qty + Add */}
            <div data-fc-rise style={{
              display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "stretch",
              paddingTop: 24, borderTop: "0.5px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "stretch", border: "0.5px solid var(--border)" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
                  padding: "0 16px", background: "transparent", border: "none",
                  color: "var(--text-primary)", cursor: "none",
                }}><FCMinus /></button>
                <span style={{
                  padding: "12px 20px", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.08em",
                  color: "var(--text-primary)", display: "inline-grid", placeItems: "center",
                  borderLeft: "0.5px solid var(--border)", borderRight: "0.5px solid var(--border)",
                  minWidth: 56,
                }}>{String(qty).padStart(2, "0")}</span>
                <button onClick={() => setQty(qty + 1)} style={{
                  padding: "0 16px", background: "transparent", border: "none",
                  color: "var(--text-primary)", cursor: "none",
                }}><FCPlus /></button>
              </div>
              <FCButton
                variant={isOff ? "muted" : "brand"} size="lg" icon
                onClick={handleAdd}
                style={{ width: "100%" }}
                magnetic={false}>
                {isOff ? "Currently Unavailable" : (isPre ? `Reserve · Rs. ${(product.price * qty).toLocaleString()}` : `Add to Order · Rs. ${(product.price * qty).toLocaleString()}`)}
              </FCButton>
            </div>

            {/* Trust strip */}
            <div data-fc-rise style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
              paddingTop: 24, borderTop: "0.5px solid var(--border-subtle)",
              fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase",
            }}>
              <span>✓ Nationwide Delivery</span>
              <span>✓ Secure PayFast</span>
              <span>✓ Built In Lahore</span>
            </div>
          </div>
        </div>
      </FCContainer>

      {/* Specs / Build sheet */}
      <FCContainer style={{ padding: "80px 0" }}>
        <div data-fc-rise style={{
          display: "flex", borderBottom: "0.5px solid var(--border)",
          marginBottom: 32,
        }}>
          {["specs", "build", "shipping"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "16px 32px",
              background: "transparent", border: "none",
              borderBottom: `2px solid ${tab === t ? "var(--brand-bright)" : "transparent"}`,
              color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
              fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase",
              cursor: "none", transition: "all 0.25s ease",
            }}>
              {t === "specs" ? "Spec Sheet" : t === "build" ? "Build Notes" : "Shipping"}
            </button>
          ))}
        </div>
        <div data-fc-rise>
          {tab === "specs" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
              <div>
                <FCSpecRow k="Marque" v={product.brand} />
                <FCSpecRow k="Model" v={product.name} />
                <FCSpecRow k="Production" v={product.years} />
                <FCSpecRow k="Edition" v={product.edition} />
                <FCSpecRow k="SKU" v={product.sku} last />
              </div>
              <div>
                <FCSpecRow k="Power" v={product.specs.power} />
                <FCSpecRow k="Torque" v={product.specs.torque} />
                <FCSpecRow k="Top Speed" v={product.specs.topSpeed} />
                <FCSpecRow k="0–100 km/h" v={product.specs.zeroSixty} />
                <FCSpecRow k="Year (Plate)" v={product.specs.year} last />
              </div>
            </div>
          )}
          {tab === "build" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}>
              <p style={{ margin: 0 }}>Frame: solid wood, 31.5 × 22.5 × 7 cm, finished by hand in one of four lacquers. Glass: 2mm anti-reflective acrylic. Backing: archival mat board.</p>
              <p style={{ margin: 0 }}>Diecast model: 1:64 scale, sourced from Hot Wheels, Tomica Premium, or Mini-GT depending on availability. Printed background: 200gsm matte stock, UV-cured.</p>
            </div>
          )}
          {tab === "shipping" && (
            <div style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
              <p style={{ margin: "0 0 16px" }}>Built to order in {product.deliveryDays} days, then shipped via TCS Overnight or Leopard Tracking across Pakistan. Standard ship time: 2–3 business days.</p>
              <p style={{ margin: 0 }}>Custom packaging — rigid foam cradle inside corrugated outer carton. Insured. Photographed before dispatch.</p>
            </div>
          )}
        </div>
      </FCContainer>
    </div>
  );
}

function FCConfigSection({ label, current, children }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <FCKicker>{label}</FCKicker>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.12em", color: "var(--brand-bright)", textTransform: "uppercase" }}>{current}</span>
      </div>
      {children}
    </div>
  );
}

window.FCProductScreen = FCProductScreen;
