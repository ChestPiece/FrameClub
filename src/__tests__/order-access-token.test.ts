import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createOrderAccessToken, verifyOrderAccessToken } from "@/lib/payment/order-access-token";

const TEST_SECRET = "test-order-secret-abc123";

describe("createOrderAccessToken", () => {
  beforeEach(() => {
    process.env.ORDER_ACCESS_TOKEN_SECRET = TEST_SECRET;
    // Ensure we are not in production so the fallback logic is not enforced
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    delete process.env.ORDER_ACCESS_TOKEN_SECRET;
    vi.restoreAllMocks();
  });

  it("returns a string in the format {timestamp}.{hex}", () => {
    const token = createOrderAccessToken("order-1");

    expect(typeof token).toBe("string");

    const parts = token.split(".");
    expect(parts).toHaveLength(2);

    const [timestamp, hex] = parts;
    expect(Number.isFinite(Number(timestamp))).toBe(true);
    expect(Number(timestamp)).toBeGreaterThan(Date.now() - 5000);
    expect(hex).toMatch(/^[0-9a-f]{64}$/); // HMAC-SHA256 → 64 hex chars
  });

  it("embeds a future expiry timestamp by default (30 minutes ahead)", () => {
    const before = Date.now();
    const token = createOrderAccessToken("order-1");
    const after = Date.now();

    const expiresAt = Number(token.split(".")[0]);

    // Default TTL is 30 minutes (1 800 000 ms)
    expect(expiresAt).toBeGreaterThanOrEqual(before + 1_800_000 - 100);
    expect(expiresAt).toBeLessThanOrEqual(after + 1_800_000 + 100);
  });

  it("respects a custom ttlMs", () => {
    const before = Date.now();
    const token = createOrderAccessToken("order-1", 60_000);
    const after = Date.now();

    const expiresAt = Number(token.split(".")[0]);

    expect(expiresAt).toBeGreaterThanOrEqual(before + 60_000 - 100);
    expect(expiresAt).toBeLessThanOrEqual(after + 60_000 + 100);
  });
});

describe("verifyOrderAccessToken", () => {
  beforeEach(() => {
    process.env.ORDER_ACCESS_TOKEN_SECRET = TEST_SECRET;
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    delete process.env.ORDER_ACCESS_TOKEN_SECRET;
    vi.restoreAllMocks();
  });

  it("returns true for a valid token", () => {
    const token = createOrderAccessToken("order-42");
    expect(verifyOrderAccessToken("order-42", token)).toBe(true);
  });

  it("returns false for an expired token", () => {
    // Create a token that expired 1 ms ago by using a negative TTL offset.
    // Because the token is signed at creation time, we manufacture an already-
    // expired timestamp by mocking Date.now during creation.
    const past = Date.now() - 10_000; // 10 s in the past
    vi.spyOn(Date, "now").mockReturnValueOnce(past - 1_800_000); // expiresAt = past
    const token = createOrderAccessToken("order-42");

    // Restore real time so verifyOrderAccessToken sees "now" > expiresAt
    vi.restoreAllMocks();

    expect(verifyOrderAccessToken("order-42", token)).toBe(false);
  });

  it("returns false when the signature has been tampered with", () => {
    const token = createOrderAccessToken("order-42");
    const [timestamp] = token.split(".");
    const tampered = `${timestamp}.${"0".repeat(64)}`;

    expect(verifyOrderAccessToken("order-42", tampered)).toBe(false);
  });

  it("returns false for null token", () => {
    expect(verifyOrderAccessToken("order-42", null)).toBe(false);
  });

  it("returns false for undefined token", () => {
    expect(verifyOrderAccessToken("order-42", undefined)).toBe(false);
  });

  it("returns false for a malformed token with no dot separator", () => {
    expect(verifyOrderAccessToken("order-42", "nodothere")).toBe(false);
  });

  it("returns false when the orderId doesn't match the token's orderId", () => {
    const token = createOrderAccessToken("order-A");
    expect(verifyOrderAccessToken("order-B", token)).toBe(false);
  });

  it("a token minted for one orderId does not verify for a different orderId", () => {
    const tokenA = createOrderAccessToken("order-100");
    const tokenB = createOrderAccessToken("order-200");

    expect(verifyOrderAccessToken("order-100", tokenA)).toBe(true);
    expect(verifyOrderAccessToken("order-200", tokenB)).toBe(true);

    // Cross-verification must fail
    expect(verifyOrderAccessToken("order-200", tokenA)).toBe(false);
    expect(verifyOrderAccessToken("order-100", tokenB)).toBe(false);
  });

  it("returns false when orderId is empty and token was minted for a real orderId", () => {
    const token = createOrderAccessToken("order-42");
    expect(verifyOrderAccessToken("", token)).toBe(false);
  });

  it("falls back to PAYFAST_PASSPHRASE when ORDER_ACCESS_TOKEN_SECRET is absent (non-prod)", () => {
    delete process.env.ORDER_ACCESS_TOKEN_SECRET;
    process.env.PAYFAST_PASSPHRASE = "fallback-passphrase";

    let token: string;
    try {
      token = createOrderAccessToken("order-fallback");
    } finally {
      delete process.env.PAYFAST_PASSPHRASE;
    }

    // Re-set the fallback passphrase for verification
    process.env.PAYFAST_PASSPHRASE = "fallback-passphrase";
    try {
      expect(verifyOrderAccessToken("order-fallback", token!)).toBe(true);
    } finally {
      delete process.env.PAYFAST_PASSPHRASE;
    }
  });
});
