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

export function SiteLoader() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLParagraphElement>(null);
  const headlineRef = React.useRef<HTMLParagraphElement>(null);
  const barContainerRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      const label = labelRef.current;
      const headline = headlineRef.current;
      const barContainer = barContainerRef.current;
      const bar = barRef.current;
      if (!el || !label || !headline || !barContainer || !bar) return;
      if (typeof window === "undefined") return;

      const hideLoader = () => {
        gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
      };

      const markDoneAndDispatch = () => {
        window[SITE_LOADER_DONE_FLAG] = true;
        window.dispatchEvent(new Event(SITE_LOADER_DONE_EVENT));
      };

      if (window[SITE_LOADER_DONE_FLAG]) {
        hideLoader();
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        hideLoader();
        markDoneAndDispatch();
        return;
      }

      gsap.set(el, {
        autoAlpha: 1,
        pointerEvents: "auto",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      });
      gsap.set([label, headline, barContainer], { autoAlpha: 0 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      let timelineCompleted = false;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          timelineCompleted = true;
          gsap.set(el, {
            autoAlpha: 0,
            pointerEvents: "none",
            clearProps: "clipPath",
          });
          markDoneAndDispatch();
        },
      });

      tl.addLabel("intro")
        .to(label, { autoAlpha: 1, y: 0, duration: 0.25 }, "intro")
        .to(headline, { autoAlpha: 1, y: 0, duration: 0.3 }, "intro+=0.1")
        .to(barContainer, { autoAlpha: 1, duration: 0.2 }, "intro+=0.25")
        .addLabel("load", "+=0.1")
        .to(bar, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "load")
        .addLabel("exit", "+=0.05")
        .to(
          el,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            duration: 0.3,
            ease: "power4.inOut",
          },
          "exit"
        );

      return () => {
        tl.kill();
        if (!timelineCompleted && !window[SITE_LOADER_DONE_FLAG]) {
          hideLoader();
          markDoneAndDispatch();
        }
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-bg-deep px-6 text-center will-change-[clip-path]"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <p
          ref={labelRef}
          className="technical-label translate-y-2 text-[10px] uppercase tracking-[0.35em] text-text-muted"
        >
          Frame Club Pakistan
        </p>
        <p
          ref={headlineRef}
          className="display-kicker translate-y-4 text-4xl tracking-[0.12em] text-text-primary sm:text-5xl md:text-6xl"
        >
          WHERE SPEED MEETS ART
        </p>
        <div
          ref={barContainerRef}
          className="mt-8 h-[2px] w-48 overflow-hidden bg-border sm:w-56"
        >
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-brand-bright will-change-transform"
          />
        </div>
      </div>
    </div>
  );
}
