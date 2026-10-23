"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { extractText, MAX_UPLOAD_BYTES, SOURCE_MIME, sourceKindOf } from "@/lib/playbook/extract";
import { createSource, updateSource } from "@/lib/playbook/queries";
import { createClient } from "@/lib/supabase/server";

/**
 * Storage bucket for uploaded playbook documents. It must exist in Supabase and be PRIVATE (public =
 * false); it is not created by the app or the seed. Objects live at {brandId}/{sourceId}/{filename}.
 * Uploads run with the signed-in user's session, so storage.objects needs an INSERT policy for the
 * `authenticated` role scoped to this bucket (ideally to the user's brand folder).
 */
const BUCKET = "playbook-sources";

export type UploadState = { error?: string; success?: string };

const MAX_NAME = 200;

/** Safe storage key segment: no path parts, only [A-Za-z0-9._-], never starts with a dot. */
function storageName(filename: string) {
  const base = filename.split(/[\\/]/).pop() ?? "";
  return base.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "") || "file";
}

export async function uploadSource(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const { brandId } = await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.name === "") return { error: "Choose a file to upload." };

  // Everything below is decided from the file's real name and bytes, never from client-sent metadata.
  const kind = sourceKindOf(file.name);
  if (!kind) return { error: "Only PDF, TXT and MD files are supported." };
  if (file.size === 0) return { error: "That file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Files can be up to 10 MB." };

  const data = new Uint8Array(await file.arrayBuffer());
  if (data.byteLength > MAX_UPLOAD_BYTES) return { error: "Files can be up to 10 MB." };
  if (kind === "pdf" && new TextDecoder().decode(data.subarray(0, 5)) !== "%PDF-") {
    return { error: "That file is not a valid PDF." };
  }

  const filename = (file.name.split(/[\\/]/).pop() ?? file.name).slice(0, MAX_NAME);
  const mimeType = SOURCE_MIME[kind];
  const id = crypto.randomUUID();
  const storagePath = `${brandId}/${id}/${storageName(filename)}`;

  await createSource(brandId, { id, filename, mimeType, sizeBytes: data.byteLength, storagePath });

  const fail = async (errorMessage: string, message: string): Promise<UploadState> => {
    await updateSource(brandId, id, { status: "failed", errorMessage });
    revalidatePath("/playbook");
    return { error: message };
  };

  const supabase = await createClient();
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, data, { contentType: mimeType, upsert: false });
  if (storageError) return fail("The file could not be stored.", `We could not store ${filename}.`);

  let text: string;
  try {
    text = await extractText(kind, data);
  } catch {
    return fail("We could not read text from this file.", `We could not read ${filename}.`);
  }
  if (!text) return fail("No text found in this file.", `We could not read ${filename}.`);

  await updateSource(brandId, id, { status: "ready", extractedText: text, errorMessage: null });
  revalidatePath("/playbook");
  return { success: `Uploaded ${filename}.` };
}
