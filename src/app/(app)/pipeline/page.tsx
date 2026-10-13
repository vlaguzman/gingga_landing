import type { Metadata } from "next";
import { PipelineView } from "@/components/app/views/PipelineView";

export const metadata: Metadata = { title: "Pipeline" };

export default function Page() {
  return <PipelineView />;
}
