import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { Product } from "@/lib/db/types";

const pushMock = vi.fn();
const mockSubmit = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    render,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    render?: React.ReactElement;
  }) => {
    if (render) {
      return React.cloneElement(render, props, children);
    }
    return <button {...props}>{children}</button>;
  },
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props}>{children}</label>
  ),
}));

const product: Product = {
  id: "p1",
  slug: "r34",
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
};

function fillIdentity() {
  fireEvent.change(screen.getByLabelText("Full Name"), {
    target: { value: "Anas Altaf" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "anas@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Phone"), {
    target: { value: "123" },
  });
}

function fillDelivery() {
  fireEvent.change(screen.getByLabelText("Street Address"), {
    target: { value: "address" },
  });
  fireEvent.change(screen.getByLabelText("City"), {
    target: { value: "Multan" },
  });
}

function advanceStep() {
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));
}

async function walkToPayment() {
  fillIdentity();
  advanceStep();
  // Step 2 active when Back button appears
  await waitFor(() => {
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
  });
  fillDelivery();
  advanceStep();
  // Step 3 active when Next button disappears and Place Order is rendered
  await waitFor(() => {
    expect(screen.queryByRole("button", { name: /Next/i })).toBeNull();
  });
}

describe("CheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    HTMLFormElement.prototype.submit = mockSubmit;
  });

  it("blocks step advance when identity fields are empty", async () => {
    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);

    advanceStep();

    expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email.")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
  });

  it("shows API error on failed create order", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: { message: "Order API failed." },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);
    await walkToPayment();

    fireEvent.click(screen.getByText(/Place Order/i));

    expect(await screen.findByText("Order API failed.")).toBeInTheDocument();
  });

  it("redirects to secured order page when PayFast is unavailable", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            order: { id: "order-1" },
            orderAccessToken: "token-123",
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);
    await walkToPayment();

    fireEvent.click(screen.getByText(/Place Order/i));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/order/order-1?token=token-123");
    });
  });

  it("submits hidden form when PayFast payload exists", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            order: { id: "order-1" },
            payfastUrl: "https://sandbox.payfast.co.za/eng/process",
            payfastData: {
              signature: "sig",
              amount: "5000.00",
            },
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);
    await walkToPayment();

    fireEvent.click(screen.getByText(/Place Order/i));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
