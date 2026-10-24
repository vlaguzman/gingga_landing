import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { pipelineStages } from "@/db/schema";

type DefaultStage = { name: string; hint: string; kind: "open" | "won" | "lost" | "nurturing" };

// Keep in sync with the backfill in drizzle/0001_*.sql.
export const DEFAULT_STAGES: DefaultStage[] = [
  { name: "New Lead", kind: "open", hint: "Lead captured through a form, campaign, referral or WhatsApp. No contact attempt yet." },
  { name: "Contacting", kind: "open", hint: "Sales team or AI assistant is attempting contact. Follow-ups are in progress." },
  { name: "Qualified", kind: "open", hint: "Budget, preferred location and purchase intention have been validated." },
  { name: "Visit Scheduled", kind: "open", hint: "A showroom visit, property viewing or video consultation has been booked." },
  { name: "Proposal Sent", kind: "open", hint: "Property details, pricing and payment options have been presented." },
  { name: "Negotiation", kind: "open", hint: "Buyer is evaluating financing, discussing conditions or resolving objections." },
  { name: "Reserved", kind: "open", hint: "Buyer has paid the reservation deposit and documentation is being processed." },
  { name: "Won", kind: "won", hint: "Purchase deed signed and the sale is closed." },
  { name: "Lost", kind: "lost", hint: "Buyer went elsewhere or was disqualified. The lost reason is recorded." },
  { name: "Nurturing", kind: "nurturing", hint: "Not ready now. Kept warm with periodic follow-ups and a next-touch date." },
];

/** Populates the default stages for a brand. No-op if the brand already has stages. Returns true if it seeded. */
export async function seedDefaultStages(brandId: string): Promise<boolean> {
  const [{ n }] = await db.select({ n: count() }).from(pipelineStages).where(eq(pipelineStages.brandId, brandId));
  if (n > 0) return false;

  await db.insert(pipelineStages).values(DEFAULT_STAGES.map((s, position) => ({ ...s, brandId, position })));
  return true;
}
