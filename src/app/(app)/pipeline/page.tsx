import type { Metadata } from "next";
import { asc, eq, max } from "drizzle-orm";
import { PipelineView } from "@/components/app/views/PipelineView";
import { db } from "@/db";
import { seedDefaultStages } from "@/db/default-stages";
import { campaigns, leads, messages, pipelineStages } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Pipeline" };

export default async function Page() {
  const { brandId } = await requireUser();
  await seedDefaultStages(brandId);

  const [stageRows, leadRows] = await Promise.all([
    db
      .select({
        id: pipelineStages.id,
        name: pipelineStages.name,
        hint: pipelineStages.hint,
        kind: pipelineStages.kind,
        position: pipelineStages.position,
      })
      .from(pipelineStages)
      .where(eq(pipelineStages.brandId, brandId))
      .orderBy(asc(pipelineStages.position)),
    db
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phoneNumber,
        email: leads.email,
        stageId: leads.stageId,
        campaign: campaigns.name,
        lastContact: max(messages.createdAt),
      })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
      .leftJoin(messages, eq(messages.leadId, leads.id))
      .where(eq(leads.brandId, brandId))
      .groupBy(leads.id, campaigns.name)
      .orderBy(asc(leads.createdAt)),
  ]);

  return (
    <PipelineView
      stages={stageRows.map((r) => ({ ...r, hint: r.hint ?? "" }))}
      leads={leadRows.map((l) => ({ ...l, lastContact: l.lastContact?.toISOString() ?? null }))}
    />
  );
}
