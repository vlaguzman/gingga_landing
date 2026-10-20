import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const signOut = vi.fn();
const limit = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { getUser, signOut } })),
}));

vi.mock("@/db", () => ({
  db: {
    select: () => ({ from: () => ({ where: () => ({ limit }) }) }),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

import { requireUser } from "./auth";

describe("requireUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signOut.mockResolvedValue({ error: null });
  });

  it("redirects to /login when there is no Supabase user", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    await expect(requireUser()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(limit).not.toHaveBeenCalled();
  });

  it("signs out and redirects when the user has no app profile", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1", email: "a@b.co" } } });
    limit.mockResolvedValue([]);

    await expect(requireUser()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it("returns id, email, name and brandId for a valid user", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1", email: "a@b.co" } } });
    limit.mockResolvedValue([{ id: "u1", name: "Ada", brandId: "brand-1" }]);

    await expect(requireUser()).resolves.toEqual({
      id: "u1",
      email: "a@b.co",
      name: "Ada",
      brandId: "brand-1",
    });
    expect(signOut).not.toHaveBeenCalled();
  });

  it("falls back to an empty email when Supabase has none", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u2" } } });
    limit.mockResolvedValue([{ id: "u2", name: "Bo", brandId: "b2" }]);

    const user = await requireUser();
    expect(user.email).toBe("");
  });
});
