import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const { createClientMock, getUserMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  getUserMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

import { assertAdminSession } from "@/lib/auth/assert-admin-session";

describe("assertAdminSession", () => {
  const REAL_ADMIN_EMAIL = "admin@frameclub.pk";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_EMAIL = REAL_ADMIN_EMAIL;

    createClientMock.mockResolvedValue({
      auth: {
        getUser: getUserMock,
      },
    });
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
  });

  it("returns ADMIN_NOT_CONFIGURED when ADMIN_EMAIL env var is not set", async () => {
    delete process.env.ADMIN_EMAIL;

    // User is authenticated — but env check happens after getUser in source,
    // so we still need a user to get past the UNAUTHORIZED guard.
    getUserMock.mockResolvedValue({
      data: { user: { email: REAL_ADMIN_EMAIL } },
    });

    const result = await assertAdminSession();

    expect(result).toEqual({ ok: false, error: "ADMIN_NOT_CONFIGURED" });
  });

  it("returns UNAUTHORIZED when no authenticated user", async () => {
    getUserMock.mockResolvedValue({
      data: { user: null },
    });

    const result = await assertAdminSession();

    expect(result).toEqual({ ok: false, error: "UNAUTHORIZED" });
  });

  it("returns FORBIDDEN when user email does not match ADMIN_EMAIL", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { email: "impostor@evil.com" } },
    });

    const result = await assertAdminSession();

    expect(result).toEqual({ ok: false, error: "FORBIDDEN" });
  });

  it("returns { ok: true } when user email matches ADMIN_EMAIL", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { email: REAL_ADMIN_EMAIL } },
    });

    const result = await assertAdminSession();

    expect(result).toEqual({ ok: true });
  });

  it("returns { ok: true } for case-insensitive email match", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { email: REAL_ADMIN_EMAIL.toUpperCase() } },
    });

    const result = await assertAdminSession();

    expect(result).toEqual({ ok: true });
  });
});
