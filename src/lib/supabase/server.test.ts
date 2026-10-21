import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = {
  getAll: vi.fn(() => [{ name: "sb", value: "1" }]),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({ cookies: vi.fn(async () => cookieStore) }));

const createServerClient = vi.fn((..._args: unknown[]) => ({ marker: "client" }));
vi.mock("@supabase/ssr", () => ({
  createServerClient: (...args: unknown[]) => createServerClient(...args),
}));

import { createClient } from "./server";

type CookieAdapter = {
  getAll: () => unknown;
  setAll: (c: { name: string; value: string; options?: object }[]) => void;
};

async function adapter(): Promise<CookieAdapter> {
  await createClient();
  const opts = createServerClient.mock.calls[0][2] as { cookies: CookieAdapter };
  return opts.cookies;
}

describe("supabase server createClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pub-key";
  });

  it("builds the client from the public env vars and returns it", async () => {
    const client = await createClient();

    expect(client).toEqual({ marker: "client" });
    expect(createServerClient.mock.calls[0].slice(0, 2)).toEqual([
      "https://example.supabase.co",
      "pub-key",
    ]);
  });

  it("reads cookies from the request cookie store", async () => {
    const { getAll } = await adapter();

    expect(getAll()).toEqual([{ name: "sb", value: "1" }]);
  });

  it("writes every cookie with its options", async () => {
    const { setAll } = await adapter();

    setAll([
      { name: "a", value: "1", options: { path: "/" } },
      { name: "b", value: "2", options: { httpOnly: true } },
    ]);

    expect(cookieStore.set).toHaveBeenCalledWith("a", "1", { path: "/" });
    expect(cookieStore.set).toHaveBeenCalledWith("b", "2", { httpOnly: true });
  });

  it("ignores read-only cookie errors from Server Components", async () => {
    const { setAll } = await adapter();
    cookieStore.set.mockImplementationOnce(() => {
      throw new Error("Cookies can only be modified in a Server Action");
    });

    expect(() => setAll([{ name: "a", value: "1" }])).not.toThrow();
  });
});
