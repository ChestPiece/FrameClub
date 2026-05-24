"use client";

import * as React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  ScrambleTextPlugin,
  TextPlugin,
  DrawSVGPlugin,
  Flip,
} from "gsap/all";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    SplitText,
    ScrambleTextPlugin,
    TextPlugin,
    DrawSVGPlugin,
    Flip
  );
  // ScrollSmoother owns scroll normalization; normalizeScroll(true) breaks trigger measurement and batch onEnter.
  ScrollTrigger.normalizeScroll(false);
  // Reduces spurious refreshes when the mobile browser chrome shows/hides (iOS address bar).
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
