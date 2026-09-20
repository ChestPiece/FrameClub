import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ScrollTriggerEnvironmentProvider } from "@/components/providers/scroll-trigger-environment";
import { GSAPProvider } from "@/components/providers/gsap-provider";
import { ButtonMotionProvider } from "@/components/providers/button-motion-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteLoader } from "@/components/layout/site-loader";
import { AppReveal } from "@/components/layout/app-reveal";
import { TransitionProvider } from "@/components/layout/page-transition";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "The Frame Club",
  description: "Where Speed Meets Art",
  icons: {
    icon: "/Assets/frame-club-logo.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, bebasNeue.variable, "font-sans")}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-9999 focus:bg-brand focus:px-4 focus:py-2 focus:text-text-primary display-kicker"
        >
          Skip to main content
        </a>
        <GSAPProvider>
          <ButtonMotionProvider>
            <TransitionProvider>
              <ScrollTriggerEnvironmentProvider>
                <SiteLoader />
                <AppReveal>
                  <SiteHeader />
                  <SmoothScrollProvider>{children}</SmoothScrollProvider>
                </AppReveal>
              </ScrollTriggerEnvironmentProvider>
            </TransitionProvider>
          </ButtonMotionProvider>
        </GSAPProvider>
      </body>
    </html>
  );
}
