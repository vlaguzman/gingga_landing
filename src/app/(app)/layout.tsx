import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import "./app.css";

// The workspace is a front-end simulation of the product; keep it out of search results.
export const metadata: Metadata = {
  title: { template: "%s · GINGGA", default: "Workspace · GINGGA" },
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <AppShell>{children}</AppShell>
    </div>
  );
}
