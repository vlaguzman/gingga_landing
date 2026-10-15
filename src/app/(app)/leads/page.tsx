import type { Metadata } from "next";
import { LeadsView } from "@/components/app/views/LeadsView";

export const metadata: Metadata = { title: "Leads" };

export default function Page() {
  return <LeadsView />;
}
