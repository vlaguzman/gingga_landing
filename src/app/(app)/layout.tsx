import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { requireUser } from "@/lib/auth";
import "./app.css";

// The workspace is a front-end simulation of the product; keep it out of search results.
export const metadata: Metadata = {
  title: { template: "%s · GINGGA", default: "Workspace · GINGGA" },
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { name, email } = await requireUser();

  return (
    <div className="app">
      <AppShell user={{ name, email }}>{children}</AppShell>
    </div>
  );
}
