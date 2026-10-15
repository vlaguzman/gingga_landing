import type { Metadata } from "next";
import { IntegrationsView } from "@/components/app/views/IntegrationsView";

export const metadata: Metadata = { title: "Integrations" };

export default function Page() {
  return <IntegrationsView />;
}
