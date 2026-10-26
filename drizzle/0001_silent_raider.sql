CREATE TYPE "public"."stage_kind" AS ENUM('open', 'won', 'lost', 'nurturing');--> statement-breakpoint
CREATE TABLE "pipeline_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" text NOT NULL,
	"hint" text,
	"kind" "stage_kind" DEFAULT 'open' NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pipeline_stages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "stage_id" uuid;--> statement-breakpoint
ALTER TABLE "pipeline_stages" ADD CONSTRAINT "pipeline_stages_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "pipeline_stages_brand_name_key" ON "pipeline_stages" USING btree ("brand_id","name");--> statement-breakpoint
CREATE INDEX "pipeline_stages_brand_position_idx" ON "pipeline_stages" USING btree ("brand_id","position");--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_stage_id_pipeline_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."pipeline_stages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leads_brand_stage_idx" ON "leads" USING btree ("brand_id","stage_id");
--> statement-breakpoint
-- Backfill: default stages for every existing brand (keep in sync with src/db/default-stages.ts).
INSERT INTO "pipeline_stages" ("brand_id", "name", "kind", "hint", "position")
SELECT b."id", d."name", d."kind", d."hint", d."position"
FROM "brands" b
CROSS JOIN (VALUES
  ('New Lead', 'open'::stage_kind, 'Lead captured through a form, campaign, referral or WhatsApp. No contact attempt yet.', 0),
  ('Contacting', 'open'::stage_kind, 'Sales team or AI assistant is attempting contact. Follow-ups are in progress.', 1),
  ('Qualified', 'open'::stage_kind, 'Budget, preferred location and purchase intention have been validated.', 2),
  ('Visit Scheduled', 'open'::stage_kind, 'A showroom visit, property viewing or video consultation has been booked.', 3),
  ('Proposal Sent', 'open'::stage_kind, 'Property details, pricing and payment options have been presented.', 4),
  ('Negotiation', 'open'::stage_kind, 'Buyer is evaluating financing, discussing conditions or resolving objections.', 5),
  ('Reserved', 'open'::stage_kind, 'Buyer has paid the reservation deposit and documentation is being processed.', 6),
  ('Won', 'won'::stage_kind, 'Purchase deed signed and the sale is closed.', 7),
  ('Lost', 'lost'::stage_kind, 'Buyer went elsewhere or was disqualified. The lost reason is recorded.', 8),
  ('Nurturing', 'nurturing'::stage_kind, 'Not ready now. Kept warm with periodic follow-ups and a next-touch date.', 9)
) AS d("name", "kind", "hint", "position");--> statement-breakpoint
-- Existing leads start in the first stage of their brand.
UPDATE "leads" l SET "stage_id" = ps."id"
FROM "pipeline_stages" ps
WHERE ps."brand_id" = l."brand_id" AND ps."position" = 0;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "stage_id" SET NOT NULL;
