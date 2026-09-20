"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";

export const SITE_LOADER_DONE_EVENT = "frameclub:site-loader-done";
const SITE_LOADER_DONE_FLAG = "__frameClubLoaderDone";

declare global {
  interface Window {
    __frameClubLoaderDone?: boolean;
  }
}

// Aperture geometry — 6 blades drawn as triangles around center (100,100 in a 200 viewBox).
const BLADE_COUNT = 6;
const APERTURE_SIZE = 200;
const APERTURE_CENTER = APERTURE_SIZE / 2;
const APERTURE_RADIUS = 140; // bigger than viewBox → blades cover when closed

function buildBladePath(angleDeg: number): string {
  // Triangle: center → two outer points spread (360/BLADE_COUNT) apart.
  const spread = 360 / BLADE_COUNT;
  const a1 = ((angleDeg - spread / 2) * Math.PI) / 180;
  const a2 = ((angleDeg + spread / 2) * Math.PI) / 180;
  const x1 = APERTURE_CENTER + APERTURE_RADIUS * Math.cos(a1);
  const y1 = APERTURE_CENTER + APERTURE_RADIUS * Math.sin(a1);
  const x2 = APERTURE_CENTER + APERTURE_RADIUS * Math.cos(a2);
  const y2 = APERTURE_CENTER + APERTURE_RADIUS * Math.sin(a2);
  return `M ${APERTURE_CENTER} ${APERTURE_CENTER} L ${x1} ${y1} L ${x2} ${y2} Z`;
}

const WORD_CYCLE = ["FRAME", "CRAFT", "READY"];

export function SiteLoader() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const apertureGroupRef = React.useRef<SVGGElement>(null);
  const monogramRef = React.useRef<SVGTextElement>(null);
  const kickerRef = React.useRef<HTMLParagraphElement>(null);
  const wordRef = React.useRef<HTMLDivElement>(null);
  const counterRef = React.useRef<HTMLSpanElement>(null);
  const ruleRef = React.useRef<HTMLDivElement>(null);
  const cityRef = React.useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const apertureGroup = apertureGroupRef.current;
      const monogram = monogramRef.current;
      const kicker = kickerRef.current;
      const wordEl = wordRef.current;
      const counter = counterRef.current;
      const rule = ruleRef.current;
      const city = cityRef.current;
      if (!root || !apertureGroup || !monogram || !kicker || !wordEl || !counter || !rule || !city) return;
      if (typeof window === "undefined") return;

      const blades = Array.from(apertureGroup.querySelectorAll<SVGPathElement>("[data-blade]"));

      const hideLoaderInstant = () => {
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      };

      const markDoneAndDispatch = () => {
        window[SITE_LOADER_DONE_FLAG] = true;
        window.dispatchEvent(new Event(SITE_LOADER_DONE_EVENT));
      };

      if (window[SITE_LOADER_DONE_FLAG]) {
        hideLoaderInstant();
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        hideLoaderInstant();
        markDoneAndDispatch();
        return;
      }

      // Initial state — aperture closed, blades at 0 rotation (covering), text hidden.
      gsap.set(root, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(blades, { rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(monogram, { autoAlpha: 1, scale: 1, transformOrigin: "50% 50%" });
      gsap.set([kicker, wordEl, counter, city], { autoAlpha: 0, y: 10 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      let timelineCompleted = false;

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          timelineCompleted = true;
          gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
          markDoneAndDispatch();
        },
      });

      // Full sequence — plays on every refresh (no session-skip). SPA nav within tab still skips via window flag.
      // Phase 1: intro reveal of frame furniture
      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.05)
        .to(rule, { scaleX: 1, duration: 0.4, ease: "expo.out" }, 0.1)
        .to(counter, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.15)
        .to(city, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.2);

      // Phase 2: animated counter 00 → 99
      const counterState = { value: 0 };
      tl.to(
        counterState,
        {
          value: 99,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: () => {
            const n = Math.floor(counterState.value);
            counter.textContent = n.toString().padStart(2, "0");
          },
        },
        0.25
      );

      // Phase 3: word cycle synchronized with counter
      tl.to(wordEl, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.3);
      WORD_CYCLE.forEach((word, i) => {
        const at = 0.32 + i * 0.28;
        tl.call(
          () => {
            if (wordEl) wordEl.textContent = word;
          },
          undefined,
          at
        );
        tl.to(
          monogram,
          { scale: 0.94, duration: 0.1, ease: "power2.inOut", yoyo: true, repeat: 1 },
          at
        );
        tl.fromTo(
          wordEl,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.22, ease: "expo.out" },
          at
        );
      });

      // Phase 4: aperture opens
      tl.addLabel("open", 1.2)
        .to(counter, { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "open-=0.05")
        .to(city, { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "open-=0.05")
        .to(kicker, { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "open-=0.05")
        .to(wordEl, { autoAlpha: 0, scale: 1.15, duration: 0.22, ease: "power2.in" }, "open-=0.05")
        .to(monogram, { scale: 1.4, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "open")
        .to(
          blades,
          {
            rotation: 75,
            duration: 0.45,
            ease: "expo.inOut",
            stagger: { each: 0.015, from: "random" },
          },
          "open"
        )
        .to(root, { autoAlpha: 0, duration: 0.25, ease: "power3.in" }, "+=0.03");

      return () => {
        tl.kill();
        if (!timelineCompleted && !window[SITE_LOADER_DONE_FLAG]) {
          hideLoaderInstant();
          markDoneAndDispatch();
        }
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      data-site-loader
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-[#0E0E0E]"
      style={{ visibility: "visible", opacity: 1 }}
      aria-hidden="true"
    >
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(192,57,43,0.08) 0%, transparent 55%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.7) 0%, transparent 60%)",
        }}
      />

      {/* Top-left kicker */}
      <p
        ref={kickerRef}
        className="absolute left-6 top-6 font-body text-[10px] uppercase tracking-[0.4em] text-text-muted sm:left-10 sm:top-10"
        style={{ opacity: 0 }}
      >
        Frame · Club · PK
      </p>

      {/* Top-right hairline rule */}
      <div
        ref={ruleRef}
        className="absolute right-6 top-9 h-px w-24 bg-brand-bright sm:right-10 sm:w-32"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Bottom-left counter */}
      <div className="absolute bottom-6 left-6 flex items-baseline gap-3 sm:bottom-10 sm:left-10">
        <span
          ref={counterRef}
          className="font-display text-2xl tracking-[0.1em] text-text-primary tabular-nums sm:text-3xl"
          style={{ opacity: 0 }}
        >
          00
        </span>
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-text-muted">
          / 99
        </span>
      </div>

      {/* Bottom-right city ticker */}
      <p
        ref={cityRef}
        className="absolute bottom-6 right-6 font-body text-[10px] uppercase tracking-[0.3em] text-text-muted sm:bottom-10 sm:right-10"
        style={{ opacity: 0 }}
      >
        Multan · Lahore · Karachi · Islamabad
      </p>

      {/* Center stack: aperture + word */}
      <div className="relative flex flex-col items-center justify-center gap-10">
        <svg
          viewBox={`0 0 ${APERTURE_SIZE} ${APERTURE_SIZE}`}
          width="220"
          height="220"
          aria-hidden="true"
          className="block"
          style={{ overflow: "visible" }}
        >
          {/* Outer ring */}
          <circle
            cx={APERTURE_CENTER}
            cy={APERTURE_CENTER}
            r={APERTURE_CENTER - 4}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          {/* Inner ring */}
          <circle
            cx={APERTURE_CENTER}
            cy={APERTURE_CENTER}
            r={APERTURE_CENTER - 24}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
          {/* Blades */}
          <g ref={apertureGroupRef}>
            {Array.from({ length: BLADE_COUNT }).map((_, i) => {
              const angle = (360 / BLADE_COUNT) * i;
              return (
                <path
                  key={i}
                  data-blade
                  d={buildBladePath(angle)}
                  fill="#0E0E0E"
                  stroke="rgba(192,57,43,0.35)"
                  strokeWidth="0.5"
                  style={{ transformOrigin: `${APERTURE_CENTER}px ${APERTURE_CENTER}px` }}
                />
              );
            })}
          </g>
          {/* Center monogram */}
          <text
            ref={monogramRef}
            x={APERTURE_CENTER}
            y={APERTURE_CENTER}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-display, 'Bebas Neue', sans-serif)"
            fontSize="42"
            fill="#C0392B"
            letterSpacing="2"
          >
            FC
          </text>
        </svg>

        {/* Word display */}
        <div
          ref={wordRef}
          className="font-display text-3xl uppercase tracking-[0.32em] text-text-primary sm:text-4xl"
          style={{ opacity: 0, willChange: "transform, opacity, clip-path" }}
        >
          FRAME
        </div>
      </div>
    </div>
  );
}
