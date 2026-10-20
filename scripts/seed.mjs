// Dev seed: one brand and one user profile. Safe to run repeatedly.
// The Supabase Auth user (email + password) must already exist; its uid is the profile id.
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const BRAND = { name: "Gingga", subdomain: "gingga" };
const USER = { id: "d7034be8-d442-49e2-9eeb-ed2beff0d337", name: "Vladimir Guzman" };

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

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

  console.log(`Seeded brand "${BRAND.subdomain}" and profile for ${authUser.email}`);
} finally {
  await sql.end();
}
