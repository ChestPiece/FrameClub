"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useOverlayMotion } from "@/lib/animation";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";

export type NavItem = {
  href: string;
  label: string;
  number: string;
};

type FullscreenNavProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export function FullscreenNav({ isOpen, onClose, navItems }: FullscreenNavProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // useOverlayMotion handles body scroll lock + clip-reveal + stagger links + reduced motion.
  useOverlayMotion(isOpen, overlayRef, "[data-nav-link]");

  const overlay = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-90 flex flex-col bg-bg-deep"
      style={{
        clipPath: "inset(0% 0% 100% 0%)",
        opacity: 1,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between px-6 py-6 border-b border-border/40">
        <span className="display-kicker text-sm text-text-muted tracking-[0.2em]">
          NAVIGATION
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-button-motion="true"
          className="text-text-muted hover:text-text-primary"
          aria-label="Close navigation"
        >
          <X className="size-5" strokeWidth={1.5} />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col justify-center">
        {navItems.map((item) => (
          <div
            key={item.href}
            data-nav-link
            className="border-b border-brand/20"
            style={{ opacity: 0 }}
          >
            <TransitionLink
              href={item.href}
              onClick={onClose}
              className="group flex w-full items-baseline gap-4 px-6 py-5 text-text-primary hover:text-brand-bright transition-colors duration-150"
            >
              <span className="technical-label text-[10px] text-text-muted group-hover:text-brand-bright transition-colors shrink-0">
                {item.number}
              </span>
              <span
                className="display-kicker leading-none"
                style={{ fontSize: "clamp(2.8rem, 12vw, 7rem)" }}
              >
                {item.label}
              </span>
            </TransitionLink>
          </div>
        ))}
      </nav>

      <div data-nav-link className="px-6 pb-8 pt-6" style={{ opacity: 0 }}>
        <TransitionLink
          href="/shop"
          onClick={onClose}
          data-button-motion="true"
          className="display-kicker block w-full bg-brand py-5 text-center text-lg tracking-[0.3em] text-text-primary hover:bg-brand-mid transition-colors"
        >
          ORDER NOW
        </TransitionLink>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}
