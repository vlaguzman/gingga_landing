import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const postgres = vi.fn((..._args: unknown[]) => ({ sql: true }));
const drizzle = vi.fn((..._args: unknown[]) => ({ drizzle: true }));

vi.mock("postgres", () => ({ default: (...a: unknown[]) => postgres(...a) }));
vi.mock("drizzle-orm/postgres-js", () => ({ drizzle: (...a: unknown[]) => drizzle(...a) }));

describe("db", () => {
  const original = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (original === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = original;
  });

  it("throws at import time when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;

    await expect(import("./index")).rejects.toThrow("DATABASE_URL is not set");
    expect(postgres).not.toHaveBeenCalled();
  });

  it("connects without prepared statements (transaction pooler) and exports the drizzle db", async () => {
    process.env.DATABASE_URL = "postgres://user:pw@localhost:6543/db";

    const { db } = await import("./index");

    expect(postgres).toHaveBeenCalledWith("postgres://user:pw@localhost:6543/db", {
      prepare: false,
    });
    expect(drizzle).toHaveBeenCalledWith({ sql: true }, expect.objectContaining({ schema: expect.anything() }));
    expect(db).toEqual({ drizzle: true });
  });
});
