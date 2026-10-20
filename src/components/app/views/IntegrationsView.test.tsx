import "@/test/app.helper";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INTEGRATIONS } from "@/data/app/integrations";
import { IntegrationsView } from "./IntegrationsView";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const setup = () => {
  const user = userEvent.setup({ delay: null });
  render(<IntegrationsView />);
  return user;
};
const row = (name: string) => screen.getByRole("heading", { name }).closest("li") as HTMLElement;

describe("IntegrationsView", () => {
  it("lists every integration with its initial connection state", () => {
    setup();
    expect(screen.getAllByRole("listitem")).toHaveLength(INTEGRATIONS.length);
    for (const name of ["WhatsApp Business", "Meta Lead Ads", "Instagram", "Google Calendar"]) {
      expect(within(row(name)).getByText("Connected")).toBeInTheDocument();
      expect(within(row(name)).getByRole("button", { name: `Disconnect ${name}` })).toBeInTheDocument();
    }
    expect(within(row("Property portal")).getByRole("button", { name: "Add API key" })).toBeInTheDocument();
    expect(within(row("CRM / Google Sheets")).getByRole("button", { name: "Add API key" })).toBeInTheDocument();
  });

  it("disconnects an integration and offers to sign in again", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Disconnect WhatsApp Business" }));
    expect(within(row("WhatsApp Business")).queryByText("Connected")).not.toBeInTheDocument();
    expect(within(row("WhatsApp Business")).getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("signs in through OAuth after the simulated latency", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Disconnect Instagram" }));
    await user.click(within(row("Instagram")).getByRole("button", { name: "Sign in" }));
    expect(within(row("Instagram")).getByRole("status")).toHaveTextContent("Signing in…");
    expect(within(row("Instagram")).queryByRole("button", { name: "Sign in" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1599);
    });
    expect(within(row("Instagram")).getByRole("status")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(within(row("Instagram")).queryByRole("status")).not.toBeInTheDocument();
    expect(within(row("Instagram")).getByText("Connected")).toBeInTheDocument();
  });

  it("connects an API-key integration once a key is saved", async () => {
    const user = setup();
    await user.click(within(row("Property portal")).getByRole("button", { name: "Add API key" }));
    const input = screen.getByLabelText("Property portal API key");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveFocus();
    await user.type(input, "sk-test-123");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.queryByLabelText("Property portal API key")).not.toBeInTheDocument();
    expect(within(row("Property portal")).getByText("Connected")).toBeInTheDocument();
  });

  it("does not connect with a blank key", async () => {
    const user = setup();
    await user.click(within(row("Property portal")).getByRole("button", { name: "Add API key" }));
    await user.type(screen.getByLabelText("Property portal API key"), "   ");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByLabelText("Property portal API key")).toBeInTheDocument();
    expect(within(row("Property portal")).queryByText("Connected")).not.toBeInTheDocument();
  });

  it("cancels key entry and discards what was typed", async () => {
    const user = setup();
    const add = () => within(row("CRM / Google Sheets")).getByRole("button", { name: "Add API key" });
    await user.click(add());
    await user.type(screen.getByLabelText("CRM / Google Sheets API key"), "secret");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByLabelText("CRM / Google Sheets API key")).not.toBeInTheDocument();
    await user.click(add());
    expect(screen.getByLabelText("CRM / Google Sheets API key")).toHaveValue("");
  });

  it("starts a fresh key field when switching to another integration", async () => {
    const user = setup();
    await user.click(within(row("Property portal")).getByRole("button", { name: "Add API key" }));
    await user.type(screen.getByLabelText("Property portal API key"), "abc");
    await user.click(within(row("CRM / Google Sheets")).getByRole("button", { name: "Add API key" }));
    expect(screen.queryByLabelText("Property portal API key")).not.toBeInTheDocument();
    expect(screen.getByLabelText("CRM / Google Sheets API key")).toHaveValue("");
  });

  it("explains the OAuth guarantee", () => {
    setup();
    expect(screen.getByText(/your GINGGA never sees your password/)).toBeInTheDocument();
  });
});
