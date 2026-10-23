import { sql } from "drizzle-orm";
import {
  check,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  date,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const socialMedia = pgEnum("social_media", [
  "facebook",
  "instagram",
  "other",
]);

export const campaignStatus = pgEnum("campaign_status", [
  "active",
  "paused",
  "ended",
]);

export const messageDirection = pgEnum("message_direction", [
  "inbound",
  "outbound",
]);

export const playbookGroup = pgEnum("playbook_group", [
  "who_we_target",
  "what_works",
  "objections",
  "process",
]);

export const playbookProvenance = pgEnum("playbook_provenance", [
  "learned",
  "you",
  "uploaded",
]);

export const playbookSourceStatus = pgEnum("playbook_source_status", [
  "processing",
  "ready",
  "failed",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const brands = pgTable(
  "brands",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    subdomain: text("subdomain").notNull(),
    logoUrl: text("logo_url"),
    ...timestamps,
  },
  (t) => [
    // Subdomains are always stored lowercase so uniqueness is case-insensitive.
    uniqueIndex("brands_subdomain_key").on(t.subdomain),
    check("brands_subdomain_lowercase", sql`${t.subdomain} = lower(${t.subdomain})`),
  ],
).enableRLS();

// App profile. Credentials live in Supabase's auth.users; id is shared with it.
export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    ...timestamps,
  },
  (t) => [index("users_brand_id_idx").on(t.brandId)],
).enableRLS();

// CPL is derived (total_cost / count(leads)), so it is not stored.
export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    socialMedia: socialMedia("social_media").notNull(),
    totalCost: numeric("total_cost", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    status: campaignStatus("status").notNull().default("active"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    ...timestamps,
  },
  (t) => [index("campaigns_brand_id_idx").on(t.brandId)],
).enableRLS();

// last contact date is derived: max(messages.created_at) per lead.
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Denormalized from the campaign so tenant filters need no join.
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    // Nullable: organic / direct leads have no campaign.
    campaignId: uuid("campaign_id").references(() => campaigns.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    phoneNumber: text("phone_number").notNull(),
    email: text("email"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("leads_brand_phone_key").on(t.brandId, t.phoneNumber),
    index("leads_campaign_id_idx").on(t.campaignId),
  ],
).enableRLS();

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    direction: messageDirection("direction").notNull(),
    // Set only for outbound messages sent by a team member.
    senderUserId: uuid("sender_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    text: text("text").notNull(),
    ...timestamps,
  },
  (t) => [index("messages_lead_id_created_at_idx").on(t.leadId, t.createdAt)],
).enableRLS();

// Documents a user uploads to teach the agents. The file lives in the private
// Supabase Storage bucket "playbook-sources" at {brandId}/{id}/{filename}.
export const playbookSources = pgTable(
  "playbook_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    storagePath: text("storage_path").notNull(),
    extractedText: text("extracted_text"),
    status: playbookSourceStatus("status").notNull().default("processing"),
    errorMessage: text("error_message"),
    ...timestamps,
  },
  (t) => [index("playbook_sources_brand_id_idx").on(t.brandId)],
).enableRLS();

export const playbookClaims = pgTable(
  "playbook_claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    group: playbookGroup("group").notNull(),
    claim: text("claim").notNull(),
    because: text("because"),
    provenance: playbookProvenance("provenance").notNull(),
    // Set when the claim was drawn from an uploaded document.
    sourceId: uuid("source_id").references(() => playbookSources.id, {
      onDelete: "set null",
    }),
    corrected: boolean("corrected").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    index("playbook_claims_brand_id_idx").on(t.brandId),
    index("playbook_claims_source_id_idx").on(t.sourceId),
  ],
).enableRLS();
