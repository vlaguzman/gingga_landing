import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { PipelineView } from "@/components/app/views/PipelineView";
import { db } from "@/db";
import { seedDefaultStages } from "@/db/default-stages";
import { pipelineStages } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Pipeline" };

export default async function Page() {
  const { brandId } = await requireUser();
  await seedDefaultStages(brandId);

  const rows = await db
    .select({
      id: pipelineStages.id,
      name: pipelineStages.name,
      hint: pipelineStages.hint,
      kind: pipelineStages.kind,
      position: pipelineStages.position,
    })
    .from(pipelineStages)
    .where(eq(pipelineStages.brandId, brandId))
    .orderBy(asc(pipelineStages.position));

  return <PipelineView stages={rows.map((r) => ({ ...r, hint: r.hint ?? "" }))} />;
}
