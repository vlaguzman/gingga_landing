"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { leads, pipelineStages } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export type UpdateLeadStageResult = { ok: true } | { ok: false; error: string };

export async function updateLeadStage(leadId: string, stageId: string): Promise<UpdateLeadStageResult> {
  const { brandId } = await requireUser();

  // The target stage must belong to the user's brand, or a lead could be moved into another tenant's pipeline.
  const [stage] = await db
    .select({ id: pipelineStages.id })
    .from(pipelineStages)
    .where(and(eq(pipelineStages.id, stageId), eq(pipelineStages.brandId, brandId)))
    .limit(1);
  if (!stage) return { ok: false, error: "Unknown stage." };

  const updated = await db
    .update(leads)
    .set({ stageId })
    .where(and(eq(leads.id, leadId), eq(leads.brandId, brandId)))
    .returning({ id: leads.id });
  if (updated.length === 0) return { ok: false, error: "Lead not found." };

  revalidatePath("/pipeline");
  return { ok: true };
}

export type RenameStageResult = { ok: true } | { ok: false; error: string };

const MAX_STAGE_NAME = 40;

export async function renameStage(stageId: string, name: string): Promise<RenameStageResult> {
  const { brandId } = await requireUser();

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "The name can't be empty." };
  if (trimmed.length > MAX_STAGE_NAME) return { ok: false, error: `Use ${MAX_STAGE_NAME} characters or fewer.` };

  try {
    const updated = await db
      .update(pipelineStages)
      .set({ name: trimmed })
      .where(and(eq(pipelineStages.id, stageId), eq(pipelineStages.brandId, brandId)))
      .returning({ id: pipelineStages.id });
    if (updated.length === 0) return { ok: false, error: "Stage not found." };
  } catch (e) {
    // Postgres unique violation on (brand_id, name); drizzle may wrap it in `cause`.
    const code = (e as { code?: string; cause?: { code?: string } }).code ?? (e as { cause?: { code?: string } }).cause?.code;
    if (code === "23505") return { ok: false, error: "Another stage already has that name." };
    throw e;
  }

  revalidatePath("/pipeline");
  return { ok: true };
}

export type ReorderStagesResult = { ok: true } | { ok: false; error: string };

/**
 * Persists the order of the board columns. `orderedIds` must be exactly the brand's open stages; outcome
 * stages (won, lost, nurturing) are not columns and keep their relative order after them.
 */
export async function reorderStages(orderedIds: string[]): Promise<ReorderStagesResult> {
  const { brandId } = await requireUser();

  const all = await db
    .select({ id: pipelineStages.id, kind: pipelineStages.kind })
    .from(pipelineStages)
    .where(eq(pipelineStages.brandId, brandId))
    .orderBy(asc(pipelineStages.position));

  const open = all.filter((s) => s.kind === "open").map((s) => s.id);
  const sameSet =
    new Set(orderedIds).size === orderedIds.length &&
    orderedIds.length === open.length &&
    orderedIds.every((id) => open.includes(id));
  if (!sameSet) return { ok: false, error: "The stages changed, refresh and try again." };

  const finalOrder = [...orderedIds, ...all.filter((s) => s.kind !== "open").map((s) => s.id)];
  await db.transaction(async (tx) => {
    for (const [position, id] of finalOrder.entries()) {
      await tx
        .update(pipelineStages)
        .set({ position })
        .where(and(eq(pipelineStages.id, id), eq(pipelineStages.brandId, brandId)));
    }
  });

  revalidatePath("/pipeline");
  return { ok: true };
}
