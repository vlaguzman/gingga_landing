import type { Metadata } from "next";
import { PlaybookView } from "@/components/app/views/PlaybookView";
import { requireUser } from "@/lib/auth";
import { listSources } from "@/lib/playbook/queries";

export const metadata: Metadata = { title: "Playbook" };

export default async function Page() {
  const { brandId } = await requireUser();
  const rows = await listSources(brandId);

  // Map to the fields the UI needs: extracted text and storage paths stay on the server.
  const sources = rows.map(({ id, filename, sizeBytes, status, errorMessage }) => ({
    id,
    filename,
    sizeBytes,
    status,
    errorMessage,
  }));

  return <PlaybookView sources={sources} />;
}
