import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mocks — must be declared before any vi.mock() calls
// ---------------------------------------------------------------------------
const { createClientMock, createServiceClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  createServiceClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
  createServiceClient: createServiceClientMock,
}));

// Import after mocks are wired up
import {
  parsePaymentStatus,
  parseOrderStatus,
  createOrder,
  applyWebhook,
  createContactSubmission,
  createNotifySubscription,
} from "@/lib/db/services";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Minimal raw order row as Supabase would return it */
function makeOrderRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "order-1",
    order_number: "FC-100001",
    customer_name: "Anas Altaf",
    customer_email: "anas@example.com",
    customer_phone: "123",
    customer_address: "123 Street",
    customer_city: "Lahore",
    product_id: "product-1",
    product_slug: "r34",
    customization: { background: "Midnight", notes: "" },
    price: 5000,
    payment_status: "pending",
    order_status: "pending",
    created_at: "2026-01-01T00:00:00Z",
    payfast_payment_id: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// parsePaymentStatus
// ---------------------------------------------------------------------------
describe("parsePaymentStatus", () => {
  it('returns "paid" for "paid"', () => {
    expect(parsePaymentStatus("paid")).toBe("paid");
  });

  it('returns "failed" for "failed"', () => {
    expect(parsePaymentStatus("failed")).toBe("failed");
  });

  it('returns "pending" for "pending"', () => {
    expect(parsePaymentStatus("pending")).toBe("pending");
  });

  it('defaults to "pending" for an unrecognised string', () => {
    expect(parsePaymentStatus("invalid")).toBe("pending");
  });

  it('defaults to "pending" for null', () => {
    expect(parsePaymentStatus(null)).toBe("pending");
  });
});

// ---------------------------------------------------------------------------
// parseOrderStatus
// ---------------------------------------------------------------------------
describe("parseOrderStatus", () => {
  it('returns "pending" for "pending"', () => {
    expect(parseOrderStatus("pending")).toBe("pending");
  });

  it('returns "confirmed" for "confirmed"', () => {
    expect(parseOrderStatus("confirmed")).toBe("confirmed");
  });

  it('returns "in_production" for "in_production"', () => {
    expect(parseOrderStatus("in_production")).toBe("in_production");
  });

  it('returns "shipped" for "shipped"', () => {
    expect(parseOrderStatus("shipped")).toBe("shipped");
  });

  it('returns "delivered" for "delivered"', () => {
    expect(parseOrderStatus("delivered")).toBe("delivered");
  });

  it('defaults to "pending" for an unrecognised string', () => {
    expect(parseOrderStatus("invalid")).toBe("pending");
  });

  it('defaults to "pending" for null', () => {
    expect(parseOrderStatus(null)).toBe("pending");
  });
});

// ---------------------------------------------------------------------------
// createOrder
// ---------------------------------------------------------------------------
describe("createOrder", () => {
  const validInput = {
    customerName: "Anas Altaf",
    customerEmail: "anas@example.com",
    customerPhone: "123",
    customerAddress: "123 Street",
    customerCity: "Lahore",
    productSlug: "r34",
    background: "Midnight",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("happy path — returns OrderRecord when product and order are found", async () => {
    const product = { id: "product-1", price: 5000, slug: "r34" };
    const orderRow = makeOrderRow();

    const productSingle = vi.fn().mockResolvedValue({ data: product, error: null });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });

    const orderSingle = vi.fn().mockResolvedValue({ data: orderRow, error: null });
    const orderSelectAfterInsert = vi.fn().mockReturnValue({ single: orderSingle });
    const orderInsert = vi.fn().mockReturnValue({ select: orderSelectAfterInsert });

    const from = vi.fn((table: string) => {
      if (table === "products") return { select: productSelect };
      if (table === "orders") return { insert: orderInsert };
      throw new Error(`Unexpected table: ${table}`);
    });
    createClientMock.mockResolvedValue({ from });

    const result = await createOrder(validInput);

    expect(result).toEqual({
      data: expect.objectContaining({
        id: "order-1",
        orderNumber: "FC-100001",
        productSlug: "r34",
        price: 5000,
        paymentStatus: "pending",
        orderStatus: "pending",
      }),
    });
  });

  it("returns PRODUCT_NOT_FOUND when product query fails", async () => {
    const productSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "not found" } });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });
    const from = vi.fn(() => ({ select: productSelect }));
    createClientMock.mockResolvedValue({ from });

    const result = await createOrder(validInput);

    expect(result).toEqual({ error: "PRODUCT_NOT_FOUND" });
  });

  it("returns ORDER_CREATION_FAILED on a non-duplicate insertion error", async () => {
    const product = { id: "product-1", price: 5000, slug: "r34" };
    const productSingle = vi.fn().mockResolvedValue({ data: product, error: null });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });

    const orderSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: { code: "42601", message: "syntax error" } });
    const orderSelectAfterInsert = vi.fn().mockReturnValue({ single: orderSingle });
    const orderInsert = vi.fn().mockReturnValue({ select: orderSelectAfterInsert });

    const from = vi.fn((table: string) => {
      if (table === "products") return { select: productSelect };
      if (table === "orders") return { insert: orderInsert };
      throw new Error(`Unexpected table: ${table}`);
    });
    createClientMock.mockResolvedValue({ from });

    const result = await createOrder(validInput);

    expect(result).toEqual({ error: "ORDER_CREATION_FAILED" });
  });

  it("returns CATEGORY_NOT_ORDERABLE for non-diecast products", async () => {
    const product = { id: "product-2", price: 0, slug: "custom-football-frame-classic", category: "football" };
    const productSingle = vi.fn().mockResolvedValue({ data: product, error: null });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });
    const from = vi.fn(() => ({ select: productSelect }));
    createClientMock.mockResolvedValue({ from });

    const result = await createOrder(validInput);

    expect(result).toEqual({ error: "CATEGORY_NOT_ORDERABLE" });
  });

  it("retries on 23505 (unique violation) and succeeds on second attempt", async () => {
    const product = { id: "product-1", price: 5000, slug: "r34" };
    const orderRow = makeOrderRow();

    const productSingle = vi.fn().mockResolvedValue({ data: product, error: null });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });

    // First call → 23505 collision; second call → success
    const orderSingle = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: { code: "23505" } })
      .mockResolvedValueOnce({ data: orderRow, error: null });
    const orderSelectAfterInsert = vi.fn().mockReturnValue({ single: orderSingle });
    const orderInsert = vi.fn().mockReturnValue({ select: orderSelectAfterInsert });

    const from = vi.fn((table: string) => {
      if (table === "products") return { select: productSelect };
      if (table === "orders") return { insert: orderInsert };
      throw new Error(`Unexpected table: ${table}`);
    });
    createClientMock.mockResolvedValue({ from });

    const result = await createOrder(validInput);

    expect(orderSingle).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      data: expect.objectContaining({ id: "order-1" }),
    });
  });
});

// ---------------------------------------------------------------------------
// applyWebhook
// ---------------------------------------------------------------------------
describe("applyWebhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ORDER_NOT_FOUND when the order does not exist", async () => {
    const fetchSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "not found" } });
    const fetchEq = vi.fn().mockReturnValue({ single: fetchSingle });
    const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });
    const from = vi.fn(() => ({ select: fetchSelect, update: vi.fn() }));

    const result = await applyWebhook(
      { orderId: "order-1", paymentStatus: "paid" },
      { supabaseClient: { from } as never }
    );

    expect(result).toEqual({ error: "ORDER_NOT_FOUND" });
  });

  it("updates order to confirmed when payment becomes paid and order was pending", async () => {
    const currentRow = { order_status: "pending", payment_status: "pending" };
    const updatedRow = makeOrderRow({ payment_status: "paid", order_status: "confirmed" });

    const fetchSingle = vi
      .fn()
      .mockResolvedValue({ data: currentRow, error: null });
    const fetchEq = vi.fn().mockReturnValue({ single: fetchSingle });
    const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

    const updateSingle = vi.fn().mockResolvedValue({ data: updatedRow, error: null });
    const updateSelectAfterEq = vi.fn().mockReturnValue({ single: updateSingle });
    const updateEq = vi.fn().mockReturnValue({ select: updateSelectAfterEq });
    const update = vi.fn().mockReturnValue({ eq: updateEq });

    const from = vi.fn(() => ({ select: fetchSelect, update }));

    const result = await applyWebhook(
      { orderId: "order-1", paymentStatus: "paid", paymentId: "pf-1" },
      { supabaseClient: { from } as never }
    );

    expect(result).toEqual({
      data: expect.objectContaining({
        paymentStatus: "paid",
        orderStatus: "confirmed",
      }),
      previousPaymentStatus: "pending",
    });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_status: "paid",
        order_status: "confirmed",
        payfast_payment_id: "pf-1",
      })
    );
  });

  it("keeps existing order status (confirmed) when payment paid but order already confirmed", async () => {
    const currentRow = { order_status: "confirmed", payment_status: "pending" };
    const updatedRow = makeOrderRow({ payment_status: "paid", order_status: "confirmed" });

    const fetchSingle = vi
      .fn()
      .mockResolvedValue({ data: currentRow, error: null });
    const fetchEq = vi.fn().mockReturnValue({ single: fetchSingle });
    const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

    const updateSingle = vi.fn().mockResolvedValue({ data: updatedRow, error: null });
    const updateSelectAfterEq = vi.fn().mockReturnValue({ single: updateSingle });
    const updateEq = vi.fn().mockReturnValue({ select: updateSelectAfterEq });
    const update = vi.fn().mockReturnValue({ eq: updateEq });

    const from = vi.fn(() => ({ select: fetchSelect, update }));

    const result = await applyWebhook(
      { orderId: "order-1", paymentStatus: "paid" },
      { supabaseClient: { from } as never }
    );

    expect(result).toEqual({
      data: expect.objectContaining({ orderStatus: "confirmed" }),
      previousPaymentStatus: "pending",
    });
    // order_status must NOT be changed back to "pending"
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ order_status: "confirmed" })
    );
  });

  it("returns UPDATE_FAILED when the update query errors", async () => {
    const currentRow = { order_status: "pending", payment_status: "pending" };

    const fetchSingle = vi
      .fn()
      .mockResolvedValue({ data: currentRow, error: null });
    const fetchEq = vi.fn().mockReturnValue({ single: fetchSingle });
    const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

    const updateSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "update failed" } });
    const updateSelectAfterEq = vi.fn().mockReturnValue({ single: updateSingle });
    const updateEq = vi.fn().mockReturnValue({ select: updateSelectAfterEq });
    const update = vi.fn().mockReturnValue({ eq: updateEq });

    const from = vi.fn(() => ({ select: fetchSelect, update }));

    const result = await applyWebhook(
      { orderId: "order-1", paymentStatus: "paid" },
      { supabaseClient: { from } as never }
    );

    expect(result).toEqual({ error: "UPDATE_FAILED" });
  });
});

// ---------------------------------------------------------------------------
// createContactSubmission
// ---------------------------------------------------------------------------
describe("createContactSubmission", () => {
  const validInput = {
    name: "Anas Altaf",
    email: "anas@example.com",
    message: "Hello there",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a ContactSubmission on success", async () => {
    const row = {
      id: "contact-1",
      name: "Anas Altaf",
      email: "anas@example.com",
      message: "Hello there",
      intent: "general",
      meta: null,
      created_at: "2026-01-01T00:00:00Z",
    };

    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn(() => ({ insert }));
    createClientMock.mockResolvedValue({ from });

    const result = await createContactSubmission(validInput);

    expect(result).toEqual({
      id: "contact-1",
      name: "Anas Altaf",
      email: "anas@example.com",
      message: "Hello there",
      intent: "general",
      meta: null,
      createdAt: "2026-01-01T00:00:00Z",
    });
  });

  it("persists custom-frame intent + meta", async () => {
    const row = {
      id: "contact-2",
      name: "Anas Altaf",
      email: "anas@example.com",
      message: "Team brief",
      intent: "custom-frame",
      meta: {
        team: "Real Madrid",
        playerName: "Vinicius",
        jerseyNumber: "07",
        frameSize: "medium",
        referenceUrl: "https://example.com/jersey.jpg",
      },
      created_at: "2026-01-01T00:00:00Z",
    };

    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn(() => ({ insert }));
    createClientMock.mockResolvedValue({ from });

    const result = await createContactSubmission({
      ...validInput,
      message: "Team brief",
      intent: "custom-frame",
      meta: {
        team: "Real Madrid",
        playerName: "Vinicius",
        jerseyNumber: "07",
        frameSize: "medium",
        referenceUrl: "https://example.com/jersey.jpg",
      },
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        intent: "custom-frame",
        meta: expect.objectContaining({ team: "Real Madrid", frameSize: "medium" }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: "contact-2",
        intent: "custom-frame",
        meta: expect.objectContaining({ team: "Real Madrid" }),
      }),
    );
  });

  it("returns CONTACT_SUBMISSION_FAILED on DB error (does not throw)", async () => {
    const single = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "db error" } });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn(() => ({ insert }));
    createClientMock.mockResolvedValue({ from });

    const result = await createContactSubmission(validInput);

    expect(result).toEqual({ error: "CONTACT_SUBMISSION_FAILED" });
  });
});

// ---------------------------------------------------------------------------
// createNotifySubscription
// ---------------------------------------------------------------------------
describe("createNotifySubscription", () => {
  const validInput = { email: "anas@example.com", productSlug: "r34" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a NotifySubscription on success", async () => {
    const row = {
      id: "notify-1",
      email: "anas@example.com",
      product_slug: "r34",
      created_at: "2026-01-01T00:00:00Z",
    };

    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn(() => ({ upsert }));
    createClientMock.mockResolvedValue({ from });

    const result = await createNotifySubscription(validInput);

    expect(result).toEqual({
      id: "notify-1",
      email: "anas@example.com",
      productSlug: "r34",
      createdAt: "2026-01-01T00:00:00Z",
    });
  });

  it("returns NOTIFY_SUBSCRIPTION_FAILED on DB error (does not throw)", async () => {
    const single = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "db error" } });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn(() => ({ upsert }));
    createClientMock.mockResolvedValue({ from });

    const result = await createNotifySubscription(validInput);

    expect(result).toEqual({ error: "NOTIFY_SUBSCRIPTION_FAILED" });
  });
});
