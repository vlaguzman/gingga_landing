CREATE TYPE "public"."playbook_group" AS ENUM('who_we_target', 'what_works', 'objections', 'process');--> statement-breakpoint
CREATE TYPE "public"."playbook_provenance" AS ENUM('learned', 'you', 'uploaded');--> statement-breakpoint
CREATE TYPE "public"."playbook_source_status" AS ENUM('processing', 'ready', 'failed');--> statement-breakpoint
CREATE TABLE "playbook_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"group" "playbook_group" NOT NULL,
	"claim" text NOT NULL,
	"because" text,
	"provenance" "playbook_provenance" NOT NULL,
	"source_id" uuid,
	"corrected" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playbook_claims" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "playbook_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_path" text NOT NULL,
	"extracted_text" text,
	"status" "playbook_source_status" DEFAULT 'processing' NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playbook_sources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "playbook_claims" ADD CONSTRAINT "playbook_claims_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_claims" ADD CONSTRAINT "playbook_claims_source_id_playbook_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."playbook_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_sources" ADD CONSTRAINT "playbook_sources_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "playbook_claims_brand_id_idx" ON "playbook_claims" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "playbook_claims_source_id_idx" ON "playbook_claims" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "playbook_sources_brand_id_idx" ON "playbook_sources" USING btree ("brand_id");