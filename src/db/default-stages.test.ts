import { beforeEach, describe, expect, it, vi } from "vitest";

const { where, values } = vi.hoisted(() => ({ where: vi.fn(), values: vi.fn() }));

vi.mock("@/db", () => ({
  db: { select: () => ({ from: () => ({ where }) }), insert: () => ({ values }) },
}));

import { DEFAULT_STAGES, seedDefaultStages } from "./default-stages";

describe("seedDefaultStages", () => {
  beforeEach(() => vi.clearAllMocks());

  it("inserts the defaults, in order, for a brand without stages", async () => {
    where.mockResolvedValue([{ n: 0 }]);

    expect(await seedDefaultStages("brand-1")).toBe(true);

    const rows = values.mock.calls[0][0];
    expect(rows).toHaveLength(DEFAULT_STAGES.length);
    expect(rows[0]).toMatchObject({ brandId: "brand-1", name: "New Lead", position: 0 });
    expect(rows.map((r: { position: number }) => r.position)).toEqual(rows.map((_: unknown, i: number) => i));
  });

  it("does nothing when the brand already has stages", async () => {
    where.mockResolvedValue([{ n: 3 }]);

    expect(await seedDefaultStages("brand-1")).toBe(false);
    expect(values).not.toHaveBeenCalled();
  });
});
