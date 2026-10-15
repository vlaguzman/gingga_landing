import type { Metadata } from "next";
import { PlaybookView } from "@/components/app/views/PlaybookView";

export const metadata: Metadata = { title: "Playbook" };

export default function Page() {
  return <PlaybookView />;
}
