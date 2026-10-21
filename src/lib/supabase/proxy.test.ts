import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
let cookieAdapter: {
  getAll: () => unknown;
  setAll: (c: { name: string; value: string; options?: object }[]) => void;
};

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, opts: { cookies: typeof cookieAdapter }) => {
    cookieAdapter = opts.cookies;
    return { auth: { getUser } };
  },
}));

import { updateSession } from "./proxy";

const req = (path: string, headers?: Record<string, string>) =>
  new NextRequest(`http://localhost:3000${path}`, { headers });

const signedIn = () => getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
const signedOut = () => getUser.mockResolvedValue({ data: { user: null } });

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pub-key";
  });

  describe("signed-out visitors", () => {
    beforeEach(signedOut);

    it.each([
      "/today-dashboard",
      "/chats",
      "/leads",
      "/outreach",
      "/pipeline",
      "/playbook",
      "/integrations",
      "/chats/123",
    ])("redirects %s to /login and drops the query string", async (path) => {
      const res = await updateSession(req(`${path}?next=1`));

      expect(res.status).toBe(307);
      const location = new URL(res.headers.get("location")!);
      expect(location.pathname).toBe("/login");
      expect(location.search).toBe("");
    });

    it.each(["/", "/login", "/chatsfoo", "/about"])("lets %s through", async (path) => {
      const res = await updateSession(req(path));

      expect(res.headers.get("location")).toBeNull();
      expect(res.headers.get("x-middleware-next")).toBe("1");
    });
  });

  describe("signed-in users", () => {
    beforeEach(signedIn);

    it("redirects /login to /today-dashboard and drops the query string", async () => {
      const res = await updateSession(req("/login?error=x"));

      const location = new URL(res.headers.get("location")!);
      expect(location.pathname).toBe("/today-dashboard");
      expect(location.search).toBe("");
    });

    it("lets protected routes through", async () => {
      const res = await updateSession(req("/chats"));

      expect(res.headers.get("location")).toBeNull();
      expect(res.headers.get("x-middleware-next")).toBe("1");
    });
  });

  describe("cookie handling", () => {
    beforeEach(signedIn);

    it("reads cookies from the incoming request", async () => {
      await updateSession(req("/chats", { cookie: "sb-token=abc" }));

      expect(cookieAdapter.getAll()).toEqual([{ name: "sb-token", value: "abc" }]);
    });

    it("propagates refreshed cookies to the request and the response", async () => {
      getUser.mockImplementation(async () => {
        cookieAdapter.setAll([
          { name: "sb-token", value: "fresh", options: { path: "/", httpOnly: true } },
        ]);
        return { data: { user: { id: "u1" } } };
      });
      const request = req("/chats", { cookie: "sb-token=stale" });

      const res = await updateSession(request);

      expect(request.cookies.get("sb-token")?.value).toBe("fresh");
      const set = res.cookies.get("sb-token");
      expect(set?.value).toBe("fresh");
      expect(set?.httpOnly).toBe(true);
    });
  });
});
