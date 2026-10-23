import { describe, expect, it } from "vitest";
import { buildPlaybookContext, DEFAULT_CONTEXT_BUDGET } from "./context";

const claim = (group: string, text: string, because: string | null = null) => ({
  group: group as "who_we_target",
  claim: text,
  because,
});
const source = (filename: string, extractedText: string | null, status = "ready") => ({
  filename,
  extractedText,
  status: status as "ready",
});

describe("buildPlaybookContext", () => {
  it("returns an empty string when there is nothing to say", () => {
    expect(buildPlaybookContext([], [])).toBe("");
  });

  it("orders sections by the playbook order, not by input order", () => {
    const out = buildPlaybookContext(
      [claim("process", "P1"), claim("who_we_target", "W1"), claim("objections", "O1"), claim("what_works", "M1")],
      [],
    );
    const idx = ["Who we target", "What works", "Objections", "Process"].map((h) => out.indexOf(`## ${h}`));
    expect(idx.every((i) => i >= 0)).toBe(true);
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
  });

  it("keeps claim order inside a section and includes the reason", () => {
    const out = buildPlaybookContext([claim("what_works", "First", "Because A"), claim("what_works", "Second")], []);
    expect(out).toContain("- First (because: Because A)");
    expect(out.indexOf("- First")).toBeLessThan(out.indexOf("- Second"));
    expect(out.endsWith("- Second")).toBe(true);
  });

  it("skips empty sections", () => {
    const out = buildPlaybookContext([claim("process", "P1")], []);
    expect(out).not.toContain("Who we target");
  });

  it("includes only sources that are ready and have text", () => {
    const out = buildPlaybookContext(
      [],
      [
        source("a.txt", "alpha text"),
        source("b.pdf", "beta text", "processing"),
        source("c.pdf", "gamma text", "failed"),
        source("d.md", null),
        source("e.md", "   "),
      ],
    );
    expect(out).toContain("### a.txt");
    expect(out).toContain("alpha text");
    expect(out).not.toMatch(/beta|gamma|d\.md|e\.md/);
  });

  it("caps the output at the budget and marks truncation", () => {
    const out = buildPlaybookContext([claim("process", "P1")], [source("big.txt", "x".repeat(5000))], { maxChars: 300 });
    expect(out.length).toBeLessThanOrEqual(300);
    expect(out).toContain("[truncated]");
    expect(out).toContain("- P1");
  });

  it("drops sources entirely once the budget is spent by claims", () => {
    const out = buildPlaybookContext([claim("process", "y".repeat(400))], [source("a.txt", "alpha")], { maxChars: 200 });
    expect(out.length).toBeLessThanOrEqual(200);
    expect(out).not.toContain("alpha");
  });

  it("uses a default budget", () => {
    const out = buildPlaybookContext([], [source("big.txt", "x".repeat(DEFAULT_CONTEXT_BUDGET * 2))]);
    expect(out.length).toBeLessThanOrEqual(DEFAULT_CONTEXT_BUDGET);
  });
});
