import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const signOut = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { signInWithPassword, signOut } })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

import { login, logout } from "./actions";

const form = (fields: Record<string, string>) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
  return fd;
};

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an invalid email without calling Supabase", async () => {
    const state = await login({}, form({ email: "nope", password: "longenough" }));

    expect(state.fieldErrors).toEqual({ email: "Enter a valid email address." });
    expect(state.email).toBe("nope");
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("rejects a short password", async () => {
    const state = await login({}, form({ email: "a@b.co", password: "short" }));

    expect(state.fieldErrors).toEqual({ password: "Password must be at least 8 characters." });
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("reports both field errors and treats missing fields as empty", async () => {
    const state = await login({}, new FormData());

    expect(state.fieldErrors?.email).toBeDefined();
    expect(state.fieldErrors?.password).toBeDefined();
    expect(state.email).toBe("");
  });

  it("trims the email before signing in", async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    await expect(
      login({}, form({ email: "  a@b.co  ", password: "password1" })),
    ).rejects.toThrow();

    expect(signInWithPassword).toHaveBeenCalledWith({ email: "a@b.co", password: "password1" });
  });

  it("redirects to /today-dashboard on success", async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    await expect(
      login({}, form({ email: "a@b.co", password: "password1" })),
    ).rejects.toThrow("NEXT_REDIRECT:/today-dashboard");
  });

  it("returns one generic error and keeps the email when sign-in fails", async () => {
    signInWithPassword.mockResolvedValue({ error: { message: "Invalid login credentials" } });

    const state = await login({}, form({ email: "a@b.co", password: "password1" }));

    expect(state).toEqual({ error: "Invalid email or password.", email: "a@b.co" });
  });
});

describe("logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs out and redirects to /login", async () => {
    signOut.mockResolvedValue({ error: null });

    await expect(logout()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
