import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const updateSession = vi.fn();
vi.mock("@/lib/supabase/proxy", () => ({
  updateSession: (...args: unknown[]) => updateSession(...args),
}));

import { config, proxy } from "./proxy";

describe("proxy", () => {
  it("delegates to updateSession and returns its response", async () => {
    const response = { status: 200 };
    updateSession.mockResolvedValue(response);
    const request = { url: "http://localhost/chats" } as NextRequest;

    await expect(proxy(request)).resolves.toBe(response);
    expect(updateSession).toHaveBeenCalledWith(request);
  });
});

describe("proxy matcher", () => {
  const pattern = new RegExp(`^${config.matcher[0]}$`);

  it.each(["/", "/login", "/chats", "/api/health", "/today-dashboard/x"])(
    "runs on %s",
    (path) => {
      expect(pattern.test(path)).toBe(true);
    },
  );

  it.each([
    "/_next/static/chunk.js",
    "/_next/image",
    "/favicon.ico",
    "/assets/logo.png",
    "/hero.webp",
    "/clip.mp4",
  ])("skips %s", (path) => {
    expect(pattern.test(path)).toBe(false);
  });
});
