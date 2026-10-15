import type { Metadata } from "next";
import { OutreachView } from "@/components/app/views/OutreachView";

export const metadata: Metadata = { title: "Outreach" };

export default function Page() {
  return <OutreachView />;
}
