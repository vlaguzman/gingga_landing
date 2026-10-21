import { advance, app, renderInApp } from "@/test/app.helper";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEALS } from "@/data/app/deals";
import { DealChat, initialsOf } from "./DealChat";
import { useApp } from "./AppProvider";

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** Reads the live deal from the provider, like the pipeline view does. */
function Live({ id, onToggleInfo = () => undefined, infoOpen = false }: { id: string; onToggleInfo?: () => void; infoOpen?: boolean }) {
  const { deals } = useApp();
  return <DealChat deal={deals.find((d) => d.id === id)!} infoOpen={infoOpen} onToggleInfo={onToggleInfo} />;
}

describe("initialsOf", () => {
  it.each([
    ["Juliana Arango", "JA"],
    ["  ada  king lovelace ", "AK"],
    ["madonna", "M"],
  ])("%j -> %s", (name, initials) => {
    expect(initialsOf(name)).toBe(initials);
  });
});

describe("DealChat", () => {
  it("shows the contact, presence and the conversation with day separators", () => {
    renderInApp(<Live id="d4" />);
    expect(screen.getByRole("region", { name: "WhatsApp chat with Carolina Vélez" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Carolina Vélez" })).toBeInTheDocument();
    expect(screen.getByText("online")).toBeInTheDocument();
    const log = screen.getByRole("log", { name: "Messages" });
    expect(log).toHaveTextContent("Aug 14");
    expect(log).toHaveTextContent("Yesterday");
    expect(screen.getByText(/Parking is available for the 2-bedroom units/)).toBeInTheDocument();
  });

  it.each([
    ["d1", "Today"],
    ["d3", "Yesterday"],
  ])("labels the day of deal %s as %s", (id, label) => {
    renderInApp(<Live id={id} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("marks only outgoing messages as read", () => {
    renderInApp(<Live id="d4" />);
    const outgoing = DEALS.find((d) => d.id === "d4")!.thread.filter((m) => m.dir === "out").length;
    expect(screen.getAllByRole("img", { name: "Read" })).toHaveLength(outgoing);
    expect(screen.getByText("9:02 AM")).toBeInTheDocument();
  });

  it("invites the first message when the thread is empty", () => {
    const empty = { ...DEALS[0], thread: [] };
    renderInApp(<DealChat deal={empty} infoOpen={false} onToggleInfo={() => undefined} />);
    expect(screen.getByText("No messages yet. Say hello below.")).toBeInTheDocument();
  });

  it("disables Send for blank text and ignores a blank submit", async () => {
    const user = userEvent.setup({ delay: null });
    renderInApp(<Live id="d2" />);
    const send = screen.getByRole("button", { name: "Send message" });
    expect(send).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: "Message Mauricio Salcedo" }), "   {Enter}");
    expect(app().deals.find((d) => d.id === "d2")!.thread).toHaveLength(2);
    expect(send).toBeDisabled();
  });

  it("sends a message, shows typing and then the contact's reply", async () => {
    const user = userEvent.setup({ delay: null });
    renderInApp(<Live id="d2" />);
    const input = screen.getByRole("textbox", { name: "Message Mauricio Salcedo" });
    await user.type(input, "How about Thursday?");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(input).toHaveValue("");
    expect(screen.getByText("How about Thursday?")).toBeInTheDocument();
    expect(screen.getByText("last seen today at 8:02 AM")).toBeInTheDocument();

    advance(1200);
    expect(screen.getByText("typing…")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Mauricio Salcedo is typing" })).toBeInTheDocument();

    advance(1800);
    expect(screen.queryByText("typing…")).not.toBeInTheDocument();
    expect(screen.queryByRole("status", { name: "Mauricio Salcedo is typing" })).not.toBeInTheDocument();
    expect(screen.getByText("Hi Sara, sorry, busy week! Yes, send them please.")).toBeInTheDocument();
    expect(screen.getByText("last seen today at 8:02 AM")).toBeInTheDocument();
  });

  it("toggles the contact info through the header button", async () => {
    const user = userEvent.setup({ delay: null });
    const onToggle = vi.fn();
    renderInApp(<Live id="d1" onToggleInfo={onToggle} infoOpen />);
    const button = screen.getByRole("button", { name: "Contact info" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "contact-panel");
    await user.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("scrolls the conversation to the newest message", async () => {
    const user = userEvent.setup({ delay: null });
    renderInApp(<Live id="d1" />);
    const log = screen.getByRole("log", { name: "Messages" });
    vi.spyOn(log, "scrollHeight", "get").mockReturnValue(777);
    await user.type(screen.getByRole("textbox", { name: "Message Juliana Arango" }), "hi{Enter}");
    expect(log.scrollTop).toBe(777);
  });
});
