import { app, renderInApp } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ATTENTION, KPIS } from "@/data/app/today";
import { TodayView } from "./TodayView";

describe("TodayView", () => {
  it("greets the user by first name with the mock date", () => {
    renderInApp(<TodayView />);
    expect(screen.getByRole("heading", { level: 1, name: "Morning, Ada." })).toBeInTheDocument();
    expect(screen.getByText("Your day · Wed, Aug 20")).toBeInTheDocument();
  });

  it("falls back to a generic greeting when the name is blank", () => {
    renderInApp(<TodayView />, { user: { name: "   ", email: "x@y.z" } });
    expect(screen.getByRole("heading", { level: 1, name: "Morning, there." })).toBeInTheDocument();
  });

  it("shows the visits strip and the KPI cards linking to their sections", () => {
    renderInApp(<TodayView />);
    // The strip comes first, then the KPI card with the same label.
    const [strip, kpi] = screen.getAllByRole("link", { name: /Visits this week/ });
    expect(strip).toHaveAttribute("href", "/pipeline");
    expect(kpi).toHaveAttribute("href", "/pipeline");
    const first = screen.getByRole("link", { name: /New leads overnight/ });
    expect(first).toHaveAttribute("href", "/leads");
    expect(within(first).getByText("9")).toBeInTheDocument();
    for (const k of KPIS) {
      expect(screen.getAllByText(k.k).length).toBeGreaterThan(0);
    }
  });

  it("opens the record a KPI points to", async () => {
    const user = userEvent.setup();
    renderInApp(<TodayView />);
    const [strip, kpi] = screen.getAllByRole("link", { name: /Visits this week/ });
    await user.click(strip);
    expect(app().dealSel).toBeNull();
    await user.click(kpi);
    expect(app().dealSel).toBe("d6");
    await user.click(screen.getByRole("link", { name: /Proposals out/ }));
    expect(app().dealSel).toBe("d8");
  });

  it("lists what needs attention and opens the related record", async () => {
    const user = userEvent.setup();
    renderInApp(<TodayView />);
    const section = screen.getByRole("region", { name: "Needs your attention" });
    expect(within(section).getAllByRole("heading", { level: 3 })).toHaveLength(ATTENTION.length);
    await user.click(within(section).getByRole("link", { name: /Santiago’s visit confirmation/ }));
    expect(app().outSel).toBe("o3");
  });

  it("dismisses an item and shows an all-clear message once everything is dismissed", async () => {
    const user = userEvent.setup();
    renderInApp(<TodayView />);
    await user.click(screen.getByRole("button", { name: `Dismiss: ${ATTENTION[0].h}` }));
    expect(screen.queryByText(ATTENTION[0].h)).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Dismiss:/ })).toHaveLength(ATTENTION.length - 1);
    expect(screen.queryByText("All clear. Nothing waiting on you.")).not.toBeInTheDocument();

    for (const a of ATTENTION.slice(1)) {
      await user.click(screen.getByRole("button", { name: `Dismiss: ${a.h}` }));
    }
    expect(screen.getByText("All clear. Nothing waiting on you.")).toBeInTheDocument();
  });
});
