"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { SITE_LOADER_DONE_EVENT } from "@/components/layout/site-loader";
import { useScrollTriggerEnvironment } from "@/components/providers/scroll-trigger-environment";
import { cn } from "@/lib/utils";

export const APP_REVEAL_DONE_EVENT = "frameclub:app-reveal-done";

const SITE_LOADER_DONE_FLAG = "__frameClubLoaderDone";
const APP_REVEAL_FALLBACK_MS = 3000;

declare global {
  interface Window {
    __frameClubLoaderDone?: boolean;
    /** Set when app shell reveal finishes; SmoothScrollProvider reads on mount to avoid missing APP_REVEAL_DONE. */
    __frameClubAppRevealDone?: boolean;
  }
}

function dispatchAppRevealDone() {
  window.__frameClubAppRevealDone = true;
  window.dispatchEvent(new Event(APP_REVEAL_DONE_EVENT));
}

export function AppReveal({ children }: { children: React.ReactNode }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { setAppShellVisible } = useScrollTriggerEnvironment();
  const [revealDone, setRevealDone] = React.useState(false);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || typeof window === "undefined") return;

      const markShellVisible = () => {
        setAppShellVisible(true);
      };

      const finishReveal = () => {
        setRevealDone(true);
        markShellVisible();
        dispatchAppRevealDone();
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { autoAlpha: 1, y: 0 });
        finishReveal();
        return;
      }

      gsap.set(el, { autoAlpha: 0, y: 12 });

      let done = false;
      let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

      const reveal = () => {
        if (done) return;
        done = true;
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          onComplete: finishReveal,
        });
      };

      const onLoaderDone = () => {
        reveal();
      };

      if (window[SITE_LOADER_DONE_FLAG]) {
        reveal();
        return;
      }

      window.addEventListener(SITE_LOADER_DONE_EVENT, onLoaderDone, { once: true });
      fallbackTimer = setTimeout(reveal, APP_REVEAL_FALLBACK_MS);

      return () => {
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        window.removeEventListener(SITE_LOADER_DONE_EVENT, onLoaderDone);
      };
    },
    { scope: rootRef, dependencies: [setAppShellVisible] }
  );

  return (
    <div ref={rootRef} className={cn(!revealDone && "will-change-transform")}>
      {children}
    </div>
  );
}
