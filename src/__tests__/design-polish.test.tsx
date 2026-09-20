import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import type { OrderRecord } from "@/lib/db/types";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    <img {...props} alt={props.alt ?? ""} data-fill={fill ? "true" : "false"} />
  ),
}));

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => <footer data-testid="site-footer" />,
}));

vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => <header data-testid="site-header" />,
}));

vi.mock("@/components/layout/site-loader", () => ({
  SiteLoader: () => null,
}));

vi.mock("@/components/layout/app-reveal", () => ({
  AppReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/layout/page-transition", () => ({
  TransitionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TransitionLink: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/providers/smooth-scroll-provider", () => ({
  SmoothScrollProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/providers/gsap-provider", () => ({
  GSAPProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    render,
    children,
    ...props
  }: {
    render?: React.ReactElement;
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    if (render) {
      return React.cloneElement(render, props, children);
    }
    return <button {...props}>{children}</button>;
  },
}));

vi.mock("@/components/shared/animated-cta-link", () => ({
  AnimatedCTALink: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/content/copy-constants", async () => {
  const actual = await vi.importActual<typeof import("@/lib/content/copy-constants")>("@/lib/content/copy-constants");
  return actual;
});

vi.mock("@/lib/animation/gsap-config", () => ({
  gsap: {
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
    killTweensOf: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({ add: vi.fn(), play: vi.fn(), kill: vi.fn() })),
  },
  ScrollTrigger: {},
}));

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-body" }),
  Bebas_Neue: () => ({ variable: "--font-display" }),
}));

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}));

const getOrderByIdMock = vi.fn();
const getProductBySlugMock = vi.fn();
const getRelatedProductsMock = vi.fn();

vi.mock("@/lib/db/services", () => ({
  getOrderById: getOrderByIdMock,
}));

vi.mock("@/lib/shop/data", () => ({
  getProductBySlug: getProductBySlugMock,
  getRelatedProducts: getRelatedProductsMock,
}));

vi.mock("@/lib/payment/order-access-token", () => ({
  verifyOrderAccessToken: () => true,
}));

describe("Design polish components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders not-found page content and CTA links", async () => {
    const { default: NotFoundPage } = await import("@/app/not-found");
    render(<NotFoundPage />);

    expect(screen.getByText("ERROR CODE: 404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PAGE NOT FOUND" })).toBeInTheDocument();

    const collectionLink = screen.getByRole("link", { name: "BACK TO COLLECTION" });
    expect(collectionLink).toHaveAttribute("href", "/shop");

    const contactLink = screen.getByRole("link", { name: /Or contact the workshop/i });
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders EmptyState with optional CTA", async () => {
    const { EmptyState } = await import("@/components/shared/empty-state");
    const { rerender } = render(
      <EmptyState
        label="THE COLLECTION"
        title="COMING SOON"
        description="New frames are being added."
        cta={{ label: "VISIT INSTAGRAM", href: "https://instagram.com/frameclub__" }}
      />,
    );

    expect(screen.getByText("THE COLLECTION")).toBeInTheDocument();
    expect(screen.getByText("COMING SOON")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "VISIT INSTAGRAM" })).toHaveAttribute(
      "href",
      "https://instagram.com/frameclub__",
    );

    rerender(<EmptyState title="EMPTY" description="No records" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders featured collection empty state when no products", async () => {
    const { FeaturedCollectionSection } = await import("@/components/home/sections/featured-collection-section");
    render(<FeaturedCollectionSection products={[]} />);

    expect(screen.getByText("COMING SOON")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "VISIT INSTAGRAM" })).toHaveAttribute(
      "href",
      "https://instagram.com/frameclub__",
    );
  });

  it("uses muted text and brand CTA button (no decorative glow shadow)", async () => {
    const { FinalCTASection } = await import("@/components/home/sections/final-cta-section");
    const { container } = render(<FinalCTASection />);

    const cta = screen.getByRole("link", { name: /ORDER NOW/i });
    expect(cta.className).not.toMatch(/shadow-\[/);
    expect(container.querySelector(".text-text-muted")).toBeInTheDocument();
  });

  it("includes global skip-to-content link in layout", async () => {
    const layoutModule = await import("@/app/layout");
    const RootLayout = layoutModule.default;
    const tree = RootLayout({ children: <div>Child</div> });
    render(tree as React.ReactElement);

    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("shows payment issue state and retry CTA on failed order", async () => {
    const failedOrder: OrderRecord = {
      id: "order-1",
      orderNumber: "FC-100001",
      customerName: "Anas",
      customerEmail: "anas@example.com",
      customerPhone: "123",
      customerAddress: "addr",
      customerCity: "Multan",
      productId: "p1",
      productSlug: "r34",
      customization: { background: "carbon-grid", notes: "" },
      price: 5000,
      paymentStatus: "failed",
      orderStatus: "pending",
      createdAt: "2026-01-01T00:00:00Z",
    };
    getOrderByIdMock.mockResolvedValueOnce(failedOrder);
    getProductBySlugMock.mockResolvedValueOnce({ name: "R34" });

    const { default: OrderPage } = await import("@/app/order/[id]/page");
    const page = await OrderPage({
      params: Promise.resolve({ id: "order-1" }),
      searchParams: Promise.resolve({ token: "t" }),
    });
    render(page);

    expect(screen.getByRole("heading", { name: "PAYMENT ISSUE" })).toBeInTheDocument();
    expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "TRY AGAIN" })).toHaveAttribute(
      "href",
      "/checkout?orderId=order-1&token=t",
    );
  });

  it("hides related section when there are no related products", async () => {
    getProductBySlugMock.mockResolvedValueOnce({
      id: "p1",
      slug: "r34",
      name: "R34",
      brand: "Nissan",
      description: "desc",
      images: ["/x.jpg"],
      price: 5000,
      status: "available",
      deliveryDays: 7,
      years: "1999-2002",
      specs: [],
      backgrounds: [{ label: "Carbon", value: "carbon-grid", swatch: "#111" }],
    });
    getRelatedProductsMock.mockResolvedValueOnce([]);
    const { default: ProductPage } = await import("@/app/shop/[slug]/page");
    const page = await ProductPage({ params: Promise.resolve({ slug: "r34" }) });
    render(page);
    expect(screen.queryByRole("heading", { name: "YOU MIGHT ALSO LIKE" })).not.toBeInTheDocument();
  });
});
