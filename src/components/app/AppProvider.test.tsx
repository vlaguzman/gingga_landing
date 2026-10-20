import { advance, app, navMock, Probe, renderInApp, run, setPath, USER } from "@/test/app.helper";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHATS } from "@/data/app/chats";
import { DEFAULT_REPLIES, DEALS } from "@/data/app/deals";
import { LEADS } from "@/data/app/leads";
import { OUTREACH } from "@/data/app/outreach";
import { AppProvider, useApp } from "./AppProvider";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const lead = (id: string) => LEADS.find((l) => l.id === id)!;
const toolMsgs = () => app().msgs.filter((m) => m.role === "tool");
const lastMsg = () => app().msgs[app().msgs.length - 1];
const deal = (id: string) => app().deals.find((d) => d.id === id)!;

describe("useApp", () => {
  it("throws a clear error outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    function Orphan() {
      useApp();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow("useApp must be used inside <AppProvider>");
  });
});

describe("section and user", () => {
  it.each([
    ["/today-dashboard", "today"],
    ["/chats", "chat"],
    ["/leads", "leads"],
    ["/leads/l1", "leads"],
    ["/outreach", "outreach"],
    ["/pipeline", "pipeline"],
    ["/playbook", "playbook"],
    ["/integrations", "sources"],
    ["/somewhere-else", "today"],
  ])("maps %s to the %s section", (path, section) => {
    renderInApp(null, { path });
    expect(app().section).toBe(section);
  });

  it("derives up to two uppercase initials from the account name", () => {
    renderInApp(null, { user: { name: "  ada king lovelace ", email: "a@b.c" } });
    expect(app().user).toEqual({ name: "  ada king lovelace ", email: "a@b.c", initials: "AK" });
  });

  it("handles single-word names", () => {
    renderInApp(null, { user: { name: "Ada", email: "a@b.c" } });
    expect(app().user.initials).toBe("A");
  });
});

describe("selection and navigation", () => {
  it("starts with nothing selected", () => {
    renderInApp(null);
    expect([app().leadSel, app().outSel, app().dealSel]).toEqual([null, null, null]);
  });

  it("openRecord selects a record without navigating", () => {
    renderInApp(null);
    run(() => app().openRecord("leads", "l1"));
    run(() => app().openRecord("outreach", "o1"));
    run(() => app().openRecord("pipeline", "d1"));
    expect([app().leadSel, app().outSel, app().dealSel]).toEqual(["l1", "o1", "d1"]);
    expect(navMock.push).not.toHaveBeenCalled();
  });

  it("openRecord ignores sections that have no records and clears when no id is given", () => {
    renderInApp(null);
    run(() => app().openRecord("leads", "l1"));
    run(() => app().openRecord("playbook", "x"));
    expect(app().leadSel).toBe("l1");
    run(() => app().openRecord("leads"));
    expect(app().leadSel).toBeNull();
  });

  it("goTo selects the record and pushes the section route", () => {
    renderInApp(null);
    run(() => app().goTo("pipeline", "d3"));
    expect(app().dealSel).toBe("d3");
    expect(navMock.push).toHaveBeenCalledWith("/pipeline");
    expect(app().section).toBe("pipeline");
  });

  it("clearSelection resets every open record", () => {
    renderInApp(null);
    run(() => {
      app().setLeadSel("l1");
      app().setOutSel("o1");
      app().setDealSel("d1");
    });
    run(() => app().clearSelection());
    expect([app().leadSel, app().outSel, app().dealSel]).toEqual([null, null, null]);
  });
});

describe("pillsFor", () => {
  it.each([
    ["/today-dashboard", "What should I do first?"],
    ["/playbook", "Something you should know…"],
    ["/integrations", "Connect a new lead source"],
    ["/chats", "Triage my leads"],
  ])("offers context pills on %s", (path, first) => {
    renderInApp(null, { path });
    expect(app().pillsFor()[0]).toBe(first);
  });

  it.each([
    ["/leads", "setLeadSel", "l1", "Which lead is hottest?", "Draft the first message"],
    ["/outreach", "setOutSel", "o1", "Which message should go first?", "Make it shorter"],
    ["/pipeline", "setDealSel", "d1", "Who needs a reply today?", "Prep the visit brief"],
  ] as const)("changes pills on %s once a record is open", (path, setter, id, without, withSel) => {
    renderInApp(null, { path });
    expect(app().pillsFor()[0]).toBe(without);
    run(() => app()[setter](id));
    expect(app().pillsFor()[0]).toBe(withSel);
  });
});

describe("send (generic chat)", () => {
  it("ignores blank messages", () => {
    renderInApp(null);
    run(() => app().send("   "));
    expect(app().msgs).toEqual([]);
  });

  it("appends the trimmed user message and a canned reply after 650ms", () => {
    renderInApp(null);
    run(() => app().send("  hello there "));
    expect(app().msgs).toEqual([{ role: "user", text: "hello there" }]);
    advance(649);
    expect(app().msgs).toHaveLength(1);
    advance(1);
    expect(app().msgs).toHaveLength(2);
    expect(lastMsg()).toMatchObject({ role: "assistant", text: expect.stringContaining("Got it.") });
  });

  it("rotates through the canned replies", () => {
    renderInApp(null);
    run(() => app().send("one"));
    advance(650);
    run(() => app().send("two"));
    advance(650);
    // msgs = [user, reply, user, reply]; the 4th message index picks the next canned text.
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Noted") });
  });
});

describe("send in an open lead", () => {
  it("answers 'why' with the lead's reasoning", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().setLeadSel("l1"));
    run(() => app().send("Why did you keep this lead?"));
    advance(650);
    expect(lastMsg()).toMatchObject({ role: "assistant", text: `${lead("l1").why} Buyer fit: ${lead("l1").fit}.` });
  });

  it("turns 'draft' into the first outreach option without repeating the user message", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().setLeadSel("l2"));
    run(() => app().send("Draft the first message"));
    advance(1400);
    expect(app().msgs.filter((m) => m.role === "user")).toHaveLength(1);
    expect(app().outreach[0].id).toBe("ow-l2-wa");
  });

  it("falls back to a generic reply for other text", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().setLeadSel("l1"));
    run(() => app().send("hello"));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Got it.") });
  });
});

describe("send in an open outreach draft", () => {
  const open = (id: string) => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().setOutSel(id));
  };

  it("offers a call script when a WhatsApp draft is asked to become a call", () => {
    open("o2");
    run(() => app().send("Switch to a call"));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("call script") });
    expect(app().bodies).toEqual({});
  });

  it("tightens a draft on 'shorter' and tracks the pass in a tool message", () => {
    open("o1");
    run(() => app().send("Make it shorter"));
    advance(500);
    expect(lastMsg()).toMatchObject({ role: "tool", name: "draft_outreach", status: "running" });
    expect(app().outLoading).toBe("o1");
    advance(1400);
    expect(app().outLoading).toBeNull();
    expect(toolMsgs().every((t) => t.status === "done")).toBe(true);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Updated") });
  });

  it("keeps only the first and last paragraph when a long draft is shortened", () => {
    open("o1");
    run(() => app().saveEdit("A\n\nB\n\nC"));
    advance(1000);
    run(() => app().send("shorter please"));
    advance(1900);
    expect(app().bodies.o1).toBe("A\n\nC");
  });

  it("prepends a new hook when asked to sharpen the opening", () => {
    open("o1");
    run(() => app().send("Sharper opening line"));
    advance(1900);
    expect(app().bodies.o1.startsWith("I saw you asked about the home just now")).toBe(true);
    expect(app().bodies.o1.endsWith(OUTREACH[0].body)).toBe(true);
  });

  it("explains what it can do for unrelated text", () => {
    open("o1");
    run(() => app().send("what is this"));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("You are looking at") });
  });

  it("does not offer a call switch when the draft is already a call", () => {
    open("o6");
    run(() => app().send("make this a call"));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("You are looking at") });
  });

  it("falls back to the generic reply when the open draft no longer exists", () => {
    open("ghost");
    run(() => app().send("hi"));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Got it.") });
  });
});

describe("send in an open deal", () => {
  it("summarises the deal stage and next step", () => {
    renderInApp(null, { path: "/pipeline" });
    run(() => app().setDealSel("d1"));
    run(() => app().send("Prep the visit brief"));
    advance(650);
    expect(lastMsg()).toMatchObject({
      text: `Juliana Arango is at “New Lead”. Next step: ${DEALS[0].next}`,
    });
  });

  it("falls back to the generic reply for an unknown deal id", () => {
    renderInApp(null, { path: "/pipeline" });
    run(() => app().setDealSel("ghost"));
    run(() => app().send("hi"));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Got it.") });
  });
});

describe("createOutreach", () => {
  it("drafts a new outreach step by step, then opens it in the workspace", () => {
    renderInApp(null, { path: "/leads" });
    const l2 = app().leads.find((l) => l.id === "l2")!;
    run(() => app().createOutreach(l2, l2.writes[0]));

    expect(app().msgs[0]).toEqual({ role: "user", text: "Draft the whatsapp reply for Camilo Restrepo" });
    expect(app().outreach[0]).toMatchObject({
      id: "ow-l2-wa",
      channel: "wa",
      title: "Camilo Restrepo — whatsapp reply",
      leadId: "l2",
      body: l2.writes[0].body,
    });
    expect(app().outLoading).toBe("ow-l2-wa");

    advance(400);
    expect(lastMsg()).toMatchObject({ name: "find_outreach", status: "running" });
    advance(1000);
    expect(toolMsgs().map((t) => t.name)).toEqual(["find_outreach", "draft_outreach"]);
    expect(toolMsgs()[0].detail).toContain("found: none");
    advance(1200);
    expect(toolMsgs().map((t) => t.name)).toContain("save_artifact");
    advance(800);
    expect(app().outSel).toBe("ow-l2-wa");
    expect(navMock.push).toHaveBeenCalledWith("/outreach");
    advance(800);

    expect(app().outLoading).toBeNull();
    expect(toolMsgs().every((t) => t.status === "done")).toBe(true);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Draft ready") });
  });

  it("opens the existing draft instead of creating a duplicate", () => {
    renderInApp(null, { path: "/leads" });
    const l1 = app().leads.find((l) => l.id === "l1")!;
    run(() => app().createOutreach(l1, l1.writes[0]));
    advance(1400);
    expect(app().outSel).toBe("o1");
    advance(800);
    expect(app().outreach.filter((o) => o.leadId === "l1" && o.channel === "wa")).toHaveLength(1);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("You already have a draft") });
    expect(toolMsgs().every((t) => t.status === "done")).toBe(true);
  });

  it("refuses to draft for a discarded lead", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().discardLead("l2"));
    advance(900);
    run(() => app().createOutreach(lead("l2"), lead("l2").writes[0]));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("was discarded") });
    expect(app().outreach.some((o) => o.leadId === "l2")).toBe(false);
  });

  it("refuses to draft for a lead already in the pipeline", () => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().setOutSel("o1"));
    run(() => app().sendOutreach("Today · 8:00 AM"));
    advance(2000);
    run(() => app().createOutreach(lead("l1"), lead("l1").writes[0], true));
    advance(650);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("already in the pipeline") });
  });
});

describe("saveEdit", () => {
  it("does nothing without an open draft", () => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().saveEdit("text"));
    expect(app().msgs).toEqual([]);
  });

  it("stores the edited body after a short save", () => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().setOutSel("o2"));
    run(() => app().setEditing(true));
    run(() => app().saveEdit("A brand new body"));
    expect(app().editing).toBe(false);
    expect(app().outLoading).toBe("o2");
    expect(lastMsg()).toMatchObject({ name: "save_artifact", status: "running" });
    expect((lastMsg() as { detail: string }).detail).toContain("chars: 16");
    advance(1000);
    expect(app().bodies.o2).toBe("A brand new body");
    expect(app().outLoading).toBeNull();
    expect(lastMsg()).toMatchObject({ status: "done" });
  });
});

describe("sendOutreach", () => {
  const sendOpen = (id: string, when = "Tomorrow · 8:00 AM") => {
    run(() => app().setOutSel(id));
    run(() => app().sendOutreach(when));
  };

  it("does nothing without an open draft or when the draft is unknown", () => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().sendOutreach("now"));
    run(() => app().setOutSel("ghost"));
    run(() => app().sendOutreach("now"));
    expect(app().msgs).toEqual([]);
  });

  it("turns a lead draft into a Contacting deal and moves to Pipeline", () => {
    renderInApp(null, { path: "/outreach" });
    sendOpen("o1");
    expect(lastMsg()).toMatchObject({ name: "send_message", status: "running" });
    expect((lastMsg() as { detail: string }).detail).toBe(
      `to: Valentina Ospina\nwhen: Tomorrow · 8:00 AM\nsigned: ${USER.name}`,
    );
    expect(app().outLoading).toBe("o1");

    advance(1100);
    expect(toolMsgs().map((t) => t.name)).toEqual(["send_message", "save_artifact"]);
    advance(900);

    const created = deal("dw-o1");
    expect(created).toMatchObject({
      stage: "contacting",
      channel: "wa",
      leadId: "l1",
      source: "Meta Lead Ads",
      meta: "Sends Tomorrow · 8:00 AM",
      name: "Valentina Ospina",
    });
    expect(created.tags).toEqual(["Torres del Parque", "First touch sent"]);
    expect(created.thread).toHaveLength(1);
    expect(created.thread[0]).toMatchObject({ dir: "out", text: OUTREACH[0].body });
    expect(created.activity[0][1]).toBe("Meta Lead Ads · lead captured");
    expect(app().deals[0].id).toBe("dw-o1");
    expect(app().outreach.some((o) => o.id === "o1")).toBe(false);
    expect(app().leads.some((l) => l.id === "l1")).toBe(false);
    expect(app().outLoading).toBeNull();
    expect(app().dealSel).toBe("dw-o1");
    expect(navMock.push).toHaveBeenCalledWith("/pipeline");
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("goes out tomorrow · 8:00 am") });
  });

  it("uses the edited body in the sent message", () => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().setOutSel("o1"));
    run(() => app().saveEdit("Edited text"));
    advance(1000);
    run(() => app().sendOutreach("Today · 8:00 AM"));
    advance(2000);
    expect(deal("dw-o1").thread[0].text).toBe("Edited text");
  });

  it("ignores a second approval while the first is in flight", () => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().setOutSel("o1"));
    run(() => {
      app().sendOutreach("Today · 8:00 AM");
      app().sendOutreach("Today · 8:00 AM");
    });
    expect(toolMsgs().filter((t) => t.name === "send_message")).toHaveLength(1);
    run(() => app().sendOutreach("Today · 8:00 AM"));
    expect(toolMsgs().filter((t) => t.name === "send_message")).toHaveLength(1);
    advance(2000);
    expect(app().deals.filter((d) => d.leadId === "l1")).toHaveLength(1);
  });

  it("does not send while the draft is still being saved", () => {
    renderInApp(null, { path: "/outreach" });
    run(() => app().setOutSel("o2"));
    run(() => app().saveEdit("x"));
    run(() => app().sendOutreach("now"));
    expect(toolMsgs().map((t) => t.name)).toEqual(["save_artifact"]);
  });

  it("reopens a New deal as Contacting, clears its draft and the unanswered tag", () => {
    renderInApp(null, { path: "/outreach" });
    const before = deal("d1");
    expect(before.stage).toBe("new");
    sendOpen("o2", "Today · 8:00 AM");
    advance(2000);
    const after = deal("d1");
    expect(after.stage).toBe("contacting");
    expect(after.draft).toBeUndefined();
    expect(after.tags).toEqual(["Altos de Niza", "Inbound"]);
    expect(after.thread).toHaveLength(before.thread.length + 1);
    expect(after.next).toContain("Watch for the reply");
    expect(after.last).toBe("Message approved · goes out Today · 8:00 AM");
    expect(app().deals).toHaveLength(DEALS.length);
    expect(app().dealSel).toBe("d1");
  });

  it("keeps the stage of a deal that is already past Contacting", () => {
    renderInApp(null, { path: "/outreach" });
    sendOpen("o3");
    advance(2000);
    expect(deal("d6").stage).toBe("visit");
    expect(deal("d6").draft).toBeUndefined();
    expect(deal("d6").thread.at(-1)).toMatchObject({ dir: "out" });
  });

  it("reopens a Nurturing deal and drops its nurturing tag and next touch", () => {
    renderInApp(null, { path: "/outreach" });
    sendOpen("o5");
    advance(2000);
    const d = deal("d14");
    expect(d.stage).toBe("contacting");
    expect(d.nextTouch).toBeUndefined();
    expect(d.nurtureReason).toBeUndefined();
    expect(d.tags).not.toContain("Nurturing");
  });

  it("starts a call: the call draft creates a deal with a call log", () => {
    renderInApp(null, { path: "/outreach" });
    sendOpen("o6", "now");
    expect(lastMsg()).toMatchObject({ name: "start_call" });
    expect((lastMsg() as { detail: string }).detail).toContain("dialing via VoIP");
    advance(2000);
    const d = deal("dw-o6");
    expect(d).toMatchObject({ channel: "call", meta: "Called today", last: "Call placed today" });
    expect(d.thread[0].text).toBe("Call placed · outcome to be logged.");
    expect(d.next).toContain("Log the outcome");
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Calling") });
  });

  it("reuses the lead's existing deal instead of creating a second one", () => {
    renderInApp(null, { path: "/outreach" });
    const l1 = app().leads.find((l) => l.id === "l1")!;
    // A call draft for l1 is created while l1 is still a lead, then both drafts are approved.
    run(() => app().createOutreach(l1, l1.writes[1], true));
    advance(4200);
    expect(app().outreach.some((o) => o.id === "ow-l1-call")).toBe(true);
    sendOpen("o1");
    advance(2000);
    sendOpen("ow-l1-call", "now");
    advance(2000);
    const deals = app().deals.filter((d) => d.leadId === "l1");
    expect(deals).toHaveLength(1);
    expect(deals[0].thread).toHaveLength(2);
    expect(deals[0].thread[1].text).toBe("Call placed · outcome to be logged.");
  });

  it("does not create a stray deal when approving a draft of an existing deal", () => {
    renderInApp(null, { path: "/outreach" });
    sendOpen("o2");
    advance(2000);
    expect(app().deals.some((d) => d.id === "dw-o2")).toBe(false);
  });
});

describe("leads: discard and undo", () => {
  it("discards a lead after a loading phase and offers undo for six seconds", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().setLeadSel("l1"));
    run(() => app().discardLead("l1"));
    expect(app().leadsLoading).toBe(true);
    expect(lastMsg()).toMatchObject({ name: "delete_artifact" });
    expect((lastMsg() as { detail: string }).detail).toContain(lead("l1").title);
    advance(900);
    expect(app().leads.some((l) => l.id === "l1")).toBe(false);
    expect(app().leadSel).toBeNull();
    expect(app().leadsLoading).toBe(false);
    expect(app().leadUndo).toBe("l1");
    // Drafts of a discarded lead are hidden, not deleted.
    expect(app().outreach.some((o) => o.id === "o1")).toBe(false);
    advance(5999);
    expect(app().leadUndo).toBe("l1");
    advance(1);
    expect(app().leadUndo).toBeNull();
  });

  it("describes unknown ids by id and keeps an unrelated selection", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().setLeadSel("l2"));
    run(() => app().discardLead("ghost"));
    expect((lastMsg() as { detail: string }).detail).toContain("title: ghost");
    advance(900);
    expect(app().leadSel).toBe("l2");
  });

  it("restarts the undo window when another lead is discarded", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().discardLead("l1"));
    advance(900);
    advance(4000);
    run(() => app().discardLead("l2"));
    advance(900);
    expect(app().leadUndo).toBe("l2");
    advance(5000);
    expect(app().leadUndo).toBe("l2");
    advance(1000);
    expect(app().leadUndo).toBeNull();
  });

  it("restores the last discarded lead and its drafts", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().discardLead("l1"));
    advance(900);
    run(() => app().undoDiscard());
    expect(app().leadUndo).toBeNull();
    expect(app().leadsLoading).toBe(true);
    expect(lastMsg()).toMatchObject({ name: "save_artifact" });
    advance(700);
    expect(app().leads.some((l) => l.id === "l1")).toBe(true);
    expect(app().outreach.some((o) => o.id === "o1")).toBe(true);
    expect(app().leadsLoading).toBe(false);
    expect(lastMsg()).toMatchObject({ status: "done" });
  });

  it("undoDiscard is a no-op when nothing was discarded", () => {
    renderInApp(null, { path: "/leads" });
    run(() => app().undoDiscard());
    expect(app().msgs).toEqual([]);
    expect(app().leadsLoading).toBe(false);
  });
});

describe("playbook editing through chat", () => {
  it("opens a titled correction chat and saves the new wording", () => {
    renderInApp(null, { path: "/playbook" });
    const claim = app().playbookClaims.find((c) => c.id === "i1")!;
    run(() => app().correctClaim(claim));
    expect(app().msgs[0]).toMatchObject({ role: "title", text: "Playbook correction" });
    expect(app().msgs[1]).toEqual({ role: "user", text: `Correct this in the playbook: “${claim.claim}”` });
    advance(600);
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Tell me how it should read") });

    run(() => app().send("Prefer buyers with a pre-approval."));
    advance(500);
    expect(lastMsg()).toMatchObject({ name: "save_artifact", status: "running" });
    expect((lastMsg() as { detail: string }).detail).toContain("field: who we target · i1");
    expect(app().pbLoadingId).toBe("i1");
    expect(navMock.push).toHaveBeenCalledWith("/playbook");
    advance(1600);

    const updated = app().playbookClaims.find((c) => c.id === "i1")!;
    expect(updated).toMatchObject({ claim: "Prefer buyers with a pre-approval.", corrected: true });
    expect(app().pbLoadingId).toBeNull();
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("the playbook now says it your way") });
  });

  it("adds a new claim to a group", () => {
    renderInApp(null, { path: "/playbook" });
    const before = app().playbookClaims.length;
    run(() => app().addToPlaybook("Process"));
    expect(app().msgs[0]).toMatchObject({ role: "title", text: "Playbook update" });
    expect(app().msgs[1]).toMatchObject({ text: "I want to add something to the playbook — process." });
    advance(600);

    run(() => app().send("Always confirm the visit the day before."));
    advance(500);
    expect(app().playbookClaims).toHaveLength(before + 1);
    expect(app().playbookClaims.at(-1)).toMatchObject({ claim: "", prov: "you", group: "Process" });
    expect(app().pbLoadingId).toBe(app().playbookClaims.at(-1)!.id);
    advance(1600);

    expect(app().playbookClaims.at(-1)).toMatchObject({ claim: "Always confirm the visit the day before." });
    expect(app().pbLoadingId).toBeNull();
    expect(lastMsg()).toMatchObject({ text: expect.stringContaining("Saved to the playbook") });
  });

  it("only adds the title once when the chat already has messages", () => {
    renderInApp(null, { path: "/playbook" });
    run(() => app().send("hello"));
    run(() => app().correctClaim(app().playbookClaims[0]));
    expect(app().msgs.filter((m) => m.role === "title")).toHaveLength(0);
    expect(app().msgs.filter((m) => m.role === "user")).toHaveLength(2);
  });
});

describe("sendDealMessage", () => {
  const pool = DEALS.find((d) => d.id === "d2")!.replies!;

  it("ignores blank text and unknown deals", () => {
    renderInApp(null, { path: "/pipeline" });
    const before = deal("d2").thread.length;
    run(() => app().sendDealMessage("d2", "   "));
    run(() => app().sendDealMessage("ghost", "hi"));
    expect(deal("d2").thread).toHaveLength(before);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("appends the message, shows typing at 1.2s and the canned reply at 3s", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    renderInApp(null, { path: "/pipeline" });
    const before = deal("d2").thread.length;
    run(() => app().sendDealMessage("d2", "  Is it near the metro? "));
    expect(deal("d2").thread).toHaveLength(before + 1);
    expect(deal("d2").thread.at(-1)).toMatchObject({ ch: "wa", dir: "out", text: "Is it near the metro?" });
    expect(app().typingDealId).toBeNull();

    advance(1199);
    expect(app().typingDealId).toBeNull();
    advance(1);
    expect(app().typingDealId).toBe("d2");
    advance(1799);
    expect(app().typingDealId).toBe("d2");
    advance(1);
    expect(app().typingDealId).toBeNull();
    expect(deal("d2").thread).toHaveLength(before + 2);
    expect(deal("d2").thread.at(-1)).toMatchObject({ dir: "in", text: pool[0] });
  });

  it("never repeats the previous canned reply back to back", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    renderInApp(null, { path: "/pipeline" });
    run(() => app().sendDealMessage("d2", "one"));
    advance(3000);
    run(() => app().sendDealMessage("d2", "two"));
    advance(3000);
    const incoming = deal("d2").thread.filter((m) => m.dir === "in").map((m) => m.text);
    expect(incoming).toEqual([pool[0], pool[1]]);
  });

  it("wraps around to the first reply when the repeat is the last one", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    renderInApp(null, { path: "/pipeline" });
    run(() => app().sendDealMessage("d2", "one"));
    advance(3000);
    run(() => app().sendDealMessage("d2", "two"));
    advance(3000);
    const incoming = deal("d2").thread.filter((m) => m.dir === "in").map((m) => m.text);
    expect(incoming).toEqual([pool[2], pool[0]]);
  });

  it("replaces pending timers so rapid sends get a single reply", () => {
    renderInApp(null, { path: "/pipeline" });
    const before = deal("d2").thread.length;
    run(() => app().sendDealMessage("d2", "first"));
    advance(500);
    run(() => app().sendDealMessage("d2", "second"));
    advance(3000);
    const thread = deal("d2").thread;
    expect(thread).toHaveLength(before + 3);
    expect(thread.filter((m) => m.dir === "in")).toHaveLength(DEALS.find((d) => d.id === "d2")!.thread.filter((m) => m.dir === "in").length + 1);
  });

  it("keeps another deal's typing indicator when this deal's reply lands", () => {
    renderInApp(null, { path: "/pipeline" });
    run(() => app().sendDealMessage("d2", "a"));
    advance(1000);
    run(() => app().sendDealMessage("d3", "b"));
    advance(1200);
    expect(app().typingDealId).toBe("d3");
    advance(1000); // d2's reply lands at t=3000
    expect(app().typingDealId).toBe("d3");
    advance(1000);
    expect(app().typingDealId).toBeNull();
  });

  it("falls back to the default replies for deals created at runtime", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    renderInApp(null, { path: "/outreach" });
    run(() => app().setOutSel("o1"));
    run(() => app().sendOutreach("Today · 8:00 AM"));
    advance(2000);
    run(() => app().sendDealMessage("dw-o1", "hi"));
    advance(3000);
    expect(deal("dw-o1").thread.at(-1)).toMatchObject({ dir: "in", text: DEFAULT_REPLIES[0] });
  });
});

describe("openThread", () => {
  it("replaces the chat with a titled thread", () => {
    renderInApp(null, { path: "/chats" });
    run(() => app().send("something"));
    run(() => app().openThread(CHATS[0]));
    expect(app().msgs[0]).toEqual({ role: "title", text: "Overnight lead capture", when: "6:00 AM" });
    expect(app().msgs).toHaveLength(1 + CHATS[0].msgs.length);
  });

  it("adds the group to the timestamp for older threads", () => {
    renderInApp(null, { path: "/chats" });
    run(() => app().openThread(CHATS[2]));
    expect(app().msgs[0]).toMatchObject({ when: "Yesterday · This week" });
  });
});

describe("lifecycle", () => {
  it("cancels pending timers when the provider unmounts", () => {
    setPath("/leads");
    const { unmount } = render(
      <AppProvider user={USER}>
        <Probe />
      </AppProvider>,
    );
    run(() => app().send("hi"));
    run(() => app().discardLead("l1"));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
