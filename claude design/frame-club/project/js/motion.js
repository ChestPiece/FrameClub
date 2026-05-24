// motion.js — GSAP + Anime.js choreography helpers for Frame Club
// All animation primitives live here so screen code stays declarative.

(function () {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const anime = window.anime;
  if (!gsap || !ScrollTrigger || !anime) {
    console.warn("[FCMotion] Missing GSAP / Anime.js");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // ---- 1. Entrance: staggered rise --------------------------------------
  function rise(scope, selector = "[data-fc-rise]", opts = {}) {
    const els = scope.querySelectorAll(selector);
    if (!els.length) return;
    gsap.fromTo(els,
      { y: 28, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: opts.duration ?? 0.9,
        ease: "power3.out",
        stagger: opts.stagger ?? 0.08,
        delay: opts.delay ?? 0,
      });
  }

  // ---- 2. Scroll reveal: clipPath wipe ----------------------------------
  function clipReveal(scope, selector = "[data-fc-clip]", opts = {}) {
    const els = scope.querySelectorAll(selector);
    els.forEach((el) => {
      gsap.fromTo(el,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: opts.duration ?? 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: opts.start ?? "top 85%", once: true },
        });
    });
  }

  // ---- 3. Scroll reveal: rise on scroll ---------------------------------
  function scrollRise(scope, selector = "[data-fc-scroll-rise]", opts = {}) {
    const els = scope.querySelectorAll(selector);
    els.forEach((el) => {
      gsap.fromTo(el,
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: opts.duration ?? 0.9,
          ease: "power3.out",
          stagger: opts.stagger ?? 0.08,
          scrollTrigger: { trigger: el, start: opts.start ?? "top 85%", once: true },
        });
    });
  }

  // ---- 4. Headline parallax (slight upward drift on scroll) -------------
  function parallax(scope, selector = "[data-fc-parallax]", opts = {}) {
    const els = scope.querySelectorAll(selector);
    els.forEach((el) => {
      gsap.to(el, {
        yPercent: opts.amount ?? -10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }

  // ---- 5. Drawn SVG hairline (each line draws on scroll) ----------------
  function drawSvgLines(scope, selector = "[data-fc-draw]") {
    const els = scope.querySelectorAll(selector);
    els.forEach((el) => {
      const len = el.getTotalLength ? el.getTotalLength() : 200;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      gsap.to(el, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
  }

  // ---- 6. Counter tick-up (Anime.js, GSAP-triggered) --------------------
  function counters(scope, selector = "[data-fc-counter]") {
    const els = scope.querySelectorAll(selector);
    els.forEach((el) => {
      const target = parseFloat(el.dataset.fcCounter || "0");
      const suffix = el.dataset.fcSuffix || "";
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const obj = { v: 0 };
          anime({
            targets: obj,
            v: target,
            duration: 1800,
            easing: "easeOutExpo",
            round: target < 10 ? 10 : 1,  // sub-10 keeps a decimal feel
            update: () => { el.textContent = obj.v + suffix; },
          });
        },
      });
    });
  }

  // ---- 7. Text-split entrance (per-letter, Anime.js) --------------------
  function splitText(el, opts = {}) {
    if (!el || el.__split) return;
    el.__split = true;
    const text = el.textContent;
    el.textContent = "";
    const letters = [];
    text.split("").forEach((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(120%)";
      el.appendChild(span);
      letters.push(span);
    });
    anime({
      targets: letters,
      translateY: ["120%", "0%"],
      opacity: [0, 1],
      delay: anime.stagger(20, { start: opts.delay ?? 100 }),
      duration: 900,
      easing: "easeOutExpo",
    });
  }

  // ---- 8. Magnetic effect on CTAs ---------------------------------------
  function bindMagnetic(scope = document) {
    const els = scope.querySelectorAll("[data-magnetic]");
    els.forEach((el) => {
      if (el.__magnetic) return;
      el.__magnetic = true;
      const strength = parseFloat(el.dataset.magneticStrength || "0.2");
      let raf;
      function move(e) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          gsap.to(el, { x: dx, y: dy, duration: 0.6, ease: "power3.out" });
        });
      }
      function reset() {
        cancelAnimationFrame(raf);
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
      }
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", reset);
    });
  }

  // ---- 9. Page transition — quiet fade through a dark veil --------------
  function pageTransition(onMid) {
    const veil = document.querySelector(".fc-veil");
    if (!veil) { onMid && onMid(); window.scrollTo(0, 0); return; }
    const tl = gsap.timeline();
    tl.set(veil, { pointerEvents: "auto" })
      .to(veil, { opacity: 1, duration: 0.45, ease: "power2.inOut" })
      .add(() => {
        try { onMid && onMid(); } catch (e) { console.error(e); }
        window.scrollTo(0, 0);
      })
      .to({}, { duration: 0.12 })
      .to(veil, { opacity: 0, duration: 0.55, ease: "power2.inOut" })
      .set(veil, { pointerEvents: "none" });
  }

  // ---- 10. Cursor: minimal dot ------------------------------------------
  function bindCursor() {
    const dot = document.querySelector(".fc-cursor-dot");
    if (!dot) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    function loop() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      dot.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, [data-magnetic], [data-cursor]")) {
        dot.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", () => dot.classList.remove("is-hover"));
  }

  // ---- 11. Scroll progress bar ------------------------------------------
  function bindProgress() {
    const bar = document.querySelector(".fc-progress");
    if (!bar) return;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.to(bar, { scaleX: self.progress, duration: 0.15, ease: "none", overwrite: true });
      },
    });
  }

  // ---- 12. Marquee / ticker (CSS-driven) speed sync --------------------
  // ticker animation lives in CSS; nothing to wire here

  // ---- 13. Card tilt on hover (subtle, GSAP) ----------------------------
  function bindCardTilt(scope = document) {
    const cards = scope.querySelectorAll("[data-fc-tilt]");
    cards.forEach((card) => {
      if (card.__tilt) return;
      card.__tilt = true;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateX: -py * 4,
          rotateY: px * 4,
          transformPerspective: 1200,
          duration: 0.4,
          ease: "power2.out",
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
      });
    });
  }

  // ---- 14. Hero corner-glow follows cursor ------------------------------
  function bindCursorGlow(scope) {
    const els = scope.querySelectorAll("[data-fc-glow]");
    els.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty("--glow-x", `${x}%`);
        el.style.setProperty("--glow-y", `${y}%`);
      });
    });
  }

  // ---- Public API -------------------------------------------------------
  window.FCMotion = {
    rise,
    clipReveal,
    scrollRise,
    parallax,
    drawSvgLines,
    counters,
    splitText,
    bindMagnetic,
    bindCursor,
    bindProgress,
    bindCardTilt,
    bindCursorGlow,
    pageTransition,
    refresh: () => ScrollTrigger.refresh(),
    killAll: () => ScrollTrigger.getAll().forEach((t) => t.kill()),
  };
})();
