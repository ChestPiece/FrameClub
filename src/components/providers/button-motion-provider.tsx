"use client";

import * as React from "react";
import { gsap } from "@/lib/animation/gsap-config";
import {
  BUTTON_FILL_SELECTOR,
  BUTTON_FILL_TWEENS,
  BUTTON_ICON_SELECTOR,
  BUTTON_ICON_TWEENS,
  BUTTON_LABEL_GHOST_SELECTOR,
  BUTTON_LABEL_SELECTOR,
  BUTTON_LABEL_TWEENS,
  BUTTON_MOTION_LEVEL_ATTR,
  BUTTON_MOTION_SELECTOR,
  BUTTON_MOTION_TWEENS,
  BUTTON_SHEEN_SELECTOR,
  BUTTON_SHEEN_TWEENS,
  type ButtonMotionLevel,
  prefersReducedMotion,
} from "@/lib/animation/button-motion";

type ButtonMotionProviderProps = {
  children: React.ReactNode;
};

function getMotionTarget(eventTarget: EventTarget | null): HTMLElement | null {
  if (!(eventTarget instanceof Element)) return null;
  const target = eventTarget.closest<HTMLElement>(BUTTON_MOTION_SELECTOR);
  if (!target) return null;
  if (target.getAttribute("aria-disabled") === "true") return null;
  if (target instanceof HTMLButtonElement && target.disabled) return null;
  return target;
}

function animateButton(button: HTMLElement, mode: "rest" | "hover" | "press") {
  const level = (button.getAttribute(BUTTON_MOTION_LEVEL_ATTR) ?? "default") as ButtonMotionLevel;
  const tweenSet = BUTTON_MOTION_TWEENS[level] ?? BUTTON_MOTION_TWEENS.default;
  gsap.killTweensOf(button, "scale,y");
  gsap.to(button, tweenSet[mode]);
}

function animateFill(button: HTMLElement, show: boolean) {
  const fill = button.querySelector<HTMLElement>(BUTTON_FILL_SELECTOR);
  if (!fill) return;
  gsap.killTweensOf(fill);
  gsap.to(fill, show ? BUTTON_FILL_TWEENS.fillIn : BUTTON_FILL_TWEENS.fillOut);
}

function animateSheen(button: HTMLElement, show: boolean) {
  const sheen = button.querySelector<HTMLElement>(BUTTON_SHEEN_SELECTOR);
  if (!sheen) return;
  gsap.killTweensOf(sheen);
  if (show) {
    gsap.set(sheen, { xPercent: -120, opacity: 0 });
    gsap.to(sheen, {
      xPercent: 220,
      duration: BUTTON_SHEEN_TWEENS.hover.duration,
      ease: BUTTON_SHEEN_TWEENS.hover.ease,
    });
    gsap.to(sheen, {
      opacity: BUTTON_SHEEN_TWEENS.hover.opacity,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  } else {
    gsap.to(sheen, { opacity: 0, duration: 0.2, ease: "power2.out" });
  }
}

function animateLabel(button: HTMLElement, mode: "rest" | "hover") {
  const primary = button.querySelector<HTMLElement>(BUTTON_LABEL_SELECTOR);
  const ghost = button.querySelector<HTMLElement>(BUTTON_LABEL_GHOST_SELECTOR);
  if (primary) {
    gsap.killTweensOf(primary);
    gsap.to(primary, BUTTON_LABEL_TWEENS.primary[mode]);
  }
  if (ghost) {
    gsap.killTweensOf(ghost);
    gsap.to(ghost, BUTTON_LABEL_TWEENS.ghost[mode]);
  }
}

function animateIcon(button: HTMLElement, mode: "rest" | "hover") {
  const icon = button.querySelector<HTMLElement>(BUTTON_ICON_SELECTOR);
  if (!icon) return;
  gsap.killTweensOf(icon);
  gsap.to(icon, BUTTON_ICON_TWEENS[mode]);
}

export function ButtonMotionProvider({ children }: ButtonMotionProviderProps) {
  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const enter = (button: HTMLElement) => {
      animateButton(button, "hover");
      animateFill(button, true);
      animateSheen(button, true);
      animateLabel(button, "hover");
      animateIcon(button, "hover");
    };

    const leave = (button: HTMLElement) => {
      animateButton(button, "rest");
      animateFill(button, false);
      animateSheen(button, false);
      animateLabel(button, "rest");
      animateIcon(button, "rest");
    };

    const onPointerEnter = (event: Event) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      enter(button);
    };

    const onPointerLeave = (event: Event) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      leave(button);
    };

    const onFocusIn = (event: FocusEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      enter(button);
    };

    const onFocusOut = (event: FocusEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      leave(button);
    };

    const onPointerDown = (event: PointerEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      animateButton(button, "press");
    };

    const onPointerRelease = (event: PointerEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      const mode = event.pointerType === "touch" ? "rest" : "hover";
      animateButton(button, mode);
      if (mode === "rest") {
        animateFill(button, false);
        animateSheen(button, false);
        animateLabel(button, "rest");
        animateIcon(button, "rest");
      }
    };

    const onPointerCancel = (event: Event) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      leave(button);
    };

    document.addEventListener("pointerenter", onPointerEnter, true);
    document.addEventListener("pointerleave", onPointerLeave, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerRelease, true);
    document.addEventListener("pointercancel", onPointerCancel, true);

    return () => {
      document.removeEventListener("pointerenter", onPointerEnter, true);
      document.removeEventListener("pointerleave", onPointerLeave, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerRelease, true);
      document.removeEventListener("pointercancel", onPointerCancel, true);
    };
  }, []);

  return <>{children}</>;
}
