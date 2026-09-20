"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { scrollToCollectionSection } from "@/lib/animation/scroll-to-collection";
import { useHeaderIntroAnimation } from "@/components/layout/hooks/use-header-intro-animation";
import { useHeaderScrollAnimation } from "@/components/layout/hooks/use-header-scroll-animation";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { MOBILE_NAV_ITEMS } from "@/lib/content/nav-constants";
import { FullscreenNav } from "@/components/layout/fullscreen-nav";
import { SiteTicker } from "@/components/layout/site-ticker";
import { cn, isPrefixActive } from "@/lib/utils";

const mobileNavItems = [...MOBILE_NAV_ITEMS];

const NAV_LINKS = [
  { route: "/", label: "Explore" },
  { route: "/shop", label: "Collection" },
  { route: "/about", label: "Story" },
  { route: "/contact", label: "Contact" },
];

interface SiteHeaderProps {
  cartCount?: number;
}

export function SiteHeader({ cartCount = 0 }: SiteHeaderProps) {
  const pathname = usePathname();
  const rootRef = React.useRef<HTMLElement | null>(null);
  const headerTintRef = React.useRef<HTMLDivElement | null>(null);
  const navRowRef = React.useRef<HTMLDivElement | null>(null);
  const logoRef = React.useRef<HTMLAnchorElement | null>(null);
  const tickerWrapRef = React.useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = React.useRef<HTMLButtonElement | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [headerReady, setHeaderReady] = React.useState(false);
  const scrollTriggerReady = useScrollTriggerReady();

  const handleExploreClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;
      event.preventDefault();
      scrollToCollectionSection();
    },
    [pathname],
  );

  const animateUnderline = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, shouldShow: boolean) => {
      const currentTarget = event.currentTarget;
      const underline = currentTarget.querySelector<HTMLElement>("[data-nav-underline]");
      if (!underline) return;

      gsap.killTweensOf(underline);
      gsap.to(underline, {
        scaleX: shouldShow ? 1 : 0,
        transformOrigin: shouldShow ? "left center" : "right center",
        duration: shouldShow ? 0.25 : 0.2,
        ease: shouldShow ? "power2.out" : "power2.in",
      });
    },
    [],
  );

  useHeaderIntroAnimation({
    rootRef,
    scrollTriggerReady,
    headerTintRef,
    navRowRef,
    logoRef,
    tickerWrapRef,
    setHeaderReady,
  });

  useHeaderScrollAnimation({ mobileToggleRef, mobileNavOpen });

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      ref={rootRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "var(--bg-nav)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        borderBottom: "0.5px solid var(--border-subtle)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Scroll tint overlay — GSAP controlled */}
      <div
        ref={headerTintRef}
        className="pointer-events-none absolute inset-0 z-0 bg-bg-deep opacity-0"
        aria-hidden
      />

      {/* Ticker */}
      <div
        ref={tickerWrapRef}
        className={cn(
          `${headerReady ? "gsap-hidden" : ""} relative z-10 overflow-hidden origin-top`,
          mobileNavOpen && "pointer-events-none md:pointer-events-auto",
        )}
        data-header-ticker
      >
        <SiteTicker />
      </div>

      {/* Nav row */}
      <div
        ref={navRowRef}
        data-cart={cartCount > 0 ? "1" : "0"}
        className={cn(
          "fc-nav-row",
          mobileNavOpen && "pointer-events-none md:pointer-events-auto",
        )}
      >
        {/* Logo — col 1 (circular mark only; wordmark is inside the asset) */}
        <TransitionLink
          ref={logoRef}
          href="/"
          data-header-logo
          aria-label="The Frame Club"
          className={`${headerReady ? "gsap-hidden" : ""} fc-nav-logo`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src="/Assets/frame-club-logo.jpg"
            alt=""
            width={104}
            height={104}
            className="fc-nav-logo-img"
            priority
          />
        </TransitionLink>

        {/* Nav — col 2 (desktop only) */}
        <nav
          className="fc-nav-desktop"
          style={{
            alignItems: "center",
            gap: 0,
            justifySelf: "center",
          }}
        >
          {NAV_LINKS.map((item) => {
            const isExplore = item.route === "/";
            const active = isExplore
              ? pathname === "/"
              : item.route === "/shop"
                ? isPrefixActive(pathname, item.route)
                : pathname === item.route;

            return (
              <TransitionLink
                key={item.route}
                href={item.route}
                onClick={isExplore ? handleExploreClick : undefined}
                data-desktop-link
                onMouseEnter={(event) => animateUnderline(event as React.MouseEvent<HTMLElement>, true)}
                onMouseLeave={(event) => animateUnderline(event as React.MouseEvent<HTMLElement>, false)}
                className="fc-nav-link"
                style={{
                  position: "relative",
                  display: "inline-block",
                  padding: "10px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 2,
                      height: 14,
                      background: "var(--brand-bright)",
                    }}
                  />
                )}
                {item.label}
                <span data-nav-underline className="nav-link-underline" />
              </TransitionLink>
            );
          })}
        </nav>

        {/* Cart — only when count > 0 (no cart product today) */}
        {cartCount > 0 ? (
          <TransitionLink
            href="/shop"
            className="fc-nav-cart"
            aria-label={`Cart, ${cartCount} items`}
            style={{
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "var(--text-muted)",
              border: "none",
              padding: "10px 12px",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden="true"
            >
              <path d="M2 3h2l1.5 8.5h7L14 5H5" strokeLinejoin="round" />
              <circle cx="6.5" cy="13.5" r="0.75" fill="currentColor" stroke="none" />
              <circle cx="11.5" cy="13.5" r="0.75" fill="currentColor" stroke="none" />
            </svg>
            <span style={{ color: "var(--text-primary)" }}>Cart · {cartCount}</span>
          </TransitionLink>
        ) : null}

        {/* ORDER NOW — col 4 (desktop only) */}
        <Button
          render={<TransitionLink href="/shop" />}
          data-header-cta
          variant="brand"
          size="default"
          className={cn(
            "fc-nav-cta font-display uppercase",
            headerReady && "gsap-hidden",
          )}
          style={{ letterSpacing: "0.14em" }}
        >
          ORDER NOW →
        </Button>
      </div>

      {/* Mobile hamburger — mobile only, hidden on md+ */}
      <button
        ref={mobileToggleRef}
        type="button"
        data-button-motion="true"
        data-button-motion-level="minimal"
        aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen((previous) => !previous)}
        className="fc-nav-hamburger"
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          transform: "translateY(calc(-50% + 1.25rem))",
          zIndex: 50,
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span className="sr-only">Toggle navigation</span>
        <span
          data-hamburger-bar
          className="absolute h-[1.5px] w-5 -translate-y-1.5 bg-text-primary"
        />
        <span data-hamburger-bar className="absolute h-[1.5px] w-5 bg-text-primary" />
        <span
          data-hamburger-bar
          className="absolute h-[1.5px] w-5 translate-y-1.5 bg-text-primary"
        />
      </button>

      <FullscreenNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        navItems={mobileNavItems}
      />
    </header>
  );
}
