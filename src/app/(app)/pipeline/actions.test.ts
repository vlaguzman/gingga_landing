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

import { updateLeadStage } from "./actions";

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
