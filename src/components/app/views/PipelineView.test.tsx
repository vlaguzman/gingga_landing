import { app, renderInApp, run } from "@/test/app.helper";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PipelineLead, PipelineStage } from "@/data/app/stages";

const { renameStage, reorderStages, updateLeadStage, loadLeadMessages, sendLeadMessage } = vi.hoisted(() => ({
  renameStage: vi.fn(),
  reorderStages: vi.fn(),
  updateLeadStage: vi.fn(),
  loadLeadMessages: vi.fn(),
  sendLeadMessage: vi.fn(),
}));
vi.mock("@/app/(app)/pipeline/actions", () => ({
  renameStage,
  reorderStages,
  updateLeadStage,
  loadLeadMessages,
  sendLeadMessage,
}));

import { PipelineView } from "./PipelineView";

const stages: PipelineStage[] = [
  { id: "s-new", name: "New Lead", hint: "Fresh", kind: "open", position: 0 },
  { id: "s-qual", name: "Qualified", hint: "Validated", kind: "open", position: 1 },
  { id: "s-visit", name: "Visit", hint: "Booked", kind: "open", position: 2 },
  { id: "s-won", name: "Won", hint: "Closed", kind: "won", position: 3 },
  { id: "s-lost", name: "Lost", hint: "Gone", kind: "lost", position: 4 },
];

const leads: PipelineLead[] = [
  { id: "l1", name: "Juliana Arango", phone: "+57 1", email: "juliana@example.com", stageId: "s-new", campaign: "Spring", lastContact: "2026-03-05T10:00:00.000Z" },
  { id: "l2", name: "Mauricio Salcedo", phone: "+57 2", email: null, stageId: "s-qual", campaign: null, lastContact: null },
  { id: "l3", name: "Alejandra Duarte", phone: "+57 3", email: null, stageId: "s-won", campaign: null, lastContact: null },
];

const setup = (opts: { stages?: PipelineStage[]; leads?: PipelineLead[] } = {}) => {
  const user = userEvent.setup();
  renderInApp(<PipelineView stages={opts.stages ?? stages} leads={opts.leads ?? leads} />, { path: "/pipeline" });
  return user;
};
const column = (name: string) => screen.getByRole("region", { name });
const columnNames = () => screen.getAllByRole("region").map((r) => r.getAttribute("aria-label"));

beforeEach(() => {
  vi.clearAllMocks();
  renameStage.mockResolvedValue({ ok: true });
  reorderStages.mockResolvedValue({ ok: true });
  updateLeadStage.mockResolvedValue({ ok: true });
  loadLeadMessages.mockResolvedValue({ ok: true, messages: [] });
});

describe("PipelineView board", () => {
  it("renders one column per open stage with its leads and counts", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1, name: "Pipeline" })).toBeInTheDocument();
    expect(columnNames()).toEqual(["New Lead", "Qualified", "Visit"]);
    const first = column("New Lead");
    expect(within(first).getByRole("button", { name: /Juliana Arango/ })).toHaveTextContent("Last contact 5 Mar");
    expect(within(first).getByRole("button", { name: /Juliana Arango/ })).toHaveTextContent("Spring");
    expect(within(column("Qualified")).getByRole("button", { name: /Mauricio Salcedo/ })).toHaveTextContent("No contact yet");
    expect(within(column("Visit")).getByText("Nothing here yet")).toBeInTheDocument();
  });

  it("keeps outcome leads off the board and shows them in their tab", async () => {
    const user = setup();
    expect(screen.queryByText("Alejandra Duarte")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Won" }));
    expect(screen.getByText("Alejandra Duarte")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Lost" }));
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("lists leads grouped by stage", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByRole("heading", { name: "New Lead · 1" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Visit/ })).not.toBeInTheDocument();
  });

  it("marks the active tab", async () => {
    const user = setup();
    expect(screen.getByRole("button", { name: "Board" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Edit stages" }));
    expect(screen.getByRole("button", { name: "Edit stages" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("region", { name: "Edit stages" })).toBeInTheDocument();
  });
});

describe("PipelineView column rename", () => {
  it("renames a column on double click", async () => {
    const user = setup();
    await user.dblClick(within(column("New Lead")).getByText("New Lead"));
    const input = screen.getByRole("textbox", { name: "Name for New Lead" });
    await user.clear(input);
    await user.type(input, "Inbox{Enter}");
    expect(renameStage).toHaveBeenCalledWith("s-new", "Inbox");
  });

  it("renames from the pencil button and cancels with Escape", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Rename Qualified" }));
    await user.type(screen.getByRole("textbox", { name: "Name for Qualified" }), "x{Escape}");
    expect(renameStage).not.toHaveBeenCalled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows the error and keeps editing when the name is rejected", async () => {
    renameStage.mockResolvedValue({ ok: false, error: "Another stage already has that name." });
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Rename Visit" }));
    const input = screen.getByRole("textbox", { name: "Name for Visit" });
    await user.clear(input);
    await user.type(input, "Won{Enter}");
    expect(await screen.findByRole("alert")).toHaveTextContent("Another stage already has that name.");
  });
});

describe("PipelineView column reorder", () => {
  it("moves a column with the keyboard buttons and persists the new order", async () => {
    let finish!: (r: { ok: true }) => void;
    reorderStages.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Move New Lead right" }));
    expect(reorderStages).toHaveBeenCalledWith(["s-qual", "s-new", "s-visit"]);
    // Optimistic while the save is in flight.
    expect(columnNames()).toEqual(["Qualified", "New Lead", "Visit"]);
    await act(async () => finish({ ok: true }));
  });

  it("disables moves past the edges", () => {
    setup();
    expect(screen.getByRole("button", { name: "Move New Lead left" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Visit right" })).toBeDisabled();
  });

  it("reorders by dragging a header onto another column; the leads travel with the stage", async () => {
    const { fireEvent } = await import("@testing-library/react");
    setup();
    const head = within(column("New Lead")).getByText("New Lead").closest(".kb-head")!;
    fireEvent.dragStart(head);
    fireEvent.dragOver(column("Visit"));
    fireEvent.drop(column("Visit"));
    expect(reorderStages).toHaveBeenCalledWith(["s-qual", "s-visit", "s-new"]);
    expect(within(column("New Lead")).getByText("Juliana Arango")).toBeInTheDocument();
  });

  it("reverts and shows the error when saving the order fails", async () => {
    reorderStages.mockResolvedValue({ ok: false, error: "The stages changed, refresh and try again." });
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Move New Lead right" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The stages changed");
    await waitFor(() => expect(columnNames()).toEqual(["New Lead", "Qualified", "Visit"]));
  });
});

describe("PipelineView lead detail", () => {
  const openLead = async (user: ReturnType<typeof setup>, name = /Juliana Arango/) => {
    await user.click(within(column("New Lead")).getByRole("button", { name }));
  };

  it("always shows the WhatsApp chat, with an empty state when there are no messages", async () => {
    const user = setup();
    await openLead(user);
    expect(app().dealSel).toBe("l1");
    expect(screen.getByRole("region", { name: "WhatsApp chat with Juliana Arango" })).toBeInTheDocument();
    expect(await screen.findByText("No messages yet. Say hello below.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Message Juliana Arango" })).toBeInTheDocument();
    expect(loadLeadMessages).toHaveBeenCalledWith("l1");
  });

  it("opens the contact info and changes the stage", async () => {
    const user = setup();
    await openLead(user);
    await user.click(screen.getByRole("button", { name: /Contact info/ }));
    expect(screen.getByText("juliana@example.com")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Stage"), "s-visit");
    expect(updateLeadStage).toHaveBeenCalledWith("l1", "s-visit");
  });

  it("reverts the stage and shows the error when the update fails", async () => {
    updateLeadStage.mockResolvedValue({ ok: false, error: "Unknown stage." });
    const user = setup();
    await openLead(user);
    await user.click(screen.getByRole("button", { name: /Contact info/ }));
    await user.selectOptions(screen.getByLabelText("Stage"), "s-visit");
    expect(await screen.findByRole("alert")).toHaveTextContent("Unknown stage.");
    expect(screen.getByLabelText("Stage")).toHaveValue("s-new");
  });

  it("shows the board when the selected id is not a lead (e.g. a mock deal id)", () => {
    setup();
    run(() => app().setDealSel("d6"));
    expect(screen.getByRole("heading", { level: 1, name: "Pipeline" })).toBeInTheDocument();
  });
});
