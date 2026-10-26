// Dev seed: one brand, one user profile, default pipeline stages and a few sample leads. Safe to run repeatedly.
// The Supabase Auth user (email + password) must already exist; its uid is the profile id.
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const BRAND = { name: "Gingga", subdomain: "gingga" };
const USER = { id: "d7034be8-d442-49e2-9eeb-ed2beff0d337", name: "Vladimir Guzman" };

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

// Keep in sync with src/db/default-stages.ts and the backfill in drizzle/0001_*.sql.
const STAGES = [
  ["New Lead", "open", "Lead captured through a form, campaign, referral or WhatsApp. No contact attempt yet."],
  ["Contacting", "open", "Sales team or AI assistant is attempting contact. Follow-ups are in progress."],
  ["Qualified", "open", "Budget, preferred location and purchase intention have been validated."],
  ["Visit Scheduled", "open", "A showroom visit, property viewing or video consultation has been booked."],
  ["Proposal Sent", "open", "Property details, pricing and payment options have been presented."],
  ["Negotiation", "open", "Buyer is evaluating financing, discussing conditions or resolving objections."],
  ["Reserved", "open", "Buyer has paid the reservation deposit and documentation is being processed."],
  ["Won", "won", "Purchase deed signed and the sale is closed."],
  ["Lost", "lost", "Buyer went elsewhere or was disqualified. The lost reason is recorded."],
  ["Nurturing", "nurturing", "Not ready now. Kept warm with periodic follow-ups and a next-touch date."],
];

// [name, phone, email, stage position, last inbound message (optional)]
const LEADS = [
  ["Juliana Arango", "+57 300 111 0001", "juliana@example.com", 0, "Hi, I saw the 2-bedroom flat on Instagram. Is it still available?"],
  ["Mauricio Salcedo", "+57 300 111 0002", "mauricio@example.com", 1, "Can you send me the floor plan?"],
  ["Natalia Giraldo", "+57 300 111 0003", null, 1, null],
  ["Camila Restrepo", "+57 300 111 0004", "camila@example.com", 2, "We have a budget of about 350M and want to be near the metro."],
  ["Santiago Osorio", "+57 300 111 0005", "santiago@example.com", 3, "Thursday at 10 works for the visit."],
  ["Laura Mejía", "+57 300 111 0006", null, 4, "Thanks for the proposal, I'm reviewing it with my partner."],
  ["Héctor Bermúdez", "+57 300 111 0007", "hector@example.com", 6, "Deposit sent. What's next?"],
  ["Alejandra Duarte", "+57 300 111 0008", "alejandra@example.com", 7, "Deed signed, thank you!"],
  ["Gustavo Pardo", "+57 300 111 0009", null, 8, "We went with another project."],
  ["Diana Ruiz", "+57 300 111 0010", "diana@example.com", 9, "Not ready until next year."],
];

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

try {
  const [authUser] = await sql`select email from auth.users where id = ${USER.id}`;
  if (!authUser) throw new Error(`No Supabase Auth user with id ${USER.id}`);

  const [brand] = await sql`
    insert into brands (name, subdomain)
    values (${BRAND.name}, ${BRAND.subdomain})
    on conflict (subdomain) do update set name = excluded.name
    returning id`;

  await sql`
    insert into users (id, brand_id, name)
    values (${USER.id}, ${brand.id}, ${USER.name})
    on conflict (id) do update set brand_id = excluded.brand_id, name = excluded.name`;

  // Default stages, only for a brand that has none (the user may have renamed or reordered them).
  for (const [position, [name, kind, hint]] of STAGES.entries()) {
    await sql`
      insert into pipeline_stages (brand_id, name, kind, hint, position)
      select ${brand.id}, ${name}, ${kind}::stage_kind, ${hint}, ${position}
      where not exists (select 1 from pipeline_stages where brand_id = ${brand.id})`;
  }
  const stages = await sql`select id from pipeline_stages where brand_id = ${brand.id} order by position`;

  for (const [name, phone, email, at, text] of LEADS) {
    const stage = stages[at];
    if (!stage) continue;
    const [lead] = await sql`
      insert into leads (brand_id, name, phone_number, email, stage_id)
      values (${brand.id}, ${name}, ${phone}, ${email}, ${stage.id})
      on conflict (brand_id, phone_number) do nothing
      returning id`;
    if (lead && text) {
      await sql`insert into messages (lead_id, direction, text) values (${lead.id}, 'inbound', ${text})`;
    }
  }

  console.log(`Seeded brand "${BRAND.subdomain}" and profile for ${authUser.email}`);
} finally {
  await sql.end();
}
