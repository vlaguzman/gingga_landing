import { beforeEach, describe, expect, it, vi } from "vitest";

const { limit, returning, set, update, revalidatePath } = vi.hoisted(() => {
  const limit = vi.fn();
  const returning = vi.fn();
  const where = vi.fn(() => ({ returning, limit }));
  const set = vi.fn(() => ({ where }));
  const update = vi.fn(() => ({ set }));
  return { limit, returning, set, update, revalidatePath: vi.fn() };
});

vi.mock("@/db", () => ({
  db: { select: () => ({ from: () => ({ where: () => ({ limit }) }) }), update },
}));
vi.mock("@/lib/auth", () => ({ requireUser: vi.fn(async () => ({ brandId: "brand-1" })) }));
vi.mock("next/cache", () => ({ revalidatePath }));

import { renameStage, updateLeadStage } from "./actions";

describe("updateLeadStage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("moves the lead and revalidates the pipeline", async () => {
    limit.mockResolvedValue([{ id: "stage-2" }]);
    returning.mockResolvedValue([{ id: "lead-1" }]);

    const result = await updateLeadStage("lead-1", "stage-2");

    expect(result).toEqual({ ok: true });
    expect(set).toHaveBeenCalledWith({ stageId: "stage-2" });
    expect(revalidatePath).toHaveBeenCalledWith("/pipeline");
  });

  it("rejects a stage from another brand without updating", async () => {
    limit.mockResolvedValue([]);

    const result = await updateLeadStage("lead-1", "foreign-stage");

    expect(result).toEqual({ ok: false, error: "Unknown stage." });
    expect(update).not.toHaveBeenCalled();
  });

  it("reports not found when the lead belongs to another brand", async () => {
    limit.mockResolvedValue([{ id: "stage-2" }]);
    returning.mockResolvedValue([]);

    const result = await updateLeadStage("lead-x", "stage-2");

    expect(result).toEqual({ ok: false, error: "Lead not found." });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("renameStage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trims the name, saves it and revalidates", async () => {
    returning.mockResolvedValue([{ id: "stage-1" }]);

    expect(await renameStage("stage-1", "  Hot lead  ")).toEqual({ ok: true });
    expect(set).toHaveBeenCalledWith({ name: "Hot lead" });
    expect(revalidatePath).toHaveBeenCalledWith("/pipeline");
  });

  it.each([
    ["   ", "The name can't be empty."],
    ["x".repeat(41), "Use 40 characters or fewer."],
  ])("rejects an invalid name without touching the database", async (name, error) => {
    expect(await renameStage("stage-1", name)).toEqual({ ok: false, error });
    expect(update).not.toHaveBeenCalled();
  });

  it("reports not found for a stage of another brand", async () => {
    returning.mockResolvedValue([]);

    expect(await renameStage("foreign", "Anything")).toEqual({ ok: false, error: "Stage not found." });
  });

  it("maps a unique violation to a friendly message", async () => {
    returning.mockRejectedValue(Object.assign(new Error("dup"), { code: "23505" }));

    expect(await renameStage("stage-1", "Won")).toEqual({ ok: false, error: "Another stage already has that name." });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rethrows unexpected errors", async () => {
    returning.mockRejectedValue(new Error("boom"));

    await expect(renameStage("stage-1", "Ok")).rejects.toThrow("boom");
  });
});
