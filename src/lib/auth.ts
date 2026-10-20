import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the signed-in user's profile (including brandId) or sends them to /login.
 * getUser() validates the token with Supabase; never trust getSession() on the server.
 * Every query for tenant data must filter by the returned brandId.
 */
export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  // Authenticated in Supabase but without an app profile: no brand, no access.
  if (!profile) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  return { id: user.id, email: user.email ?? "", name: profile.name, brandId: profile.brandId };
});
