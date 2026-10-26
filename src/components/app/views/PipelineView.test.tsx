import { advance, app, navMock, renderInApp, run } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STAGES } from "@/data/app/chips";
import { DEALS } from "@/data/app/deals";
import type { PipelineStage } from "@/data/app/stages";
import type { StageId } from "@/data/app/types";
import { PipelineView } from "./PipelineView";

vi.mock("@/app/(app)/pipeline/actions", () => ({ renameStage: vi.fn(), updateLeadStage: vi.fn() }));

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const KINDS: Record<string, PipelineStage["kind"]> = { won: "won", lost: "lost", nurturing: "nurturing" };
const DEFAULT: PipelineStage[] = (Object.keys(STAGES) as StageId[]).map((slug, position) => ({
  id: `stage-${slug}`,
  ...STAGES[slug],
  kind: KINDS[slug] ?? "open",
  position,
}));

const setup = (stages: PipelineStage[] = DEFAULT) => {
  const user = userEvent.setup({ delay: null });
  renderInApp(<PipelineView stages={stages} />, { path: "/pipeline" });
  return user;
};
const column = (name: string) => screen.getByRole("region", { name });

describe("PipelineView board", () => {
  it("groups deals into stage columns with counts", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1, name: "Pipeline" })).toBeInTheDocument();
    expect(screen.getAllByRole("region")).toHaveLength(7);
    const contacting = column("Contacting");
    expect(within(contacting).getByText("2")).toBeInTheDocument();
    expect(within(contacting).getByRole("button", { name: /Mauricio Salcedo/ })).toBeInTheDocument();
    expect(within(contacting).getByRole("button", { name: /Natalia Giraldo/ })).toBeInTheDocument();
    expect(within(column("New Lead")).getByRole("button", { name: /Juliana Arango/ })).toHaveTextContent(DEALS[0].property);
    expect(within(column("Reserved")).getByText("Héctor Bermúdez")).toBeInTheDocument();
  });

  it("does not show won, lost or nurturing deals on the board", () => {
    setup();
    expect(screen.queryByText("Alejandra Duarte")).not.toBeInTheDocument();
    expect(screen.queryByText("Gustavo Pardo")).not.toBeInTheDocument();
    expect(screen.queryByText("Diana Ruiz")).not.toBeInTheDocument();
  });

  it("opens a deal from its card", async () => {
    const user = setup();
    await user.click(within(column("Visit Scheduled")).getByRole("button", { name: /Santiago Osorio/ }));
    expect(app().dealSel).toBe("d6");
    expect(screen.getByText("Visit scheduled · Thu · 10:00 AM")).toBeInTheDocument();
  });
});

describe("PipelineView custom stages", () => {
  it("renders the brand's own open stages as columns and keeps orphaned deals in the first one", () => {
    setup([
      { id: "a", name: "Inbox", hint: "", kind: "open", position: 0 },
      { id: "b", name: "Closing", hint: "", kind: "open", position: 1 },
      { id: "c", name: "Done", hint: "", kind: "won", position: 2 },
    ]);
    expect(screen.getAllByRole("region").map((r) => r.getAttribute("aria-label"))).toEqual(["Inbox", "Closing"]);
    expect(within(column("Inbox")).getByRole("button", { name: /Juliana Arango/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
  });
});

describe("PipelineView tabs", () => {
  it("marks the active tab", async () => {
    const user = setup();
    const board = screen.getByRole("button", { name: "Board" });
    expect(board).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
    expect(board).toHaveAttribute("aria-pressed", "false");
  });

  it("lists active deals grouped by stage", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByRole("heading", { name: "Qualified · 2" })).toBeInTheDocument();
    const row = screen.getByRole("button", { name: /Carolina Vélez/ });
    expect(row).toHaveTextContent("Parques de Sabaneta · 2-bedroom · Qualified yesterday");
    await user.click(row);
    expect(app().dealSel).toBe("d4");
  });

  it.each([
    ["Won", "Purchase deed signed", "Alejandra Duarte", /COP 612,000,000 · deed signed Aug 14/],
    ["Lost", "Buyer went elsewhere", "Gustavo Pardo", /bought a ready-to-move apartment elsewhere\. · Aug 16/],
    ["Nurturing", "Not ready now", "Diana Ruiz", /Next touch Nov 3 · Wants to wait until her lease ends in January\./],
  ])("shows the %s outcome tab", async (tab, hint, name, detail) => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: tab }));
    expect(screen.getByText(new RegExp(hint))).toBeInTheDocument();
    const row = screen.getByRole("button", { name: new RegExp(name) });
    expect(row).toHaveTextContent(detail);
    expect(screen.queryByText("Nothing here yet.")).not.toBeInTheDocument();
    await user.click(row);
    expect(app().dealSel).toBe(DEALS.find((d) => d.name === name)!.id);
  });
});

describe("PipelineView deal detail", () => {
  const open = (id: string) => {
    const user = setup();
    run(() => app().setDealSel(id));
    return user;
  };

  it("shows the deal's state banner and the WhatsApp conversation", () => {
    open("d4");
    expect(screen.getByText("Qualified — budget and zone validated")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "WhatsApp chat with Carolina Vélez" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pipeline" })).not.toBeInTheDocument();
  });

  it.each([
    ["d1", "New lead — no contact attempt yet"],
    ["d2", "Contacting — follow-ups in progress"],
    ["d8", "Proposal sent — waiting for feedback"],
    ["d10", "Negotiation — resolving financing and conditions"],
    ["d11", "Reserved — documentation in progress"],
    ["d12", "Won — COP 612,000,000"],
    ["d13", "Lost — see the reason in contact info"],
    ["d14", "Nurturing — next touch Nov 3"],
    ["d7", "Visit scheduled · Fri · 4:30 PM"],
  ])("describes deal %s as %s", (id, title) => {
    open(id);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("links to the pending draft in Outreach", async () => {
    const user = open("d1");
    await user.click(screen.getByRole("button", { name: /Open the draft/ }));
    expect(navMock.push).toHaveBeenCalledWith("/outreach");
    expect(app().outSel).toBe("o2");
  });

  it("has no draft shortcut for deals without a draft", () => {
    open("d2");
    expect(screen.queryByRole("button", { name: /Open the draft/ })).not.toBeInTheDocument();
  });

  it("opens and closes the contact panel", async () => {
    const user = open("d12");
    expect(screen.queryByRole("complementary", { name: "Contact details" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Contact info" }));
    const panel = screen.getByRole("complementary", { name: "Contact details" });
    expect(within(panel).getByText("COP 612,000,000")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close contact info" }));
    expect(screen.queryByRole("complementary", { name: "Contact details" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Contact info" }));
    await user.click(screen.getByRole("button", { name: "Contact info" }));
    expect(screen.queryByRole("complementary", { name: "Contact details" })).not.toBeInTheDocument();
  });

  it("chats with the contact and gets the simulated reply", async () => {
    const user = open("d5");
    await user.type(screen.getByRole("textbox", { name: "Message Felipe Londoño" }), "See you Thursday{Enter}");
    expect(screen.getByText("See you Thursday")).toBeInTheDocument();
    advance(3000);
    expect(screen.getByText("Thursday afternoon works.")).toBeInTheDocument();
  });

  it("resets the contact panel when switching to another deal", async () => {
    const user = open("d1");
    await user.click(screen.getByRole("button", { name: "Contact info" }));
    run(() => app().setDealSel("d2"));
    expect(screen.queryByRole("complementary", { name: "Contact details" })).not.toBeInTheDocument();
  });
});
