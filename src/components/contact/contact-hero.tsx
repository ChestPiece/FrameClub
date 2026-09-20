"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

type Props = {
  chapterLabel: string;
  title: string;
  subtitle: string;
};

export function ContactHero({ chapterLabel, title, subtitle }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const words = titleRef.current?.querySelectorAll("[data-contact-word]");
      if (!words || words.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(Array.from(words), { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          Array.from(words),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.08,
          },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady, title] },
  );

  const words = title.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-deep texture-overlay"
      style={{ paddingTop: "calc(7.5rem + 40px)", paddingBottom: 80 }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          left: "-10vw",
          bottom: "-10vw",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle at bottom left, color-mix(in srgb, var(--brand) 28%, transparent), transparent 60%)",
        }}
      />
      <div
        className="relative z-10 mx-auto"
        style={{ width: "min(calc(100% - 2rem), 80rem)" }}
      >
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "auto 1fr auto",
            gap: 32,
            paddingBottom: 28,
            marginBottom: 56,
          }}
        >
          <p className="font-body uppercase text-text-muted" style={KICKER}>
            {chapterLabel}
          </p>
          <div style={{ height: 1, background: "var(--border)" }} />
          <p className="font-body uppercase text-text-muted" style={KICKER}>
            Multan · Pakistan
          </p>
        </div>

        <div style={{ maxWidth: 1100 }}>
          <span
            className="block bg-brand-bright"
            style={{ width: 96, height: 1, marginBottom: 40 }}
          />
          <h1
            ref={titleRef}
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
              lineHeight: 0.95,
              letterSpacing: "0.03em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            {words.map((w, i) => (
              <span
                key={`${w}-${i}`}
                data-contact-word
                className={`inline-block${i === words.length - 1 ? " text-brand-bright" : ""}`}
                style={{ opacity: 0, marginRight: "0.25em" }}
              >
                {w}
              </span>
            ))}
          </h1>

          <p
            className="text-text-muted"
            style={{
              maxWidth: 620,
              marginTop: 48,
              fontSize: 17,
              lineHeight: 1.75,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
