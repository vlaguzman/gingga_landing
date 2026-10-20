import { isValidElement, type ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const requireUser = vi.fn();
vi.mock("@/lib/auth", () => ({ requireUser: () => requireUser() }));
vi.mock("@/components/app/AppShell", () => ({ AppShell: () => null }));
vi.mock("./app.css", () => ({}));

import { AppShell } from "@/components/app/AppShell";
import AppLayout, { metadata } from "./layout";

describe("AppLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("wraps children in the .app AppShell with only name and email", async () => {
    requireUser.mockResolvedValue({
      id: "u1",
      email: "a@b.co",
      name: "Ada",
      brandId: "secret-brand",
    });

    const el = (await AppLayout({ children: "kids" })) as ReactElement<{
      className: string;
      children: ReactElement<{ user: object; children: string }>;
    }>;

    expect(isValidElement(el)).toBe(true);
    expect(el.props.className).toBe("app");
    const shell = el.props.children;
    expect(shell.type).toBe(AppShell);
    expect(shell.props.user).toEqual({ name: "Ada", email: "a@b.co" });
    expect(shell.props.children).toBe("kids");
  });

  it("propagates the redirect thrown by requireUser", async () => {
    requireUser.mockRejectedValue(new Error("NEXT_REDIRECT:/login"));

    await expect(AppLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT:/login");
  });

  it("keeps the workspace out of search results", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
