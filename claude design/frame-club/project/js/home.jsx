// home.jsx — Home (editorial, story-driven)

// ===========================================================================
// 01 · HERO — confident, no decorative junk
// ===========================================================================
function FCHero({ featured, navigate }) {
  const ref = React.useRef(null);
  const imgWrap = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    // Word-by-word headline reveal (kept — but quieter timing)
    const headline = ref.current.querySelector("[data-hero-headline]");
    if (headline) {
      const lines = headline.querySelectorAll("[data-hero-line]");
      lines.forEach((ln) => {
        const text = ln.textContent;
        ln.innerHTML = "";
        text.split(" ").forEach((word) => {
          const span = document.createElement("span");
          span.style.display = "inline-block";
          span.style.overflow = "hidden";
          span.style.verticalAlign = "bottom";
          const inner = document.createElement("span");
          inner.textContent = word + "\u00A0";
          inner.style.display = "inline-block";
          inner.style.transform = "translateY(110%)";
          inner.style.willChange = "transform";
          span.appendChild(inner);
          ln.appendChild(span);
        });
      });
      const inners = headline.querySelectorAll("[data-hero-line] > span > span");
      gsap.to(inners, { y: 0, duration: 1.2, ease: "expo.out", stagger: 0.045, delay: 0.3 });
    }
    FCMotion.rise(ref.current, "[data-fc-rise]", { duration: 1.0, stagger: 0.1, delay: 0.5 });
    if (imgWrap.current) {
      gsap.fromTo(imgWrap.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.out", delay: 0.5 });
      gsap.to(imgWrap.current, {
        y: -40, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }
  }, []);

  return (
    <section ref={ref} style={{
      position: "relative", overflow: "hidden",
      background: "var(--bg-deep)",
      paddingTop: "calc(7.5rem + 64px)",
      paddingBottom: 96,
    }}>
      {/* Single quiet radial accent — bottom-left, brand. No cursor-following. */}
      <div style={{
        position: "absolute", left: "-12vw", bottom: "-12vw", width: "60vw", height: "60vw",
        background: "radial-gradient(circle at bottom left, color-mix(in srgb, var(--brand) 32%, transparent), transparent 60%)",
        pointerEvents: "none",
      }} />

      <FCContainer style={{ position: "relative", zIndex: 1 }}>
        {/* Quiet meta band */}
        <div data-fc-rise style={{
          display: "grid", gridTemplateColumns: "auto 1fr auto",
          gap: 32, alignItems: "center",
          paddingBottom: 28, marginBottom: 64,
        }}>
          <FCKicker>Vol. 04 / 2026</FCKicker>
          <span style={{ height: 1, background: "var(--border)" }} />
          <FCKicker>Handcrafted · Pakistan</FCKicker>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 80, alignItems: "center" }}>
          {/* LEFT — headline + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <FCAccent w={96} />
            <h1 data-hero-headline style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 7.4vw, 6.5rem)",
              lineHeight: 0.92,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              margin: 0, fontWeight: 400,
            }}>
              <div data-hero-line>Your favourite</div>
              <div data-hero-line><span style={{ color: "var(--brand-bright)" }}>car.</span> framed.</div>
              <div data-hero-line><span style={{ color: "var(--brand-mid)" }}>forever.</span></div>
            </h1>
            <p data-fc-rise style={{
              maxWidth: 520, fontSize: 17, lineHeight: 1.75,
              color: "var(--text-muted)", margin: 0,
            }}>
              Custom diecast frames, built one at a time in a Lahore workshop and shipped nationwide. A single price. Endless configurations. Zero compromise.
            </p>
            <div data-fc-rise style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <FCButton variant="brand" size="lg" icon onClick={() => navigate("shop")}>ORDER YOUR FRAME</FCButton>
              <FCButton variant="ghost" size="lg" onClick={() => navigate("story")}>Read the story</FCButton>
            </div>
            <div data-fc-rise style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
              paddingTop: 32, borderTop: "0.5px solid var(--border-subtle)",
            }}>
              {[
                { k: "Standard lead", v: "07 days" },
                { k: "Unit price",    v: "Rs. 5,000" },
                { k: "Frames built",  v: "50+" },
              ].map((s) => (
                <div key={s.k}>
                  <FCKicker style={{ marginBottom: 8 }}>{s.k}</FCKicker>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "0.06em", color: "var(--text-primary)", textTransform: "uppercase" }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — single, clean editorial frame */}
          <div data-fc-rise style={{ position: "relative" }}>
            <div ref={imgWrap} style={{
              border: "0.5px solid var(--border)",
              background: "var(--bg-base)",
              padding: 18,
              position: "relative",
              willChange: "transform, clip-path",
            }}>
              <FCFrameMedia src={featured.image} alt={featured.name} aspect="4 / 5" hoverColor={false} padding={0} />
              {/* Small numbered caption — bottom of the frame */}
              <div style={{
                position: "absolute", left: 18, right: 18, bottom: 18,
                background: "linear-gradient(to top, rgba(14,14,14,0.96), rgba(14,14,14,0))",
                padding: "32px 20px 20px",
                display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "end",
              }}>
                <div>
                  <FCKicker style={{ marginBottom: 6 }}>This Edition · {featured.edition}</FCKicker>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.08em", color: "var(--text-primary)", textTransform: "uppercase" }}>
                    {featured.brand} {featured.name}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.16em", color: "var(--brand-bright)", textTransform: "uppercase" }}>
                  {featured.sku}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// 02 · THE PREMISE — short editorial intro
// ===========================================================================
function FCPremiseSection() {
  const ref = React.useRef(null);
  React.useEffect(() => { FCMotion.scrollRise(ref.current); }, []);
  return (
    <section ref={ref} style={{ background: "var(--bg-surface)", padding: "160px 0 140px" }}>
      <FCContainer>
        <div data-fc-scroll-rise style={{ maxWidth: 920, marginBottom: 80 }}>
          <FCKicker style={{ marginBottom: 24 }}>Chapter One · The Premise</FCKicker>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 1.02, letterSpacing: "0.04em", textTransform: "uppercase",
            margin: 0, fontWeight: 400, color: "var(--text-primary)",
          }}>
            NOT A POSTER.<br />
            NOT A TOY.<br />
            <span style={{ color: "var(--brand-bright)" }}>SOMETHING BUILT.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 80, alignItems: "start" }}>
          <FCKicker style={{ paddingTop: 12 }}>Lahore, Pakistan</FCKicker>
          <div data-fc-scroll-rise style={{ display: "flex", flexDirection: "column", gap: 28, fontSize: 18, lineHeight: 1.75, color: "var(--text-primary)" }}>
            <p style={{ margin: 0 }}>
              Every Frame Club piece is built to order around a car you've chosen and a backdrop you've specified.
              No warehouse stock. No random variants. No assembly line.
            </p>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              We source the model, finish the wood, print the backdrop, mount the spec plate, seal the glass — and photograph the result before it leaves Lahore. Fifty frames so far. Zero complaints. Same flat price for every car in the collection.
            </p>
          </div>
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// 03 · LETTER FROM THE WORKSHOP — editorial pull-quote + body
// ===========================================================================
function FCLetterSection() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    FCMotion.scrollRise(ref.current);
    // Pull-quote: letter-by-letter rise on scroll
    const quote = ref.current?.querySelector("[data-fc-quote]");
    if (quote) {
      const words = quote.textContent.split(" ");
      quote.innerHTML = "";
      words.forEach((w, i) => {
        const span = document.createElement("span");
        span.textContent = w + (i === words.length - 1 ? "" : " ");
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(40%)";
        quote.appendChild(span);
      });
      const spans = quote.querySelectorAll("span");
      ScrollTrigger.create({
        trigger: quote, start: "top 80%", once: true,
        onEnter: () => gsap.to(spans, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.04 }),
      });
    }
  }, []);
  return (
    <section ref={ref} style={{ background: "var(--bg-base)", padding: "160px 0", position: "relative", overflow: "hidden" }}>
      <FCContainer>
        <div data-fc-scroll-rise style={{ maxWidth: 720, marginBottom: 80 }}>
          <FCKicker style={{ marginBottom: 16 }}>Chapter Two · From the Workshop</FCKicker>
        </div>
        <blockquote data-fc-quote style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
          letterSpacing: "0.02em",
          lineHeight: 1.05,
          textTransform: "uppercase",
          margin: "0 0 96px",
          color: "var(--text-primary)",
          maxWidth: 1100,
          fontWeight: 400,
        }}>
          We started The Frame Club because the cars we loved deserved more than a shelf and a layer of dust. <span style={{ color: "var(--brand-bright)" }}>So we built the only thing they were missing — a frame worth the obsession.</span>
        </blockquote>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "start" }}>
          <div data-fc-scroll-rise style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 16, lineHeight: 1.8, color: "var(--text-muted)" }}>
            <p style={{ margin: 0 }}>
              The first frame was for a 1999 Skyline GT-R. A friend asked. We sourced the diecast, designed a backdrop in the colours of Bayside Blue, printed a spec sheet from the original Nissan press kit, and built the housing out of off-cuts from a local carpenter.
            </p>
            <p style={{ margin: 0 }}>
              The second frame was for his brother. The third, his father. By the time we'd built fifty, we'd stopped asking ourselves whether this was a business and started asking what it should be called.
            </p>
          </div>
          <div data-fc-scroll-rise style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 16, lineHeight: 1.8, color: "var(--text-muted)" }}>
            <p style={{ margin: 0 }}>
              The Frame Club is the answer. One product. One flat price. Built around your obsession — your car, your background, your spec plate. Made in Lahore. Shipped everywhere.
            </p>
            <p style={{ margin: 0, color: "var(--text-primary)" }}>
              Nothing else. No drops, no hype, no email list begging for attention. The work speaks; we just send the box.
            </p>
            <div style={{ paddingTop: 24, borderTop: "0.5px solid var(--border-subtle)", marginTop: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.06em", color: "var(--text-primary)", textTransform: "uppercase" }}>— The Workshop</span>
              <FCKicker style={{ marginTop: 6 }}>Studio 04 · Gulberg III · Lahore</FCKicker>
            </div>
          </div>
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// 04 · THE PROCESS — documentary 3-step, no ghost numbers
// ===========================================================================
function FCProcessSection({ navigate }) {
  const ref = React.useRef(null);
  React.useEffect(() => { FCMotion.scrollRise(ref.current); FCMotion.drawSvgLines(ref.current); }, []);
  const steps = [
    {
      n: "01",
      title: "Pick your car",
      body: "Choose from the running collection — Porsche, Nissan, Ferrari, Lamborghini, Toyota — or request a model. We source 1:64 scale from Hot Wheels, Tomica Premium, Mini-GT, and the occasional private import."
    },
    {
      n: "02",
      title: "Specify the build",
      body: "Pick the backdrop, the wood finish, and what the spec plate should say. Five backgrounds, four lacquers, four plate variants. Twenty-thousand configurations from a single SKU."
    },
    {
      n: "03",
      title: "We build & ship",
      body: "Assembled by hand in Lahore over seven days. Photographed before dispatch. Shipped nationwide via TCS Overnight in a custom rigid foam cradle. Insured, tracked, doorstepped."
    },
  ];
  return (
    <section ref={ref} style={{ background: "var(--bg-surface)", padding: "140px 0 160px" }}>
      <FCContainer>
        <div data-fc-scroll-rise style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", marginBottom: 64, gap: 32 }}>
          <div style={{ maxWidth: 800 }}>
            <FCKicker style={{ marginBottom: 16 }}>Chapter Three · The Process</FCKicker>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              letterSpacing: "0.04em", textTransform: "uppercase",
              margin: 0, color: "var(--text-primary)", lineHeight: 1, fontWeight: 400,
            }}>Three steps.<br />One frame. <span style={{ color: "var(--brand-bright)" }}>Delivered.</span></h2>
          </div>
          <FCKicker>S001 — S003</FCKicker>
        </div>

        <FCHairline width="100%" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", marginTop: 0 }}>
          {steps.map((step, i) => (
            <div key={step.n} data-fc-scroll-rise style={{
              padding: "56px 40px 56px 0",
              borderRight: i < 2 ? "0.5px solid var(--border-subtle)" : "none",
              paddingLeft: i > 0 ? 40 : 0,
              display: "flex", flexDirection: "column", gap: 24,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 40, letterSpacing: "0.04em", color: "var(--brand-bright)", lineHeight: 1 }}>{step.n}</span>
                <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, color: "var(--text-primary)", fontWeight: 400, lineHeight: 1 }}>{step.title}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)" }}>{step.body}</p>
            </div>
          ))}
        </div>

        <div data-fc-scroll-rise style={{ marginTop: 80, display: "flex", justifyContent: "flex-start" }}>
          <FCButton variant="outline" size="lg" icon onClick={() => navigate("shop")}>Begin a build</FCButton>
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// 05 · FEATURED COLLECTION
// ===========================================================================
function FCFeaturedSection({ products, navigate, viewProduct, addToCart }) {
  const ref = React.useRef(null);
  React.useEffect(() => { FCMotion.scrollRise(ref.current); }, []);
  return (
    <section ref={ref} style={{ background: "var(--bg-base)", padding: "140px 0" }}>
      <FCContainer>
        <div data-fc-scroll-rise style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", marginBottom: 48, gap: 16 }}>
          <div>
            <FCKicker style={{ marginBottom: 16 }}>Chapter Four · The Collection</FCKicker>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              letterSpacing: "0.04em", textTransform: "uppercase",
              margin: 0, color: "var(--text-primary)", lineHeight: 1, fontWeight: 400,
            }}>Featured builds</h2>
          </div>
          <FCButton variant="outline" size="default" icon onClick={() => navigate("shop")}>View all · {products.length}</FCButton>
        </div>
        <FCHairline width="100%" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 32 }}>
          {products.slice(0, 3).map((p, i) => (
            <div key={p.id} data-fc-scroll-rise>
              <FCProductCard product={p} onView={() => viewProduct(p)} onQuickAdd={() => addToCart(p)} />
            </div>
          ))}
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// 06 · LEDGER — counting stats
// ===========================================================================
function FCLedgerSection() {
  const ref = React.useRef(null);
  React.useEffect(() => { FCMotion.counters(ref.current); FCMotion.scrollRise(ref.current); }, []);
  return (
    <section ref={ref} style={{ background: "var(--bg-deep)", padding: "120px 0", borderTop: "0.5px solid var(--border)", borderBottom: "0.5px solid var(--border)" }}>
      <FCContainer>
        <div data-fc-scroll-rise style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 64, flexWrap: "wrap", gap: 16 }}>
          <div>
            <FCKicker style={{ marginBottom: 12 }}>Chapter Five · The Ledger</FCKicker>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, color: "var(--text-primary)", lineHeight: 1, fontWeight: 400 }}>By the numbers.</h2>
          </div>
          <FCKicker>Reading {new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase()}</FCKicker>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {window.FC_STATS.map((s, i) => (
            <div key={s.label} data-fc-scroll-rise style={{
              padding: "8px 40px 8px 0",
              borderRight: i < 3 ? "0.5px solid var(--border-subtle)" : "none",
              paddingLeft: i > 0 ? 40 : 0,
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 5.5vw, 4.5rem)",
                letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 0.95,
              }}>
                <span data-fc-counter={s.value} data-fc-suffix={s.suffix}>0{s.suffix}</span>
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)" }}>{s.label}</span>
              <FCKicker>{s.sublabel}</FCKicker>
            </div>
          ))}
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// 07 · TESTIMONIAL — oversized customer quote
// ===========================================================================
function FCTestimonialSection() {
  const ref = React.useRef(null);
  React.useEffect(() => { FCMotion.scrollRise(ref.current); }, []);
  return (
    <section ref={ref} style={{ background: "var(--bg-surface)", padding: "160px 0" }}>
      <FCContainer>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 80, alignItems: "start" }}>
          <FCKicker style={{ paddingTop: 16 }}>Customer · Karachi</FCKicker>
          <div data-fc-scroll-rise>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.8vw, 3.4rem)",
              letterSpacing: "0.02em",
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: "var(--text-primary)",
              margin: "0 0 48px",
              fontWeight: 400,
            }}>
              "I bought one for myself, then three more before the year was out — one for my brother, one for my father, one for the office.
              <span style={{ color: "var(--brand-bright)" }}> Nothing else on my wall feels this finished."</span>
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ width: 56, height: 56, border: "0.5px solid var(--border)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)" }}>AK</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.06em", color: "var(--text-primary)", textTransform: "uppercase" }}>Ahmed Kaleem</div>
                <FCKicker style={{ marginTop: 4 }}>Four frames · Since 2024</FCKicker>
              </div>
            </div>
          </div>
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// 08 · FINAL CTA
// ===========================================================================
function FCFinalCTASection({ navigate }) {
  const ref = React.useRef(null);
  React.useEffect(() => { FCMotion.scrollRise(ref.current); }, []);
  return (
    <section ref={ref} style={{ background: "var(--bg-deep)", padding: "180px 0", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--brand) 28%, transparent), transparent 65%)",
      }} />
      <FCContainer style={{ position: "relative", textAlign: "center" }}>
        <FCKicker style={{ marginBottom: 32 }}>Chapter Six · The Question</FCKicker>
        <h2 data-fc-scroll-rise style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7.5vw, 7rem)",
          letterSpacing: "0.03em", textTransform: "uppercase",
          margin: "0 0 32px", color: "var(--text-primary)", fontWeight: 400, lineHeight: 0.95,
        }}>READY TO FRAME<br />YOUR <span style={{ color: "var(--brand-bright)" }}>OBSESSION?</span></h2>
        <p data-fc-scroll-rise style={{ maxWidth: 540, margin: "0 auto 48px", fontSize: 16, lineHeight: 1.7, color: "var(--text-muted)" }}>
          Fully customised frames at a flat Rs. 5,000. Delivered nationwide. Two minutes to specify, seven days to build.
        </p>
        <div data-fc-scroll-rise>
          <FCButton variant="brand" size="xl" icon onClick={() => navigate("shop")} style={{ padding: "26px 56px", fontSize: 20, letterSpacing: "0.18em" }}>Order now</FCButton>
        </div>
      </FCContainer>
    </section>
  );
}

// ===========================================================================
// COMPOSE
// ===========================================================================
function FCHomeScreen({ navigate, viewProduct, addToCart }) {
  const products = window.FC_PRODUCTS;
  return (
    <div data-screen-label="Home">
      <FCHero featured={products[0]} navigate={navigate} />
      <FCPremiseSection />
      <FCLetterSection />
      <FCProcessSection navigate={navigate} />
      <FCFeaturedSection products={products} navigate={navigate} viewProduct={viewProduct} addToCart={addToCart} />
      <FCLedgerSection />
      <FCTestimonialSection />
      <FCFinalCTASection navigate={navigate} />
    </div>
  );
}

window.FCHomeScreen = FCHomeScreen;
window.FCFinalCTASection = FCFinalCTASection;
