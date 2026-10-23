import { renderInApp } from "@/test/app.helper";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { uploadSource } from "@/app/(app)/playbook/actions";
import type { PlaybookSourceItem } from "@/data/app/types";
import { PlaybookSources } from "./PlaybookSources";

const upload = vi.mocked(uploadSource);

const SOURCES: PlaybookSourceItem[] = [
  { id: "s1", filename: "price-list.pdf", sizeBytes: 2_411_520, status: "ready", errorMessage: null },
  { id: "s2", filename: "notes.md", sizeBytes: 900, status: "processing", errorMessage: null },
  { id: "s3", filename: "scan.pdf", sizeBytes: 52_000, status: "failed", errorMessage: "No text found in this file." },
];

const setup = (sources: readonly PlaybookSourceItem[]) => {
  renderInApp(<PlaybookSources sources={sources} />, { path: "/playbook" });
  return userEvent.setup();
};

beforeEach(() => {
  upload.mockReset();
  upload.mockResolvedValue({});
});

describe("PlaybookSources", () => {
  it("shows an empty state when nothing has been uploaded", () => {
    setup([]);
    expect(screen.getByRole("heading", { name: "Uploaded sources" })).toBeInTheDocument();
    expect(screen.getByText("No documents yet. Upload a PDF, TXT or MD file (up to 10 MB).")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("lists each source with its size and status", () => {
    setup(SOURCES);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(items[0]).getByText("price-list.pdf")).toBeInTheDocument();
    expect(within(items[0]).getByText(/2\.3 MB/)).toBeInTheDocument();
    expect(within(items[0]).getByText("Ready")).toBeInTheDocument();
    expect(within(items[1]).getByText(/900 B/)).toBeInTheDocument();
    expect(within(items[1]).getByText("Processing")).toBeInTheDocument();
    expect(within(items[2]).getByText(/51 KB/)).toBeInTheDocument();
  });

  it("explains why a source failed", () => {
    setup(SOURCES);
    const failed = screen.getByText("scan.pdf").closest("li") as HTMLElement;
    expect(within(failed).getByText("Failed")).toBeInTheDocument();
    expect(within(failed).getByText("No text found in this file.")).toBeInTheDocument();
  });

  it("submits the chosen file to the upload action", async () => {
    const user = setup([]);
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    const input = screen.getByLabelText("Choose a document") as HTMLInputElement;
    await user.upload(input, file);
    expect(input.files?.[0]?.name).toBe("notes.txt");
    await user.click(screen.getByRole("button", { name: "Upload" }));

    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    const fd = upload.mock.calls[0][1] as FormData;
    // jsdom does not carry the File through FormData; the field being posted is what matters here.
    expect(fd.has("file")).toBe(true);
  });

  it("shows the error text returned by the action", async () => {
    upload.mockResolvedValue({ error: "Files can be up to 10 MB." });
    const user = setup([]);
    await user.upload(screen.getByLabelText("Choose a document"), new File(["x"], "a.txt", { type: "text/plain" }));
    await user.click(screen.getByRole("button", { name: "Upload" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Files can be up to 10 MB.");
  });

  it("confirms a successful upload", async () => {
    upload.mockResolvedValue({ success: "Uploaded a.txt." });
    const user = setup([]);
    await user.upload(screen.getByLabelText("Choose a document"), new File(["x"], "a.txt", { type: "text/plain" }));
    await user.click(screen.getByRole("button", { name: "Upload" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Uploaded a.txt.");
  });
});
