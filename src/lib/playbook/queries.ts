import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { playbookClaims, playbookSources } from "@/db/schema";
import { buildPlaybookContext } from "./context";

// Server-only data access. The brandId must come from requireUser(); every query filters by it.

export type PlaybookSource = typeof playbookSources.$inferSelect;
export type PlaybookClaim = typeof playbookClaims.$inferSelect;

export type NewSource = Pick<PlaybookSource, "id" | "filename" | "mimeType" | "sizeBytes" | "storagePath">;
export type SourcePatch = Partial<Pick<PlaybookSource, "status" | "extractedText" | "errorMessage">>;

export function listClaims(brandId: string) {
  return db.select().from(playbookClaims).where(eq(playbookClaims.brandId, brandId)).orderBy(asc(playbookClaims.createdAt));
}

export function listSources(brandId: string) {
  return db.select().from(playbookSources).where(eq(playbookSources.brandId, brandId)).orderBy(desc(playbookSources.createdAt));
}

export async function createSource(brandId: string, input: NewSource) {
  const [row] = await db
    .insert(playbookSources)
    .values({ ...input, brandId })
    .returning();
  return row;
}

/** Returns the updated row, or null when the source does not exist for this brand. */
export async function updateSource(brandId: string, id: string, patch: SourcePatch) {
  const [row] = await db
    .update(playbookSources)
    .set(patch)
    .where(and(eq(playbookSources.id, id), eq(playbookSources.brandId, brandId)))
    .returning();
  return row ?? null;
}

/** The text agents receive: this brand's claims plus the extracted text of its ready sources. */
export async function getPlaybookContext(brandId: string, opts?: { maxChars?: number }) {
  const [claims, sources] = await Promise.all([listClaims(brandId), listSources(brandId)]);
  return buildPlaybookContext(claims, sources, opts);
}
