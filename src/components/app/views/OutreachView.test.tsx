import { advance, app, navMock, renderInApp, run } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OUTREACH } from "@/data/app/outreach";
import { OutreachView } from "./OutreachView";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const setup = () => {
  const user = userEvent.setup({ delay: null });
  renderInApp(<OutreachView />, { path: "/outreach" });
  return user;
};
const open = (id: string) => {
  const user = setup();
  run(() => app().setOutSel(id));
  return user;
};

describe("OutreachView list", () => {
  it("lists the drafts with channel, title and a short excerpt", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1, name: "Outreach" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(OUTREACH.length);
    const juliana = screen.getByRole("button", { name: /Juliana Arango — reply about availability/ });
    expect(within(juliana).getByText("WhatsApp")).toBeInTheDocument();
    const call = screen.getByRole("button", { name: /Daniela Torres — call script/ });
    expect(within(call).getByText("Call")).toBeInTheDocument();
  });

  it("truncates long excerpts at a word boundary with an ellipsis", () => {
    setup();
    const row = screen.getByRole("button", { name: /Valentina Ospina — first touch/ });
    const excerpt = row.querySelector(".df-excerpt")!.textContent!;
    expect(excerpt.endsWith("…")).toBe(true);
    expect(excerpt.length).toBeLessThanOrEqual(121);
    expect(OUTREACH[0].body.replace(/\n+/g, " ").startsWith(excerpt.slice(0, -1))).toBe(true);
  });

  it("opens a draft when its row is clicked and leaves edit mode", async () => {
    const user = setup();
    run(() => app().setEditing(true));
    await user.click(screen.getByRole("button", { name: /Santiago Osorio — visit confirmation/ }));
    expect(app().outSel).toBe("o3");
    expect(app().editing).toBe(false);
    expect(screen.getByText("Outreach · WhatsApp")).toBeInTheDocument();
  });
});

describe("OutreachView detail", () => {
  it("summarises the lead, goal and hook above the message", () => {
    open("o1");
    expect(screen.getByText("Meta Lead Ads · Torres del Parque campaign")).toBeInTheDocument();
    expect(screen.getByText(OUTREACH[0].goal)).toBeInTheDocument();
    expect(screen.getByText(/^“Hi Valentina! .+…”$/)).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
    expect(screen.getByText("Valentina Ospina", { selector: "dd" })).toBeInTheDocument();
    expect(screen.getByText(/Ada Lovelace · GINGGA · via/)).toHaveTextContent("via WhatsApp");
    expect(screen.getByText("Draft · nothing goes out without your approval")).toBeInTheDocument();
  });

  it("shows the hook in full when it is short", () => {
    open("o1");
    run(() => app().saveEdit("Short hook"));
    advance(1000);
    expect(screen.getByText("“Short hook”")).toBeInTheDocument();
  });

  it("shows a skeleton and disables actions while the draft is loading", () => {
    open("o2");
    run(() => app().saveEdit("text"));
    expect(screen.getByRole("status", { name: "Drafting" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Approve & send/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Edit/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Copy/ })).toBeDisabled();
  });

  it("edits a draft: cancel keeps the text, save stores the new body", async () => {
    const user = open("o2");
    await user.click(screen.getByRole("button", { name: /Edit/ }));
    expect(screen.getByText("Editing — changes save to memory")).toBeInTheDocument();
    const box = screen.getByRole("textbox", { name: "Edit draft" });
    expect(box).toHaveValue(OUTREACH[1].body);
    expect(box).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("textbox", { name: "Edit draft" })).not.toBeInTheDocument();
    expect(screen.getByText(/Yes, we still have 3-bedroom apartments/, { selector: ".mail-body" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Edit/ }));
    const next = screen.getByRole("textbox", { name: "Edit draft" });
    await user.clear(next);
    await user.type(next, "Hello Juliana, a new text");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("status", { name: "Drafting" })).toBeInTheDocument();
    advance(1000);
    expect(screen.getByText("Hello Juliana, a new text")).toBeInTheDocument();
    expect(screen.getByText("Draft · nothing goes out without your approval")).toBeInTheDocument();
  });

  it("copies the draft to the clipboard and confirms briefly", async () => {
    const user = open("o2");
    const write = vi.spyOn(navigator.clipboard, "writeText");
    await user.click(screen.getByRole("button", { name: /Copy/ }));
    expect(write).toHaveBeenCalledWith(OUTREACH[1].body);
    expect(screen.getByRole("button", { name: /Copied/ })).toBeInTheDocument();
    advance(1800);
    expect(screen.getByRole("button", { name: /Copy/ })).toBeInTheDocument();
  });

  it("still confirms the copy when the clipboard is unavailable", async () => {
    const user = open("o2");
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue(undefined as unknown as Clipboard);
    await user.click(screen.getByRole("button", { name: /Copy/ }));
    expect(screen.getByRole("button", { name: /Copied/ })).toBeInTheDocument();
  });

  it("approves a message for a chosen time slot", async () => {
    const user = open("o1");
    await user.click(screen.getByRole("button", { name: /Approve & send/ }));
    const select = screen.getByRole("combobox", { name: "When" });
    expect(within(select).getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Today · 8:00 AM",
      "Tomorrow · 8:00 AM",
      "Fri 22 · 8:00 AM",
      "Sat 23 · 8:00 AM",
      "Sun 24 · 8:00 AM",
    ]);
    await user.selectOptions(select, "Fri 22 · 8:00 AM");
    await user.click(screen.getByRole("button", { name: "Send" }));

    const tool = app().msgs.find((m) => m.role === "tool" && m.name === "send_message");
    expect(tool).toMatchObject({ detail: expect.stringContaining("when: Fri 22 · 8:00 AM") });
    expect(screen.getByRole("status", { name: "Drafting" })).toBeInTheDocument();
    advance(2000);
    expect(app().deals[0].meta).toBe("Sends Fri 22 · 8:00 AM");
    expect(navMock.push).toHaveBeenCalledWith("/pipeline");
    // The approved draft leaves Outreach, so the list is shown again.
    expect(screen.getByRole("heading", { level: 1, name: "Outreach" })).toBeInTheDocument();
  });

  it("defaults the time slot to today and can be cancelled", async () => {
    const user = open("o2");
    await user.click(screen.getByRole("button", { name: /Approve & send/ }));
    expect(screen.getByRole("button", { name: /Approve & send/ })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("combobox", { name: "When" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Approve & send/ }));
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(app().msgs.find((m) => m.role === "tool")).toMatchObject({ detail: expect.stringContaining("when: Today · 8:00 AM") });
  });

  it("starts a call draft with Dial now", async () => {
    const user = open("o6");
    expect(screen.getByText("Call", { selector: "dt" })).toBeInTheDocument();
    expect(screen.getByText("Call script · GINGGA dials and logs the call, you talk")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Start the call/ }));
    expect(screen.queryByRole("combobox", { name: "When" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dial now" }));
    expect(app().msgs.find((m) => m.role === "tool")).toMatchObject({ name: "start_call" });
  });

  it("hides the scheduler while editing", async () => {
    const user = open("o2");
    await user.click(screen.getByRole("button", { name: /Approve & send/ }));
    await user.click(screen.getByRole("button", { name: /Edit/ }));
    expect(screen.queryByRole("combobox", { name: "When" })).not.toBeInTheDocument();
  });
});
