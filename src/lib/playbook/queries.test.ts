import { beforeEach, describe, expect, it, vi } from "vitest";

const calls = vi.hoisted(() => ({
  where: [] as unknown[],
  values: [] as unknown[],
  set: [] as unknown[],
  rows: [] as unknown[][],
}));

// Each builder step returns the same chain; awaiting it (or .returning/.orderBy) yields the next queued rows.
const chain = vi.hoisted(() => {
  const next = () => Promise.resolve(calls.rows.shift() ?? []);
  const c: Record<string, unknown> = {};
  c.from = () => c;
  c.where = (w: unknown) => (calls.where.push(w), c);
  c.orderBy = next;
  c.values = (v: unknown) => (calls.values.push(v), c);
  c.set = (v: unknown) => (calls.set.push(v), c);
  c.returning = next;
  return c;
});

vi.mock("@/db", () => ({
  db: { select: () => chain, insert: () => chain, update: () => chain },
}));

vi.mock("drizzle-orm", async (orig) => ({
  ...(await orig<typeof import("drizzle-orm")>()),
  eq: (col: { name: string }, value: unknown) => ({ eq: [col.name, value] }),
  and: (...parts: unknown[]) => ({ and: parts }),
  asc: (col: { name: string }) => ({ asc: col.name }),
  desc: (col: { name: string }) => ({ desc: col.name }),
}));

import { createSource, getPlaybookContext, listClaims, listSources, updateSource } from "./queries";

beforeEach(() => {
  calls.where.length = calls.values.length = calls.set.length = calls.rows.length = 0;
});

describe("playbook queries", () => {
  it("lists claims for the brand only", async () => {
    calls.rows.push([{ id: "c1" }]);
    await expect(listClaims("brand-1")).resolves.toEqual([{ id: "c1" }]);
    expect(calls.where).toEqual([{ eq: ["brand_id", "brand-1"] }]);
  });

  it("lists sources for the brand only", async () => {
    calls.rows.push([{ id: "s1" }]);
    await expect(listSources("brand-2")).resolves.toEqual([{ id: "s1" }]);
    expect(calls.where).toEqual([{ eq: ["brand_id", "brand-2"] }]);
  });

  it("creates a source stamped with the brand, never one from the input", async () => {
    calls.rows.push([{ id: "s1" }]);
    const row = await createSource("brand-1", {
      id: "s1",
      filename: "a.txt",
      mimeType: "text/plain",
      sizeBytes: 3,
      storagePath: "brand-1/s1/a.txt",
    });
    expect(row).toEqual({ id: "s1" });
    expect(calls.values[0]).toMatchObject({ brandId: "brand-1", id: "s1", filename: "a.txt" });
  });

  it("updates a source scoped by id and brand", async () => {
    calls.rows.push([{ id: "s1", status: "ready" }]);
    const row = await updateSource("brand-1", "s1", { status: "ready", extractedText: "hi" });
    expect(row).toEqual({ id: "s1", status: "ready" });
    expect(calls.where).toEqual([{ and: [{ eq: ["id", "s1"] }, { eq: ["brand_id", "brand-1"] }] }]);
    expect(calls.set[0]).toEqual({ status: "ready", extractedText: "hi" });
  });

  it("returns null when updating a source of another brand", async () => {
    calls.rows.push([]);
    await expect(updateSource("brand-1", "foreign", { status: "failed" })).resolves.toBeNull();
  });

  it("builds the agent context from this brand's claims and sources", async () => {
    calls.rows.push(
      [{ group: "process", claim: "Call within 5 minutes", because: null }],
      [{ filename: "a.txt", extractedText: "price list", status: "ready" }],
    );
    const out = await getPlaybookContext("brand-1");
    expect(out).toContain("## Process\n- Call within 5 minutes");
    expect(out).toContain("### a.txt\nprice list");
    expect(calls.where).toEqual([{ eq: ["brand_id", "brand-1"] }, { eq: ["brand_id", "brand-1"] }]);
  });
});
