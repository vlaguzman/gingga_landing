import { app, navMock, renderInApp } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DEALS } from "@/data/app/deals";
import { ContactPanel } from "./ContactPanel";

const dealOf = (id: string) => DEALS.find((d) => d.id === id)!;

describe("ContactPanel", () => {
  it("shows the person, their profile, notes, next step and activity", () => {
    const d = dealOf("d1");
    renderInApp(<ContactPanel deal={d} onClose={() => undefined} />);
    const panel = screen.getByRole("complementary", { name: "Contact details" });
    expect(within(panel).getByText("Juliana Arango")).toBeInTheDocument();
    expect(within(panel).getByText("3-bedroom in Niza")).toBeInTheDocument();
    expect(within(panel).getByText("New Lead")).toBeInTheDocument();
    expect(within(panel).getByText(/No contact attempt yet/)).toBeInTheDocument();
    expect(within(panel).getByText("JA")).toBeInTheDocument();
    for (const label of ["Phone", "Email", "City", "Source", "First contact", "Project / unit", "Budget", "Preferred zone", "Financing", "Household", "Timeline to buy"]) {
      expect(within(panel).getByText(label)).toBeInTheDocument();
    }
    expect(within(panel).getByText(d.phone)).toBeInTheDocument();
    expect(within(panel).getByText(d.budget)).toBeInTheDocument();
    expect(within(panel).getByText("Unanswered")).toBeInTheDocument();
    expect(within(panel).getByText(d.notes)).toBeInTheDocument();
    expect(within(panel).getByText(d.next)).toBeInTheDocument();
    expect(within(panel).getByText("Inbound WhatsApp · asked about the 3-bedroom")).toBeInTheDocument();
  });

  it("omits the Outcome block for open deals", () => {
    renderInApp(<ContactPanel deal={dealOf("d1")} onClose={() => undefined} />);
    expect(screen.queryByRole("heading", { name: "Outcome" })).not.toBeInTheDocument();
  });

  it("shows the sale price and closing date for a won deal", () => {
    renderInApp(<ContactPanel deal={dealOf("d12")} onClose={() => undefined} />);
    expect(screen.getByRole("heading", { name: "Outcome" })).toBeInTheDocument();
    expect(screen.getByText("Sale price")).toBeInTheDocument();
    expect(screen.getByText("COP 612,000,000")).toBeInTheDocument();
    expect(screen.getByText("Closed on")).toBeInTheDocument();
    expect(screen.queryByText("Lost reason")).not.toBeInTheDocument();
  });

  it("shows the lost reason for a lost deal", () => {
    renderInApp(<ContactPanel deal={dealOf("d13")} onClose={() => undefined} />);
    expect(screen.getByText("Lost reason")).toBeInTheDocument();
    expect(screen.getByText("Needed to move in 2 months; bought a ready-to-move apartment elsewhere.")).toBeInTheDocument();
  });

  it("shows the next touch and the reason for a nurturing deal", () => {
    renderInApp(<ContactPanel deal={dealOf("d14")} onClose={() => undefined} />);
    expect(screen.getByText("Next touch")).toBeInTheDocument();
    expect(screen.getByText("Nov 3")).toBeInTheDocument();
    expect(screen.getByText("Why nurturing")).toBeInTheDocument();
  });

  it("opens the pending draft in Outreach", async () => {
    const user = userEvent.setup();
    renderInApp(<ContactPanel deal={dealOf("d1")} onClose={() => undefined} />, { path: "/pipeline" });
    await user.click(screen.getByRole("button", { name: /Open the draft/ }));
    expect(navMock.push).toHaveBeenCalledWith("/outreach");
    expect(app().outSel).toBe("o2");
  });

  it("hides the draft button when the deal has no draft", () => {
    renderInApp(<ContactPanel deal={dealOf("d2")} onClose={() => undefined} />);
    expect(screen.queryByRole("button", { name: /Open the draft/ })).not.toBeInTheDocument();
  });

  it("closes from the close button, the scrim and the Escape key", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = renderInApp(<ContactPanel deal={dealOf("d1")} onClose={onClose} />);
    const close = screen.getByRole("button", { name: "Close contact info" });
    expect(close).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(close);
    expect(onClose).toHaveBeenCalledTimes(2);

    await user.click(container.querySelector(".cp-scrim") as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
