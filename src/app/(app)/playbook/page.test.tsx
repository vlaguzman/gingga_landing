import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const requireUser = vi.fn();
const listSources = vi.fn();

vi.mock("@/lib/auth", () => ({ requireUser: () => requireUser() }));
vi.mock("@/lib/playbook/queries", () => ({ listSources: (...a: unknown[]) => listSources(...a) }));
vi.mock("@/components/app/views/PlaybookView", () => ({
  PlaybookView: ({ sources }: { sources: { id: string; filename: string }[] }) => (
    <ul>
      {sources.map((s) => (
        <li key={s.id}>{s.filename}</li>
      ))}
    </ul>
  ),
}));

import Page, { metadata } from "./page";

beforeEach(() => {
  vi.clearAllMocks();
  requireUser.mockResolvedValue({ id: "u1", brandId: "brand-1" });
});

describe("playbook page", () => {
  it("sets the title", () => {
    expect(metadata).toEqual({ title: "Playbook" });
  });

  it("loads only the signed-in brand's sources and passes UI fields to the view", async () => {
    listSources.mockResolvedValue([
      {
        id: "s1",
        brandId: "brand-1",
        filename: "faq.md",
        mimeType: "text/markdown",
        sizeBytes: 10,
        storagePath: "brand-1/s1/faq.md",
        extractedText: "SECRET BODY",
        status: "ready",
        errorMessage: null,
      },
    ]);
    render(await Page());

    expect(listSources).toHaveBeenCalledWith("brand-1");
    expect(screen.getByText("faq.md")).toBeInTheDocument();
  });

  it("does not ship extracted text or storage paths to the client", async () => {
    listSources.mockResolvedValue([
      { id: "s1", filename: "a.txt", sizeBytes: 1, status: "ready", errorMessage: null, extractedText: "SECRET", storagePath: "p" },
    ]);
    const element = await Page();
    expect(element.props.sources).toEqual([
      { id: "s1", filename: "a.txt", sizeBytes: 1, status: "ready", errorMessage: null },
    ]);
  });

  it("propagates the redirect when the user is not signed in", async () => {
    requireUser.mockRejectedValue(new Error("NEXT_REDIRECT:/login"));
    await expect(Page()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(listSources).not.toHaveBeenCalled();
  });
});
