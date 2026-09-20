import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createOrderMock,
  applyWebhookMock,
  verifySignatureMock,
  createOrderAccessTokenMock,
  getPayFastUrlMock,
  generatePayFastSignatureMock,
  createServiceClientMock,
  createClientMock,
  getOrderByIdMock,
  getProductBySlugMock,
  sendOrderConfirmationMock,
  sendAdminNotificationMock,
} = vi.hoisted(() => ({
  createOrderMock: vi.fn(),
  applyWebhookMock: vi.fn(),
  verifySignatureMock: vi.fn(),
  createOrderAccessTokenMock: vi.fn(),
  getPayFastUrlMock: vi.fn(),
  generatePayFastSignatureMock: vi.fn(),
  createServiceClientMock: vi.fn(),
  createClientMock: vi.fn(),
  getOrderByIdMock: vi.fn(),
  getProductBySlugMock: vi.fn(),
  sendOrderConfirmationMock: vi.fn(),
  sendAdminNotificationMock: vi.fn(),
}));

vi.mock("@/lib/db/services", () => ({
  createOrder: createOrderMock,
  applyWebhook: applyWebhookMock,
  getOrderById: getOrderByIdMock,
}));

vi.mock("@/lib/payment/order-access-token", () => ({
  createOrderAccessToken: createOrderAccessTokenMock,
}));

vi.mock("@/lib/payment/payfast", () => ({
  payfastConfig: {
    merchantId: "merchant",
    merchantKey: "key",
  },
  getPayFastUrl: getPayFastUrlMock,
  generatePayFastSignature: generatePayFastSignatureMock,
  verifyPayFastSignature: verifySignatureMock,
  assertPayfastSigningConfigured: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServiceClient: createServiceClientMock,
  createClient: createClientMock,
}));

vi.mock("@/lib/shop/data", () => ({
  getProductBySlug: getProductBySlugMock,
}));

vi.mock("@/lib/emails/send", () => ({
  sendOrderConfirmation: sendOrderConfirmationMock,
  sendAdminNotification: sendAdminNotificationMock,
}));

import { POST as postOrderRoute } from "@/app/api/orders/route";
import { POST as postWebhookRoute } from "@/app/api/payfast/webhook/route";
import { GET as getOrderByIdRoute } from "@/app/api/orders/[id]/route";

describe("api routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.ADMIN_EMAIL = "admin@frameclub.pk";
    getPayFastUrlMock.mockReturnValue("https://sandbox.payfast.co.za/eng/process");
    generatePayFastSignatureMock.mockReturnValue("sig");
    createOrderAccessTokenMock.mockReturnValue("token-123");
  });

  it("POST /api/orders returns payfast payload with secured return url", async () => {
    createOrderMock.mockResolvedValue({
      data: {
        id: "order-1",
        orderNumber: "FC-100001",
        productSlug: "r34",
        price: 5000,
      },
    });

    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Anas Altaf",
        customerEmail: "anas@example.com",
        customerPhone: "123",
        customerAddress: "addr",
        customerCity: "Multan",
        productSlug: "r34",
        background: "Midnight",
      }),
    });

    const res = await postOrderRoute(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.orderAccessToken).toBe("token-123");
    expect(json.data.payfastData.return_url).toContain(
      "/order/order-1?token=token-123"
    );
  });

  it("POST /api/orders validates missing fields", async () => {
    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName: "Anas" }),
    });

    const res = await postOrderRoute(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/payfast/webhook rejects invalid signatures", async () => {
    createServiceClientMock.mockResolvedValue({ from: vi.fn() });
    verifySignatureMock.mockReturnValue(false);

    const form = new FormData();
    form.set("m_payment_id", "order-1");
    form.set("signature", "bad");

    const req = new Request("http://localhost:3000/api/payfast/webhook", {
      method: "POST",
      body: form,
    });

    const res = await postWebhookRoute(req);

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Invalid Signature");
  });

  it("POST /api/payfast/webhook rejects amount mismatch", async () => {
    verifySignatureMock.mockReturnValue(true);
    const single = vi.fn().mockResolvedValue({ data: { price: 5000 }, error: null });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn(() => ({ select }));
    createServiceClientMock.mockResolvedValue({ from });

    const form = new FormData();
    form.set("m_payment_id", "order-1");
    form.set("payment_status", "COMPLETE");
    form.set("amount_gross", "4999");
    form.set("signature", "sig");

    const req = new Request("http://localhost:3000/api/payfast/webhook", {
      method: "POST",
      body: form,
    });

    const res = await postWebhookRoute(req);

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Amount Mismatch");
  });

  it("POST /api/payfast/webhook updates paid order and sends emails", async () => {
    verifySignatureMock.mockReturnValue(true);

    // maybeSingle: idempotency check — no duplicate found (payment not yet processed)
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    // single: price lookup
    const single = vi.fn().mockResolvedValue({ data: { price: 5000 }, error: null });
    const eq = vi.fn().mockReturnValue({ single, maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn(() => ({ select }));
    createServiceClientMock.mockResolvedValue({ from });

    applyWebhookMock.mockResolvedValue({
      data: {
        id: "order-1",
        productSlug: "r34",
        customerEmail: "anas@example.com",
      },
      previousPaymentStatus: "pending",
    });
    getProductBySlugMock.mockResolvedValue({ name: "Nissan Skyline R34" });

    const form = new FormData();
    form.set("m_payment_id", "order-1");
    form.set("payment_status", "COMPLETE");
    form.set("amount_gross", "5000");
    form.set("pf_payment_id", "pf-1");
    form.set("signature", "sig");

    const req = new Request("http://localhost:3000/api/payfast/webhook", {
      method: "POST",
      body: form,
    });

    const res = await postWebhookRoute(req);

    expect(res.status).toBe(200);
    expect(applyWebhookMock).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: "order-1",
        paymentStatus: "paid",
        paymentId: "pf-1",
      }),
      expect.any(Object)
    );
    expect(sendOrderConfirmationMock).toHaveBeenCalled();
    expect(sendAdminNotificationMock).toHaveBeenCalled();
  });

  it("GET /api/orders/[id] returns 503 when ADMIN_EMAIL is not configured", async () => {
    const prev = process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_EMAIL;
    createClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { email: "admin@frameclub.pk" } } }),
      },
    });

    const res = await getOrderByIdRoute(
      new Request("http://localhost:3000/api/orders/o1"),
      { params: Promise.resolve({ id: "o1" }) },
    );
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.error.code).toBe("ADMIN_NOT_CONFIGURED");
    process.env.ADMIN_EMAIL = prev;
  });

  it("GET /api/orders/[id] returns order for configured admin", async () => {
    process.env.ADMIN_EMAIL = "admin@frameclub.pk";
    createClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { email: "admin@frameclub.pk" } } }),
      },
    });
    getOrderByIdMock.mockResolvedValue({
      id: "o1",
      orderNumber: "FC-100001",
      customerName: "A",
      customerEmail: "a@a.com",
      customerPhone: "1",
      customerAddress: "x",
      customerCity: "y",
      productId: "p",
      productSlug: "r34",
      customization: { background: "b", notes: "" },
      price: 5000,
      paymentStatus: "paid",
      orderStatus: "pending",
      createdAt: "2026-01-01T00:00:00Z",
    });

    const res = await getOrderByIdRoute(
      new Request("http://localhost:3000/api/orders/o1"),
      { params: Promise.resolve({ id: "o1" }) },
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.order.id).toBe("o1");
  });

  it("POST /api/orders fails when NEXT_PUBLIC_SITE_URL not set", async () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;

    createOrderMock.mockResolvedValue({
      data: {
        id: "order-2",
        orderNumber: "FC-100002",
        productSlug: "r34",
        price: 5000,
      },
    });

    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Anas Altaf",
        customerEmail: "anas@example.com",
        customerPhone: "123",
        customerAddress: "addr",
        customerCity: "Multan",
        productSlug: "r34",
        background: "Midnight",
      }),
    });

    const res = await postOrderRoute(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error.code).toBe("CONFIG_ERROR");

    process.env.NEXT_PUBLIC_SITE_URL = prev;
  });

  it("POST /api/payfast/webhook ignores duplicate pf_payment_id (idempotency)", async () => {
    verifySignatureMock.mockReturnValue(true);

    // First .from() call: idempotency check — maybeSingle() finds an existing record
    const maybeSingle = vi.fn().mockResolvedValue({ data: { id: "order-1" }, error: null });
    const eqIdempotency = vi.fn().mockReturnValue({ maybeSingle });
    const selectIdempotency = vi.fn().mockReturnValue({ eq: eqIdempotency });
    const from = vi.fn(() => ({ select: selectIdempotency }));
    createServiceClientMock.mockResolvedValue({ from });

    const form = new FormData();
    form.set("m_payment_id", "order-1");
    form.set("payment_status", "COMPLETE");
    form.set("amount_gross", "5000");
    form.set("pf_payment_id", "pf-already-processed");
    form.set("signature", "sig");

    const req = new Request("http://localhost:3000/api/payfast/webhook", {
      method: "POST",
      body: form,
    });

    const res = await postWebhookRoute(req);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
    expect(applyWebhookMock).not.toHaveBeenCalled();
  });
});
