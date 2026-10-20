import { advance, app, renderInApp, run } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHATS } from "@/data/app/chats";
import { ChatPanel } from "./ChatPanel";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const setup = (path = "/today-dashboard", props: Partial<{ onClose: () => void; onCollapse: () => void }> = {}) => {
  const user = userEvent.setup({ delay: null });
  renderInApp(<ChatPanel width={40} onClose={props.onClose ?? vi.fn()} onCollapse={props.onCollapse ?? vi.fn()} />, {
    path,
  });
  return user;
};

describe("ChatPanel", () => {
  it("shows the empty state and the pills for the current section", () => {
    setup();
    expect(screen.getByText("Your GINGGA is on the case.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "What should I do first?" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Chat with GINGGA" })).toHaveStyle({ width: "40%" });
  });

  it("disables Send until there is text", async () => {
    const user = setup();
    const send = screen.getByRole("button", { name: "Send" });
    expect(send).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: "Message GINGGA" }), "hi");
    expect(send).toBeEnabled();
  });

  it("sends with the Send button, clears the input and shows the working indicator until the reply", async () => {
    const user = setup();
    const input = screen.getByRole("textbox", { name: "Message GINGGA" });
    await user.type(input, "Plan my day");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(input).toHaveValue("");
    expect(screen.getByText("Plan my day")).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "GINGGA is working" })).toBeInTheDocument();
    expect(screen.queryByText("Your GINGGA is on the case.")).not.toBeInTheDocument();

    advance(650);
    expect(screen.queryByRole("status", { name: "GINGGA is working" })).not.toBeInTheDocument();
    expect(screen.getByText(/Got it\. I will factor that/)).toBeInTheDocument();
  });

  it("sends on Enter but keeps Shift+Enter for a new line", async () => {
    const user = setup();
    const input = screen.getByRole("textbox", { name: "Message GINGGA" });
    await user.type(input, "line one{Shift>}{Enter}{/Shift}line two");
    expect(input).toHaveValue("line one\nline two");
    expect(app().msgs).toHaveLength(0);
    await user.keyboard("{Enter}");
    expect(app().msgs[0]).toEqual({ role: "user", text: "line one\nline two" });
    expect(input).toHaveValue("");
  });

  it("ignores Enter on an empty message", async () => {
    const user = setup();
    await user.type(screen.getByRole("textbox", { name: "Message GINGGA" }), "{Enter}");
    expect(app().msgs).toHaveLength(0);
  });

  it("sends a suggested pill as a message", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Plan my follow-up day" }));
    expect(screen.getByText("Plan my follow-up day", { selector: "p" })).toBeInTheDocument();
  });

  it("grows the input up to a maximum and flags when it scrolls", async () => {
    const spy = vi.spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get").mockReturnValue(300);
    const user = setup();
    const input = screen.getByRole("textbox", { name: "Message GINGGA" });
    await user.type(input, "a");
    expect(input).toHaveStyle({ height: "160px" });
    expect(input).toHaveClass("scrolls");
    spy.mockReturnValue(50);
    await user.type(input, "b");
    expect(input).toHaveStyle({ height: "50px" });
    expect(input).not.toHaveClass("scrolls");
    spy.mockRestore();
  });

  it("calls onClose and onCollapse from the header buttons", async () => {
    const onClose = vi.fn();
    const onCollapse = vi.fn();
    const user = setup("/today-dashboard", { onClose, onCollapse });
    await user.click(screen.getByRole("button", { name: "Close chat" }));
    await user.click(screen.getByRole("button", { name: "Collapse chat" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });

  it("renders a titled thread with tool steps that can be expanded", async () => {
    const user = setup("/chats");
    run(() => app().openThread(CHATS[0]));

    expect(screen.getByText("Overnight lead capture")).toBeInTheDocument();
    expect(screen.getByText("6:00 AM")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Done")).toHaveLength(2);
    expect(screen.getByText("capture_leads")).toBeInTheDocument();
    // A finished thread does not show the working indicator.
    expect(screen.queryByRole("status", { name: "GINGGA is working" })).not.toBeInTheDocument();

    const [more] = screen.getAllByRole("button", { name: "show more" });
    expect(more).toHaveAttribute("aria-expanded", "false");
    await user.click(more);
    expect(screen.getByText(/found: 9 new contacts/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "hide" }));
    expect(screen.queryByText(/found: 9 new contacts/)).not.toBeInTheDocument();
  });

  it("shows a spinner while a tool step is running and keeps the typing indicator", () => {
    setup("/leads");
    run(() => app().discardLead("l1"));
    expect(screen.getByRole("status", { name: "Running" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "GINGGA is working" })).toBeInTheDocument();
    advance(900);
    expect(screen.queryByRole("status", { name: "Running" })).not.toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "Chat with GINGGA" })).getByLabelText("Done")).toBeInTheDocument();
  });

  it("scrolls the thread to the bottom when messages arrive", async () => {
    const user = setup();
    const scroller = document.querySelector(".th-scroll") as HTMLElement;
    vi.spyOn(scroller, "scrollHeight", "get").mockReturnValue(999);
    await user.type(screen.getByRole("textbox", { name: "Message GINGGA" }), "hi{Enter}");
    expect(scroller.scrollTop).toBe(999);
  });
});
