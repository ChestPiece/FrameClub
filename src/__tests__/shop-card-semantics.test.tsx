import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/lib/db/types";
import ShopPage from "@/app/shop/page";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

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

vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => <header data-testid="site-header" />,
}));

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => <footer data-testid="site-footer" />,
}));

vi.mock("@/components/shared/status-badge", () => ({
  StatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
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

const mockProducts: Product[] = [
  {
    id: "1",
    slug: "skyline-r34",
    name: "Nissan Skyline R34",
    brand: "Nissan",
    description: "Legendary build",
    images: ["/test.jpg"],
    price: 5000,
    status: "available",
    deliveryDays: 7,
    years: "1999-2002",
    specs: [],
    backgrounds: [],
  },
];

vi.mock("@/lib/shop/data", () => ({
  getProducts: vi.fn(async () => mockProducts),
}));

vi.mock("@/components/shop/catalog-toolbar", () => ({
  CatalogToolbar: () => <div data-testid="catalog-toolbar" />,
}));

describe("shop product-card link semantics", () => {
  it("does not render nested anchors in product cards", async () => {
    const page = await ShopPage();
    const { container } = render(page);
    const anchors = Array.from(container.querySelectorAll("a"));

    for (const anchor of anchors) {
      expect(anchor.querySelector("a")).toBeNull();
    }
  });
});
