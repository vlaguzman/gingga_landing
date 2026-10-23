import { beforeEach, describe, expect, it, vi } from "vitest";

const requireUser = vi.fn();
const upload = vi.fn();
const from = vi.fn(() => ({ upload }));
const createSource = vi.fn();
const updateSource = vi.fn();
const revalidatePath = vi.fn();

vi.mock("@/lib/auth", () => ({ requireUser: () => requireUser() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn(async () => ({ storage: { from } })) }));
vi.mock("@/lib/playbook/queries", () => ({
  createSource: (...a: unknown[]) => createSource(...a),
  updateSource: (...a: unknown[]) => updateSource(...a),
}));
vi.mock("next/cache", () => ({ revalidatePath: (p: string) => revalidatePath(p) }));

import { MAX_UPLOAD_BYTES } from "@/lib/playbook/extract";
import { uploadSource } from "./actions";

const form = (file?: File) => {
  const fd = new FormData();
  if (file) fd.set("file", file);
  return fd;
};
const createdId = () => createSource.mock.calls[0][1].id as string;
const txt = (name = "notes.txt", body = "Reply within five minutes.") => new File([body], name, { type: "text/plain" });

beforeEach(() => {
  vi.clearAllMocks();
  requireUser.mockResolvedValue({ id: "u1", brandId: "brand-1" });
  upload.mockResolvedValue({ error: null });
  createSource.mockResolvedValue({ id: "s1" });
  updateSource.mockResolvedValue({ id: "s1" });
});

describe("uploadSource", () => {
  it("does nothing when the user is not signed in", async () => {
    requireUser.mockRejectedValue(new Error("NEXT_REDIRECT:/login"));
    await expect(uploadSource({}, form(txt()))).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(createSource).not.toHaveBeenCalled();
    expect(upload).not.toHaveBeenCalled();
  });

  it("asks for a file when none is sent", async () => {
    await expect(uploadSource({}, form())).resolves.toEqual({ error: "Choose a file to upload." });
    expect(createSource).not.toHaveBeenCalled();
  });

  it("rejects an empty file", async () => {
    await expect(uploadSource({}, form(txt("empty.txt", "")))).resolves.toEqual({ error: "That file is empty." });
    expect(createSource).not.toHaveBeenCalled();
  });

  it("rejects unsupported types by extension, whatever the client says the mime is", async () => {
    const exe = new File(["x"], "evil.exe", { type: "application/pdf" });
    await expect(uploadSource({}, form(exe))).resolves.toEqual({ error: "Only PDF, TXT and MD files are supported." });
    const noExt = new File(["x"], "README", { type: "text/plain" });
    await expect(uploadSource({}, form(noExt))).resolves.toEqual({ error: "Only PDF, TXT and MD files are supported." });
    expect(createSource).not.toHaveBeenCalled();
  });

  it("rejects files over 10 MB", async () => {
    const big = txt("big.txt", "a".repeat(MAX_UPLOAD_BYTES + 1));
    await expect(uploadSource({}, form(big))).resolves.toEqual({ error: "Files can be up to 10 MB." });
    expect(createSource).not.toHaveBeenCalled();
  });

  it("rejects a .pdf that is not a PDF", async () => {
    const fake = new File(["just text"], "fake.pdf", { type: "application/pdf" });
    await expect(uploadSource({}, form(fake))).resolves.toEqual({ error: "That file is not a valid PDF." });
    expect(createSource).not.toHaveBeenCalled();
  });

  it("stores the file under the brand, extracts the text and marks the source ready", async () => {
    const out = await uploadSource({}, form(txt("Sales notes.md")));

    expect(out).toEqual({ success: "Uploaded Sales notes.md." });
    const input = createSource.mock.calls[0][1];
    expect(createSource.mock.calls[0][0]).toBe("brand-1");
    expect(input).toMatchObject({ filename: "Sales notes.md", mimeType: "text/markdown", sizeBytes: 26 });
    expect(input.storagePath).toBe(`brand-1/${input.id}/Sales_notes.md`);
    expect(from).toHaveBeenCalledWith("playbook-sources");
    expect(upload).toHaveBeenCalledWith(input.storagePath, expect.any(Uint8Array), {
      contentType: "text/markdown",
      upsert: false,
    });
    expect(updateSource).toHaveBeenCalledWith("brand-1", input.id, {
      status: "ready",
      extractedText: "Reply within five minutes.",
      errorMessage: null,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/playbook");
  });

  it("strips path parts and unsafe characters from the storage key", async () => {
    await uploadSource({}, form(txt("../../etc/pass wd?.txt")));
    expect(createSource.mock.calls[0][1].storagePath).toMatch(/^brand-1\/[0-9a-f-]{36}\/pass_wd_\.txt$/);
  });

  it("marks the source failed when the file cannot be read", async () => {
    const broken = new File(["%PDF-1.4 garbage"], "broken.pdf", { type: "application/pdf" });
    const out = await uploadSource({}, form(broken));

    expect(out).toEqual({ error: "We could not read broken.pdf." });
    expect(updateSource).toHaveBeenCalledWith("brand-1", createdId(), {
      status: "failed",
      errorMessage: "We could not read text from this file.",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/playbook");
  });

  it("marks the source failed when the document has no text", async () => {
    const out = await uploadSource({}, form(txt("blank.txt", "   \n ")));
    expect(out).toEqual({ error: "We could not read blank.txt." });
    expect(updateSource).toHaveBeenCalledWith("brand-1", createdId(), {
      status: "failed",
      errorMessage: "No text found in this file.",
    });
  });

  it("marks the source failed when storage rejects the upload", async () => {
    upload.mockResolvedValue({ error: { message: "bucket not found" } });
    const out = await uploadSource({}, form(txt()));

    expect(out).toEqual({ error: "We could not store notes.txt." });
    expect(updateSource).toHaveBeenCalledWith("brand-1", createdId(), {
      status: "failed",
      errorMessage: "The file could not be stored.",
    });
  });
});
