// checkout.jsx — Cart, checkout, confirmation, story, contact

function FCCartScreen({ cart, setCart, navigate }) {
  const ref = React.useRef(null);
  React.useEffect(() => { FCMotion.rise(ref.current, "[data-fc-rise]", { delay: 0.15 }); }, [cart.length]);
  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const shipping = cart.length ? 0 : 0;
  const total = subtotal + shipping;

  function updateQty(i, qty) {
    if (qty < 1) return removeItem(i);
    const next = [...cart];
    next[i] = { ...next[i], qty };
    setCart(next);
  }
  function removeItem(i) { setCart(cart.filter((_, idx) => idx !== i)); }

  return (
    <div ref={ref} data-screen-label="Cart" style={{ paddingTop: "calc(7.5rem + 60px)", minHeight: "100vh" }}>
      <FCContainer style={{ padding: "60px 0 120px" }}>
        <div data-fc-rise style={{ marginBottom: 48 }}>
          <FCKicker style={{ marginBottom: 16 }}>§ Order Bay</FCKicker>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7vw, 6rem)",
            letterSpacing: "0.04em", textTransform: "uppercase",
            margin: 0, color: "var(--text-primary)", fontWeight: 400, lineHeight: 0.95,
          }}>YOUR <span style={{ color: "var(--brand-bright)" }}>ORDER.</span></h1>
        </div>

        {cart.length === 0 ? (
          <div data-fc-rise style={{
            padding: 80, textAlign: "center",
            border: "0.5px dashed var(--border)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
          }}>
            <FCKicker>No frames in your order. Yet.</FCKicker>
            <p style={{ color: "var(--text-muted)", maxWidth: 480, lineHeight: 1.7, margin: 0 }}>
              The bay is empty. Pick a car from the collection to begin a build.
            </p>
            <FCButton variant="brand" size="lg" icon onClick={() => navigate("shop")}>Browse Collection</FCButton>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "start" }}>
            <div data-fc-rise style={{ display: "flex", flexDirection: "column" }}>
              {/* Header row */}
              <div style={{
                display: "grid", gridTemplateColumns: "100px 1fr auto auto auto",
                gap: 24, padding: "16px 0", borderBottom: "0.5px solid var(--border)",
                fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", color: "var(--text-muted)", textTransform: "uppercase",
              }}>
                <span>Frame</span><span></span><span>Qty</span><span>Subtotal</span><span></span>
              </div>
              {cart.map((it, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "100px 1fr auto auto auto",
                  gap: 24, padding: "24px 0",
                  alignItems: "center",
                  borderBottom: "0.5px solid var(--border-subtle)",
                }}>
                  <div style={{ width: 100, height: 100, border: "0.5px solid var(--border)" }}>
                    <FCFrameMedia src={it.image} alt={it.name} aspect="1" padding={6} hoverColor={false} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-primary)" }}>{it.brand} {it.name}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.24em", color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase" }}>
                      {it.options ? `${it.options.bg} · ${it.options.finish} · ${it.options.plate}` : "Default Configuration"} · {it.sku}
                    </div>
                  </div>
                  <div style={{ display: "flex", border: "0.5px solid var(--border)" }}>
                    <button onClick={() => updateQty(i, (it.qty || 1) - 1)} style={{ padding: "8px 12px", background: "transparent", border: "none", color: "var(--text-primary)" }}><FCMinus /></button>
                    <span style={{ padding: "8px 14px", fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text-primary)", borderLeft: "0.5px solid var(--border)", borderRight: "0.5px solid var(--border)" }}>{String(it.qty || 1).padStart(2, "0")}</span>
                    <button onClick={() => updateQty(i, (it.qty || 1) + 1)} style={{ padding: "8px 12px", background: "transparent", border: "none", color: "var(--text-primary)" }}><FCPlus /></button>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.04em", color: "var(--text-primary)", minWidth: 100, textAlign: "right" }}>
                    RS. {(it.price * (it.qty || 1)).toLocaleString()}
                  </div>
                  <button onClick={() => removeItem(i)} style={{ background: "transparent", border: "none", color: "var(--text-muted)" }}><FCClose /></button>
                </div>
              ))}
              <button onClick={() => navigate("shop")} style={{
                background: "transparent", border: "none", color: "var(--text-muted)",
                padding: "24px 0 0", textAlign: "left",
                fontFamily: "var(--font-display)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
                cursor: "none",
              }}>← Continue Browsing</button>
            </div>

            <div data-fc-rise style={{
              background: "var(--bg-surface)", border: "0.5px solid var(--border)",
              padding: 32, display: "flex", flexDirection: "column", gap: 16,
              position: "sticky", top: 160,
            }}>
              <FCKicker>Order Summary</FCKicker>
              <FCHairline width="100%" />
              <FCSpecRow k="Subtotal" v={`RS. ${subtotal.toLocaleString()}`} />
              <FCSpecRow k="Shipping" v="FREE" />
              <FCSpecRow k="Tax" v="INCLUDED" last />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 16, borderTop: "0.5px solid var(--border)" }}>
                <FCKicker>Total · PKR</FCKicker>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 36, letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1 }}>
                  RS. {total.toLocaleString()}
                </span>
              </div>
              <FCButton variant="brand" size="lg" icon onClick={() => navigate("checkout")} style={{ width: "100%", marginTop: 16 }} magnetic={false}>
                Proceed to Checkout
              </FCButton>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "center", margin: 0 }}>
                Secured via <span style={{ color: "var(--brand-bright)" }}>PayFast</span> · Cards · JazzCash · Easypaisa
              </p>
            </div>
          </div>
        )}
      </FCContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------

function FCCheckoutScreen({ cart, navigate, onPlaceOrder }) {
  const ref = React.useRef(null);
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "+92 ", address: "", city: "Lahore",
    payment: "card",
  });
  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  React.useEffect(() => { FCMotion.rise(ref.current, "[data-fc-rise]", { delay: 0.15 }); }, [step]);

  function update(k, v) { setForm({ ...form, [k]: v }); }
  function next() {
    if (step < 3) setStep(step + 1);
    else { onPlaceOrder({ form, cart, total: subtotal }); navigate("confirm"); }
  }

  if (cart.length === 0) { navigate("cart"); return null; }

  const steps = [
    { n: "01", label: "Identity" },
    { n: "02", label: "Delivery" },
    { n: "03", label: "Payment" },
  ];

  return (
    <div ref={ref} data-screen-label="Checkout" style={{ paddingTop: "calc(7.5rem + 60px)", minHeight: "100vh", background: "var(--bg-base)" }}>
      <FCContainer style={{ padding: "60px 0 120px" }}>
        <div data-fc-rise style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "end", gap: 32, flexWrap: "wrap" }}>
          <div>
            <FCKicker style={{ marginBottom: 16 }}>§ Build Order · Stage 0{step}</FCKicker>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)",
              letterSpacing: "0.04em", textTransform: "uppercase",
              margin: 0, color: "var(--text-primary)", fontWeight: 400, lineHeight: 0.95,
            }}>{step === 1 ? "Who is this for?" : step === 2 ? "Where to?" : "How to settle?"}</h1>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {steps.map(s => (
              <div key={s.n} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.04em",
                  color: parseInt(s.n) <= step ? "var(--text-primary)" : "var(--text-muted)",
                  transition: "color 0.3s ease",
                }}>{s.n}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: parseInt(s.n) === step ? "var(--brand-bright)" : "var(--text-muted)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "start" }}>
          {/* FORM */}
          <div data-fc-rise style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", padding: 40 }}>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <FCField label="Full Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Ahmed Khan" />
                <FCField label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@domain.pk" type="email" />
                <FCField label="Phone" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+92 300 1234567" />
              </div>
            )}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <FCField label="Street Address" value={form.address} onChange={(v) => update("address", v)} placeholder="House 12, Street 9, DHA Phase 5" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <FCField label="City" value={form.city} onChange={(v) => update("city", v)} placeholder="Lahore" />
                  <FCField label="Postal Code" value={form.postal || ""} onChange={(v) => update("postal", v)} placeholder="54000" />
                </div>
                <div style={{ padding: 16, border: "0.5px solid var(--border-subtle)", background: "var(--bg-base)" }}>
                  <FCKicker style={{ marginBottom: 8 }}>✓ Free Nationwide Shipping</FCKicker>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>TCS Overnight or Leopard Tracking. Insured & photographed before dispatch.</p>
                </div>
              </div>
            )}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { v: "card", label: "Card · Visa / MasterCard", sub: "Secured via PayFast — Visa, MasterCard, UnionPay" },
                  { v: "jazz", label: "JazzCash Wallet", sub: "Instant mobile transfer" },
                  { v: "easy", label: "Easypaisa Wallet", sub: "Instant mobile transfer" },
                  { v: "bank", label: "Bank Transfer", sub: "Direct IBFT — provisional reservation, confirmed on receipt" },
                ].map(opt => (
                  <button key={opt.v} onClick={() => update("payment", opt.v)} style={{
                    padding: "20px 20px",
                    border: form.payment === opt.v ? "1px solid var(--brand-bright)" : "0.5px solid var(--border)",
                    background: form.payment === opt.v ? "color-mix(in srgb, var(--brand) 12%, transparent)" : "var(--bg-base)",
                    color: "var(--text-primary)", textAlign: "left",
                    display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                    cursor: "none", transition: "all 0.25s ease",
                  }}>
                    <span style={{
                      width: 14, height: 14, border: `1px solid ${form.payment === opt.v ? "var(--brand-bright)" : "var(--border)"}`,
                      display: "inline-grid", placeItems: "center",
                    }}>{form.payment === opt.v && <span style={{ width: 6, height: 6, background: "var(--brand-bright)" }} />}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase" }}>{opt.label}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "0.5px solid var(--border)" }}>
              {step > 1 && <FCButton variant="outline" size="lg" onClick={() => setStep(step - 1)}>← Back</FCButton>}
              <FCButton variant="brand" size="lg" icon onClick={next} style={{ flex: 1 }} magnetic={false}>
                {step < 3 ? "Continue" : `Place Order · Rs. ${subtotal.toLocaleString()}`}
              </FCButton>
            </div>
          </div>

          {/* SUMMARY */}
          <div data-fc-rise style={{
            background: "var(--bg-surface)", border: "0.5px solid var(--border)",
            padding: 32, position: "sticky", top: 160,
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <FCKicker>Your Build</FCKicker>
            <FCHairline width="100%" />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cart.map((it, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 60, height: 60 }}>
                    <FCFrameMedia src={it.image} alt="" aspect="1" padding={4} hoverColor={false} />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.06em", color: "var(--text-primary)", textTransform: "uppercase" }}>
                    {it.name}
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.24em", color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase" }}>×{String(it.qty || 1).padStart(2, "0")}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text-primary)" }}>RS. {(it.price * (it.qty || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <FCHairline width="100%" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 8 }}>
              <FCKicker>Total</FCKicker>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text-primary)" }}>RS. {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </FCContainer>
    </div>
  );
}

function FCField({ label, value, onChange, placeholder, type }) {
  return (
    <label style={{ display: "block" }}>
      <span className="fc-label">{label}</span>
      <input className="fc-input" type={type || "text"} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

// ---------------------------------------------------------------------------

function FCConfirmScreen({ order, navigate }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    FCMotion.rise(ref.current, "[data-fc-rise]", { delay: 0.2, stagger: 0.12 });
    FCMotion.drawSvgLines(ref.current);
    // Counter for order ID
    const idEl = ref.current?.querySelector("[data-fc-counter-anim]");
    if (idEl) {
      const obj = { v: 0 };
      anime({ targets: obj, v: parseInt(idEl.dataset.fcCounterAnim || "0"), duration: 1600, easing: "easeOutExpo", round: 1, update: () => { idEl.textContent = "#" + String(obj.v).padStart(6, "0"); } });
    }
  }, []);
  if (!order) { navigate("home"); return null; }
  const orderId = order.id || Math.floor(10000 + Math.random() * 89999);

  return (
    <div ref={ref} data-screen-label="Order Confirmed" style={{ paddingTop: "calc(7.5rem + 60px)", minHeight: "100vh", background: "var(--bg-deep)" }}>
      <FCContainer style={{ padding: "80px 0 160px" }}>
        <div data-fc-rise style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <span className="fc-pulse" />
          <FCKicker color="var(--text-success)">Order Confirmed · Built to Order Underway</FCKicker>
        </div>
        <h1 data-fc-rise style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7vw, 7rem)",
          letterSpacing: "0.04em", textTransform: "uppercase",
          margin: "0 0 24px", color: "var(--text-primary)", fontWeight: 400, lineHeight: 0.92,
        }}>THANK YOU,<br /><span style={{ color: "var(--brand-bright)" }}>{(order.form?.name || "Driver").split(" ")[0]}.</span></h1>
        <p data-fc-rise style={{ maxWidth: 640, fontSize: 16, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 64px" }}>
          Your build is now in the workshop queue. A confirmation has been sent to <span style={{ color: "var(--text-primary)" }}>{order.form?.email || "your inbox"}</span>. Track production from your account; you'll receive a photo of the finished frame before it ships.
        </p>

        <div data-fc-rise style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
          border: "0.5px solid var(--border)", background: "var(--bg-surface)",
        }}>
          {[
            { k: "Order ID", v: <span data-fc-counter-anim={orderId}>#000000</span> },
            { k: "Total", v: `RS. ${(order.total || 0).toLocaleString()}` },
            { k: "Lead Time", v: "07 DAYS" },
            { k: "Ships To", v: (order.form?.city || "Lahore").toUpperCase() },
          ].map((s, i) => (
            <div key={s.k} style={{
              padding: 32,
              borderRight: i < 3 ? "0.5px solid var(--border-subtle)" : "none",
            }}>
              <FCKicker style={{ marginBottom: 12 }}>{s.k}</FCKicker>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "0.06em", color: "var(--text-primary)", lineHeight: 1 }}>{s.v}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div data-fc-rise style={{ marginTop: 80 }}>
          <FCKicker style={{ marginBottom: 32 }}>§ Build Timeline</FCKicker>
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            <svg style={{ position: "absolute", top: 12, left: "12%", right: "12%", height: 1, width: "76%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 100 1">
              <line data-fc-draw x1="0" y1="0.5" x2="100" y2="0.5" stroke="var(--brand-bright)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            {[
              { stage: "Day 01", label: "Order Received", state: "done" },
              { stage: "Day 02", label: "Model Sourced", state: "next" },
              { stage: "Day 05", label: "Assembled", state: "pending" },
              { stage: "Day 07", label: "Shipped", state: "pending" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, paddingTop: 0 }}>
                <span style={{
                  width: 24, height: 24,
                  background: s.state === "done" ? "var(--brand-bright)" : "var(--bg-base)",
                  border: `1px solid ${s.state === "done" ? "var(--brand-bright)" : s.state === "next" ? "var(--brand-bright)" : "var(--border)"}`,
                  display: "grid", placeItems: "center",
                  position: "relative", zIndex: 1,
                }}>
                  {s.state === "done" && <FCCheck size={12} />}
                  {s.state === "next" && <span style={{ width: 6, height: 6, background: "var(--brand-bright)" }} />}
                </span>
                <div>
                  <FCKicker style={{ marginBottom: 6 }}>{s.stage}</FCKicker>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: "0.08em", color: "var(--text-primary)", textTransform: "uppercase" }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-fc-rise style={{ marginTop: 80, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <FCButton variant="brand" size="lg" icon onClick={() => navigate("home")}>Return Home</FCButton>
          <FCButton variant="outline" size="lg" onClick={() => navigate("shop")}>Order Another Frame</FCButton>
        </div>
      </FCContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------

function FCStoryScreen({ navigate }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    FCMotion.rise(ref.current, "[data-fc-rise]", { delay: 0.15 });
    FCMotion.scrollRise(ref.current);
    FCMotion.drawSvgLines(ref.current);
  }, []);
  return (
    <div ref={ref} data-screen-label="Story" style={{ paddingTop: "calc(7.5rem + 60px)" }}>
      <FCContainer style={{ padding: "60px 0 80px" }}>
        <div data-fc-rise style={{ marginBottom: 64 }}>
          <FCKicker style={{ marginBottom: 16 }}>§ The Workshop · Est. 2023</FCKicker>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 7rem)",
            letterSpacing: "0.04em", textTransform: "uppercase",
            margin: 0, color: "var(--text-primary)", fontWeight: 400, lineHeight: 0.92,
          }}>BUILT IN <span style={{ color: "var(--brand-bright)" }}>LAHORE.</span><br />SHIPPED EVERYWHERE.</h1>
        </div>
      </FCContainer>

      <section style={{ background: "var(--bg-surface)", padding: "100px 0" }}>
        <FCContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div data-fc-scroll-rise>
              <FCKicker style={{ marginBottom: 16 }}>§ 01 · The Premise</FCKicker>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 24px", lineHeight: 1, color: "var(--text-primary)", fontWeight: 400 }}>The original brief.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>
                The Frame Club started with one question: where do you put a model you actually love? Not on a shelf, gathering dust. Not in a display case, looking generic. Somewhere that gives the object the same weight as the car it represents.
              </p>
            </div>
            <div data-fc-scroll-rise>
              <FCKicker style={{ marginBottom: 16 }}>§ 02 · The Method</FCKicker>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 24px", lineHeight: 1, color: "var(--text-primary)", fontWeight: 400 }}>The build.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>
                Every frame is made to order. Wood is finished by hand, the diecast is sourced specifically for your build, the background and spec plate are printed in-house, and the whole thing is photographed before it ships. Fifty frames so far. Zero complaints.
              </p>
            </div>
          </div>
        </FCContainer>
      </section>

      <FCFinalCTASection navigate={navigate} />
    </div>
  );
}

// ---------------------------------------------------------------------------

function FCContactScreen({ navigate }) {
  const ref = React.useRef(null);
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => { FCMotion.rise(ref.current, "[data-fc-rise]", { delay: 0.15 }); }, []);

  return (
    <div ref={ref} data-screen-label="Contact" style={{ paddingTop: "calc(7.5rem + 60px)", minHeight: "100vh" }}>
      <FCContainer style={{ padding: "60px 0 120px" }}>
        <div data-fc-rise style={{ marginBottom: 64 }}>
          <FCKicker style={{ marginBottom: 16 }}>§ Workshop · Direct Line</FCKicker>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 7rem)",
            letterSpacing: "0.04em", textTransform: "uppercase",
            margin: 0, color: "var(--text-primary)", fontWeight: 400, lineHeight: 0.92,
          }}>SAY <span style={{ color: "var(--brand-bright)" }}>HELLO.</span></h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 64, alignItems: "start" }}>
          <div data-fc-rise>
            {sent ? (
              <div style={{ padding: 40, border: "0.5px solid var(--brand-bright)", background: "color-mix(in srgb, var(--brand) 10%, transparent)", display: "flex", flexDirection: "column", gap: 16 }}>
                <FCKicker color="var(--brand-bright)">Message received.</FCKicker>
                <p style={{ color: "var(--text-primary)", margin: 0, lineHeight: 1.7 }}>Reply within 24 hours, weekdays. For anything time-sensitive, WhatsApp the workshop directly.</p>
                <FCButton variant="outline" size="default" onClick={() => navigate("home")}>← Return Home</FCButton>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <FCField label="Name" placeholder="Ahmed Khan" value="" onChange={() => {}} />
                <FCField label="Email" placeholder="you@domain.pk" value="" onChange={() => {}} />
                <label style={{ display: "block" }}>
                  <span className="fc-label">Message</span>
                  <textarea className="fc-input" rows="6" placeholder="Tell us about the car you want framed."></textarea>
                </label>
                <FCButton variant="brand" size="lg" icon onClick={() => setSent(true)}>Send Message</FCButton>
              </div>
            )}
          </div>
          <div data-fc-rise style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <FCKicker style={{ marginBottom: 12 }}>Workshop</FCKicker>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.08em", color: "var(--text-primary)", lineHeight: 1.3, textTransform: "uppercase", margin: 0 }}>
                Studio 04, Block C<br />Gulberg III, Lahore<br />Pakistan
              </p>
            </div>
            <div>
              <FCKicker style={{ marginBottom: 12 }}>Email</FCKicker>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.08em", color: "var(--text-primary)", textTransform: "uppercase", margin: 0 }}>hello@frameclub.pk</p>
            </div>
            <div>
              <FCKicker style={{ marginBottom: 12 }}>WhatsApp</FCKicker>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.08em", color: "var(--text-primary)", textTransform: "uppercase", margin: 0 }}>+92 300 4561234</p>
            </div>
            <div>
              <FCKicker style={{ marginBottom: 12 }}>Hours</FCKicker>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>Mon–Sat · 11:00 – 20:00 PKT<br />Sundays by appointment</p>
            </div>
          </div>
        </div>
      </FCContainer>
    </div>
  );
}

Object.assign(window, { FCCartScreen, FCCheckoutScreen, FCConfirmScreen, FCStoryScreen, FCContactScreen });
