import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import crypto from "node:crypto";
import { generatePayFastSignature, payfastConfig, verifyPayFastSignature } from "@/lib/payment/payfast";

describe("generatePayFastSignature", () => {
  let originalPassphrase: string;

  beforeEach(() => {
    originalPassphrase = payfastConfig.passphrase;
    payfastConfig.passphrase = "";
  });

  afterEach(() => {
    payfastConfig.passphrase = originalPassphrase;
  });

  it("returns an MD5 hex string (32 chars) for known data", () => {
    const result = generatePayFastSignature({
      merchant_id: "10000100",
      amount: "5000.00",
      item_name: "Frame",
    });

    expect(typeof result).toBe("string");
    expect(result).toHaveLength(32);
    expect(result).toMatch(/^[0-9a-f]{32}$/);
  });

  it("produces a deterministic result matching a manually computed MD5", () => {
    // Build the expected query string by hand (keys sorted: amount, item_name, merchant_id)
    const expected = crypto
      .createHash("md5")
      .update("amount=5000.00&item_name=Frame&merchant_id=10000100")
      .digest("hex");

    const result = generatePayFastSignature({
      merchant_id: "10000100",
      amount: "5000.00",
      item_name: "Frame",
    });

    expect(result).toBe(expected);
  });

  it("excludes keys with empty string values from the signature", () => {
    const withEmpty = generatePayFastSignature({
      merchant_id: "10000100",
      amount: "5000.00",
      item_name: "",
    });

    const withoutEmpty = generatePayFastSignature({
      merchant_id: "10000100",
      amount: "5000.00",
    });

    expect(withEmpty).toBe(withoutEmpty);
  });

  it("excludes the `signature` key from the payload before signing", () => {
    const withSig = generatePayFastSignature({
      merchant_id: "10000100",
      amount: "5000.00",
      signature: "deadbeef",
    });

    const withoutSig = generatePayFastSignature({
      merchant_id: "10000100",
      amount: "5000.00",
    });

    expect(withSig).toBe(withoutSig);
  });

  it("sorts keys alphabetically before hashing", () => {
    // Passing keys in reverse alphabetical order must produce the same hash
    const result1 = generatePayFastSignature({
      merchant_id: "10000100",
      item_name: "Frame",
      amount: "5000.00",
    });

    const result2 = generatePayFastSignature({
      amount: "5000.00",
      item_name: "Frame",
      merchant_id: "10000100",
    });

    expect(result1).toBe(result2);
  });

  it("appends passphrase to the query string when payfastConfig.passphrase is set", () => {
    const passphrase = "test-passphrase";
    payfastConfig.passphrase = passphrase;

    const data = { merchant_id: "10000100", amount: "5000.00" };

    // Manually build the expected query (keys sorted: amount, merchant_id) + passphrase
    const baseQuery = "amount=5000.00&merchant_id=10000100";
    const fullQuery = `${baseQuery}&passphrase=${encodeURIComponent(passphrase)}`;
    const expected = crypto.createHash("md5").update(fullQuery).digest("hex");

    const result = generatePayFastSignature(data);

    expect(result).toBe(expected);
  });

  it("result differs when passphrase differs", () => {
    const data = { merchant_id: "10000100", amount: "5000.00" };

    payfastConfig.passphrase = "passphrase-A";
    const resultA = generatePayFastSignature(data);

    payfastConfig.passphrase = "passphrase-B";
    const resultB = generatePayFastSignature(data);

    expect(resultA).not.toBe(resultB);
  });
});

describe("verifyPayFastSignature", () => {
  let originalPassphrase: string;

  beforeEach(() => {
    originalPassphrase = payfastConfig.passphrase;
    payfastConfig.passphrase = "";
  });

  afterEach(() => {
    payfastConfig.passphrase = originalPassphrase;
  });

  it("returns false when the `signature` key is missing", () => {
    expect(
      verifyPayFastSignature({ merchant_id: "10000100", amount: "5000.00" })
    ).toBe(false);
  });

  it("returns false when the signature is wrong", () => {
    expect(
      verifyPayFastSignature({
        merchant_id: "10000100",
        amount: "5000.00",
        signature: "00000000000000000000000000000000",
      })
    ).toBe(false);
  });

  it("returns true when the signature matches the generated signature", () => {
    const data = { merchant_id: "10000100", amount: "5000.00", item_name: "Frame" };
    const sig = generatePayFastSignature(data);

    expect(verifyPayFastSignature({ ...data, signature: sig })).toBe(true);
  });

  it("returns false for non-hex garbage in the signature field", () => {
    const data = { merchant_id: "10000100", amount: "5000.00" };

    // Non-hex string — Buffer.from will silently decode but lengths will mismatch
    expect(
      verifyPayFastSignature({ ...data, signature: "not-a-hex-string!!!!" })
    ).toBe(false);
  });

  it("returns false when signature has correct length but wrong value", () => {
    const data = { merchant_id: "10000100", amount: "5000.00" };
    // All-zeros MD5 — valid hex, correct length, but wrong value
    expect(
      verifyPayFastSignature({ ...data, signature: "a".repeat(32) })
    ).toBe(false);
  });
});
