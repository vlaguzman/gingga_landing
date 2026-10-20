import { advance, app, navMock, renderInApp, run } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LEADS } from "@/data/app/leads";
import { LeadsView } from "./LeadsView";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const setup = () => {
  const user = userEvent.setup({ delay: null });
  renderInApp(<LeadsView />, { path: "/leads" });
  return user;
};

describe("LeadsView list", () => {
  it("lists the leads with their source and a New badge on fresh ones", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1, name: "Leads" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Discard lead:/ })).toHaveLength(LEADS.length);
    const first = screen.getByRole("button", { name: new RegExp(`^${LEADS[0].title}`) });
    expect(within(first).getByText("New")).toBeInTheDocument();
    expect(within(first).getByText("Meta Lead Ads", { selector: ".via span" })).toBeInTheDocument();
    expect(within(first).getByText(LEADS[0].src.label)).toBeInTheDocument();
    const notFresh = screen.getByRole("button", { name: new RegExp(`^${LEADS[3].title}`) });
    expect(within(notFresh).queryByText("New")).not.toBeInTheDocument();
  });

  it("opens a lead's detail", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: new RegExp(`^${LEADS[1].title}`) }));
    expect(app().leadSel).toBe("l2");
    expect(screen.getByRole("heading", { level: 2, name: LEADS[1].title })).toBeInTheDocument();
  });

  it("discards a lead behind a loading skeleton, then offers undo", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: `Discard lead: ${LEADS[0].title}` }));
    expect(screen.getByRole("status", { name: "Updating leads" })).toBeInTheDocument();
    expect(screen.queryByText(LEADS[0].title)).not.toBeInTheDocument();

    advance(900);
    expect(screen.queryByRole("status", { name: "Updating leads" })).not.toBeInTheDocument();
    expect(screen.queryByText(LEADS[0].title)).not.toBeInTheDocument();
    expect(screen.getByText(/Lead discarded\./)).toBeInTheDocument();

    advance(6000);
    expect(screen.queryByText(/Lead discarded\./)).not.toBeInTheDocument();
  });

  it("restores a discarded lead with Undo", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: `Discard lead: ${LEADS[0].title}` }));
    advance(900);
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.queryByText(/Lead discarded\./)).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Updating leads" })).toBeInTheDocument();
    advance(700);
    expect(screen.getByText(LEADS[0].title)).toBeInTheDocument();
  });

  it("shows an empty state once every lead is gone", () => {
    setup();
    run(() => LEADS.forEach((l) => app().discardLead(l.id)));
    advance(900);
    expect(screen.getByText(/Inbox pruned/)).toBeInTheDocument();
  });
});

describe("LeadsView detail", () => {
  const open = (id: string) => {
    const user = setup();
    run(() => app().setLeadSel(id));
    return user;
  };

  it("shows the lead's story, contact and first-touch options", () => {
    open("l1");
    expect(screen.getByText("Lead · New today")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: LEADS[0].title })).toBeInTheDocument();
    for (const p of LEADS[0].body) expect(screen.getByText(p)).toBeInTheDocument();
    expect(screen.getByText(LEADS[0].contact)).toBeInTheDocument();
    const options = screen.getAllByRole("button", { name: /Draft this/ });
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("WhatsApp greeting");
    expect(options[1]).toHaveTextContent("Call script");
  });

  it("omits the New today marker for older leads", () => {
    open("l4");
    expect(screen.getByText("Lead")).toBeInTheDocument();
    expect(screen.queryByText(/New today/)).not.toBeInTheDocument();
  });

  it("starts a draft from a first-touch option", async () => {
    const user = open("l2");
    await user.click(screen.getByRole("button", { name: /Draft this/ }));
    expect(app().msgs[0]).toEqual({ role: "user", text: "Draft the whatsapp reply for Camilo Restrepo" });
    advance(4200);
    expect(app().outSel).toBe("ow-l2-wa");
    expect(navMock.push).toHaveBeenCalledWith("/outreach");
  });

  it("toggles the extra context", async () => {
    const user = open("l1");
    const toggle = screen.getByRole("button", { name: /More context/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(LEADS[0].why)).not.toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByText(LEADS[0].why)).toBeInTheDocument();
    expect(screen.getByText(LEADS[0].fit)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Hide context/ }));
    expect(screen.queryByText(LEADS[0].why)).not.toBeInTheDocument();
  });

  it("discards the open lead and goes back to the list", async () => {
    const user = open("l1");
    await user.click(screen.getByRole("button", { name: "Discard lead" }));
    advance(900);
    expect(app().leadSel).toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: "Leads" })).toBeInTheDocument();
    expect(screen.queryByText(LEADS[0].title)).not.toBeInTheDocument();
  });
});
