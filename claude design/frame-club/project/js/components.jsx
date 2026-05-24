// components.jsx — Frame Club shared UI primitives

// ---- Arrow icons ---------------------------------------------------------
const FCArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

const FCArrowDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="6 13 12 19 18 13" />
  </svg>
);

const FCPlus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const FCMinus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const FCCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FCClose = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

// ---- Button --------------------------------------------------------------
function FCButton({
  variant = "brand", size = "default", children, onClick, icon, style, type, magnetic = true, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const sizes = {
    sm: { padding: "10px 14px", fontSize: 10 },
    default: { padding: "14px 22px", fontSize: 12 },
    lg: { padding: "16px 28px", fontSize: 14 },
    xl: { padding: "20px 40px", fontSize: 18 },
  };
  const baseVariants = {
    brand: {
      background: "var(--brand-bright)", color: "var(--text-primary)", borderColor: "var(--brand-bright)",
    },
    "brand-hover": {
      background: "var(--brand-mid)", color: "var(--text-primary)", borderColor: "var(--brand-mid)",
    },
    outline: { background: "transparent", color: "var(--text-primary)", borderColor: "var(--border)" },
    "outline-hover": { background: "transparent", color: "var(--brand-bright)", borderColor: "var(--brand-bright)" },
    muted: { background: "var(--bg-deep)", color: "var(--text-muted)", borderColor: "var(--border)" },
    ghost: { background: "transparent", color: "var(--text-muted)", borderColor: "transparent" },
    "ghost-hover": { background: "transparent", color: "var(--text-primary)", borderColor: "transparent" },
  };
  const v =
    hover && variant === "brand" ? baseVariants["brand-hover"] :
    hover && variant === "outline" ? baseVariants["outline-hover"] :
    hover && variant === "ghost" ? baseVariants["ghost-hover"] :
    baseVariants[variant];

  const btn = (
    <button
      type={type || "button"}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...v, ...sizes[size],
        border: `1px solid ${v.borderColor}`,
        fontFamily: "var(--font-display)",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        display: "inline-flex", alignItems: "center", gap: 10, justifyContent: "center",
        transition: "background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease",
        minHeight: 44,
        cursor: "none",
        position: "relative",
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: "inline-block", transform: "translateY(1px)" }}>{children}</span>
      {icon && <FCArrow />}
    </button>
  );
  return magnetic ? <span data-magnetic data-magnetic-strength="0.25" style={{ display: "inline-block" }}>{btn}</span> : btn;
}

// ---- Status badge --------------------------------------------------------
function FCStatusBadge({ status }) {
  const map = {
    available:   { label: "AVAILABLE",  color: "var(--text-success)", border: "var(--status-success-border)", bg: "var(--status-success-bg)", pulse: true },
    preorder:    { label: "PRE-ORDER",  color: "var(--brand-bright)", border: "var(--brand-mid)", bg: "color-mix(in srgb, var(--brand) 28%, transparent)", pulse: false },
    unavailable: { label: "UNAVAILABLE", color: "var(--text-muted)", border: "var(--border)", bg: "var(--bg-deep)", pulse: false },
  };
  const s = map[status] || map.available;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "5px 10px",
      border: `0.5px solid ${s.border}`,
      background: s.bg,
      fontFamily: "var(--font-body)",
      fontSize: 9, fontWeight: 500, letterSpacing: "0.24em",
      color: s.color, textTransform: "uppercase", lineHeight: 1,
    }}>
      {s.pulse ? <span className="fc-pulse" /> : <span style={{ width: 6, height: 6, background: s.color, display: "inline-block" }} />}
      {s.label}
    </span>
  );
}

// ---- Accent line ---------------------------------------------------------
const FCAccent = ({ w = 96, color, vertical, style }) => (
  <span style={{
    display: "block",
    width: vertical ? 1 : w,
    height: vertical ? w : 1,
    background: color || "var(--brand-bright)",
    ...style,
  }} />
);

// ---- Kicker (small spec-plate label) ------------------------------------
const FCKicker = ({ children, color, style }) => (
  <p style={{
    fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
    letterSpacing: "0.28em", textTransform: "uppercase",
    color: color || "var(--text-muted)", margin: 0, lineHeight: 1,
    ...style,
  }}>{children}</p>
);

// ---- Section title -------------------------------------------------------
function FCSectionHeader({ kicker, title, eyebrow, accent, align = "left" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: align, alignItems: align === "center" ? "center" : "flex-start" }}>
      {accent && <FCAccent w={96} />}
      {kicker && <FCKicker>{kicker}</FCKicker>}
      <h2 data-fc-rise style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        margin: 0, fontWeight: 400, lineHeight: 0.95,
        color: "var(--text-primary)",
      }}>{title}</h2>
      {eyebrow && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>{eyebrow}</p>
      )}
    </div>
  );
}

// ---- Container -----------------------------------------------------------
const FCContainer = ({ children, style }) => (
  <div style={{ margin: "0 auto", width: "min(100% - 2rem, 80rem)", ...style }}>{children}</div>
);

// ---- Spec row (key/value pair) ------------------------------------------
function FCSpecRow({ k, v, last }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto",
      padding: "14px 0", borderBottom: last ? "none" : "0.5px solid var(--border-subtle)",
      gap: 16,
    }}>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.28em", color: "var(--text-muted)", textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.04em", color: "var(--text-primary)", textAlign: "right" }}>{v}</span>
    </div>
  );
}

// ---- Frame media — crops the marketing image to show only the frame ----
// The source webps have "DIE CAST MODEL FRAME / MINIAUTO DESIGN" headlines at
// the top; we zoom into the lower 65% so only the framed diecast is visible.
function FCFrameMedia({ src, alt, aspect = "4 / 5", style, hoverColor = true, padding = 24 }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", overflow: "hidden",
        aspectRatio: aspect,
        background: "var(--bg-deep)",
        ...style,
      }}>
      <div style={{
        position: "absolute", inset: padding,
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto 200%",
        backgroundPosition: "center 92%",
        filter: hoverColor && hover ? "none" : "grayscale(1) brightness(0.88) contrast(1.04)",
        mixBlendMode: hoverColor && hover ? "normal" : "luminosity",
        transition: "filter 0.9s ease, transform 0.9s ease",
        transform: hover ? "scale(1.02)" : "scale(1)",
      }} aria-label={alt} role="img" />
    </div>
  );
}

// ---- Drawn SVG hairline (renders inline, animates on scroll) -----------
function FCHairline({ color = "var(--brand-bright)", width = "100%", height = 1, vertical }) {
  return (
    <svg viewBox={vertical ? "0 0 1 100" : "0 0 100 1"} preserveAspectRatio="none"
      style={{ display: "block", width, height: vertical ? height : 1 }}>
      <line data-fc-draw
        x1={vertical ? 0.5 : 0} y1={vertical ? 0 : 0.5}
        x2={vertical ? 0.5 : 100} y2={vertical ? 100 : 0.5}
        stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Export to window
Object.assign(window, {
  FCArrow, FCArrowDown, FCPlus, FCMinus, FCCheck, FCClose,
  FCButton, FCStatusBadge, FCAccent, FCKicker,
  FCSectionHeader, FCContainer, FCSpecRow, FCHairline, FCFrameMedia,
});
