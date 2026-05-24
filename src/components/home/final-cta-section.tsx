"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

const headlineWords = ["READY", "TO", "FRAME", "YOUR", "OBSESSION?"];

export function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonWrapRef = useRef<HTMLDivElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const words = headlineRef.current?.querySelectorAll("[data-word]");
      const buttonEl = buttonWrapRef.current;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (words && words.length) {
          gsap.set(Array.from(words), { opacity: 1, y: 0, clearProps: "all" });
        }
        if (buttonEl) {
          gsap.set(buttonEl, { opacity: 1, scale: 1, clearProps: "all" });
        }
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tweens: gsap.core.Tween[] = [];

        if (words && words.length) {
          const wordTween = gsap.fromTo(
            Array.from(words),
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "expo.out",
              stagger: 0.05,
              scrollTrigger: {
                trigger: headlineRef.current,
                start: "top 80%",
                once: true,
              },
            },
          );
          tweens.push(wordTween);
        }

        if (buttonEl) {
          gsap.set(buttonEl, { autoAlpha: 0, scale: 0.96, transformOrigin: "center center" });
          const buttonTween = gsap.to(buttonEl, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: buttonEl,
              start: "top 85%",
              once: true,
            },
          });
          tweens.push(buttonTween);
        }

        return () => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef} style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--brand) 28%, transparent), transparent 65%)",
        }}
      />
      <div
        className="mx-auto text-center"
        style={{
          position: "relative",
          width: "min(calc(100% - 2rem), 80rem)",
        }}
      >
        <p
          className="font-body text-text-muted"
          style={{ ...KICKER, marginBottom: 32 }}
        >
          Chapter Six · The Question
        </p>
        <h2
          ref={headlineRef}
          className="font-display uppercase text-text-primary"
          style={{
            fontSize: "clamp(3rem, 7.5vw, 7rem)",
            letterSpacing: "0.03em",
            lineHeight: 0.95,
            margin: "0 0 32px",
            fontWeight: 400,
          }}
        >
          <span data-word data-motion-reveal className="inline-block" style={{ opacity: 0, marginRight: "0.25em" }}>
            {headlineWords[0]}
          </span>
          <span data-word data-motion-reveal className="inline-block" style={{ opacity: 0, marginRight: "0.25em" }}>
            {headlineWords[1]}
          </span>
          <span data-word data-motion-reveal className="inline-block" style={{ opacity: 0 }}>
            {headlineWords[2]}
          </span>
          <br />
          <span data-word data-motion-reveal className="inline-block" style={{ opacity: 0, marginRight: "0.25em" }}>
            {headlineWords[3]}
          </span>
          <span data-word data-motion-reveal className="inline-block text-brand-bright" style={{ opacity: 0 }}>
            {headlineWords[4]}
          </span>
        </h2>
        <p
          className="text-text-muted"
          style={{
            maxWidth: 540,
            margin: "0 auto 48px",
            fontSize: 16,
            lineHeight: 1.7,
          }}
        >
          Fully customised frames at a flat Rs. 5,000. Delivered nationwide. Two minutes to specify, seven days to build.
        </p>
        <div ref={buttonWrapRef} style={{ display: "inline-block" }}>
          <Button
            render={<TransitionLink href="/shop" />}
            variant="brand"
            size="xl"
            className="font-display uppercase"
            style={{
              padding: "26px 56px",
              fontSize: 20,
              letterSpacing: "0.18em",
              border: "1px solid var(--brand-bright)",
              background: "var(--brand-bright)",
            }}
          >
            ORDER NOW →
          </Button>
        </div>
      </div>
    </div>
  );
}
