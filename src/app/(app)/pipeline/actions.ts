"use server";

import { and, eq } from "drizzle-orm";
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
