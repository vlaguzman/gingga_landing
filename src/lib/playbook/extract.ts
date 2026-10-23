import { extractText as extractPdfText, getDocumentProxy } from "unpdf";

export type SourceKind = "pdf" | "txt" | "md";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** MIME types are derived from the extension on the server; the client-sent type is never trusted. */
export const SOURCE_MIME: Record<SourceKind, string> = {
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
};

export function sourceKindOf(filename: string): SourceKind | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  return filename.includes(".") && ext && ext in SOURCE_MIME ? (ext as SourceKind) : null;
}

/** Upper bound on stored text per document, so one upload cannot bloat the table or the agent context. */
export const MAX_EXTRACTED_CHARS = 200_000;

/**
 * Pulls plain text out of an uploaded file. unpdf is pure JS (bundled pdf.js), so it has no native
 * binaries. Throws when a PDF cannot be parsed; callers turn that into a failed source.
 */
export async function extractText(kind: SourceKind, data: Uint8Array): Promise<string> {
  let text: string;
  if (kind === "pdf") {
    const pdf = await getDocumentProxy(data);
    ({ text } = await extractPdfText(pdf, { mergePages: true }));
  } else {
    text = new TextDecoder("utf-8").decode(data);
  }
  return text.trim().slice(0, MAX_EXTRACTED_CHARS);
}
