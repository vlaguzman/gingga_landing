import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PipelineLead } from "@/data/app/stages";

const { loadLeadMessages, sendLeadMessage } = vi.hoisted(() => ({ loadLeadMessages: vi.fn(), sendLeadMessage: vi.fn() }));
vi.mock("@/app/(app)/pipeline/actions", () => ({ loadLeadMessages, sendLeadMessage }));

import { LeadChat } from "./LeadChat";

const lead: PipelineLead = {
  id: "l1",
  name: "Juliana Arango",
  phone: "+57 1",
  email: null,
  stageId: "s",
  campaign: null,
  lastContact: null,
};
const renderChat = () => render(<LeadChat lead={lead} infoOpen={false} onToggleInfo={() => undefined} />);
const now = new Date().toISOString();

describe("LeadChat", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the interface with an empty state when there are no messages", async () => {
    loadLeadMessages.mockResolvedValue({ ok: true, messages: [] });
    renderChat();

    expect(screen.getByRole("region", { name: "WhatsApp chat with Juliana Arango" })).toBeInTheDocument();
    expect(screen.getByText("Loading messages…")).toBeInTheDocument();
    expect(await screen.findByText("No messages yet. Say hello below.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Message Juliana Arango" })).toBeInTheDocument();
  });

  it("renders inbound and outbound bubbles under a day label", async () => {
    loadLeadMessages.mockResolvedValue({
      ok: true,
      messages: [
        { id: "m1", direction: "inbound", text: "Is it available?", createdAt: now },
        { id: "m2", direction: "outbound", text: "Yes, come by Thursday.", createdAt: now },
      ],
    });
    renderChat();

    expect(await screen.findByText("Is it available?")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yes, come by Thursday.").closest(".wa-msg")).toHaveClass("out");
    expect(screen.getByText("Is it available?").closest(".wa-msg")).toHaveClass("in");
  });

  it("sends a message and appends it", async () => {
    loadLeadMessages.mockResolvedValue({ ok: true, messages: [] });
    sendLeadMessage.mockResolvedValue({
      ok: true,
      message: { id: "m3", direction: "outbound", text: "Hello", createdAt: now },
    });
    const user = userEvent.setup();
    renderChat();
    await screen.findByText("No messages yet. Say hello below.");

    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: "Message Juliana Arango" }), "Hello");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(sendLeadMessage).toHaveBeenCalledWith("l1", "Hello");
    expect(await screen.findByText("Hello")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Message Juliana Arango" })).toHaveValue("");
  });

  it("keeps the draft and shows the error when sending fails", async () => {
    loadLeadMessages.mockResolvedValue({ ok: true, messages: [] });
    sendLeadMessage.mockResolvedValue({ ok: false, error: "Lead not found." });
    const user = userEvent.setup();
    renderChat();
    await screen.findByText("No messages yet. Say hello below.");

    await user.type(screen.getByRole("textbox", { name: "Message Juliana Arango" }), "Hello");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Lead not found.");
    expect(screen.getByRole("textbox", { name: "Message Juliana Arango" })).toHaveValue("Hello");
  });

  it("shows the error when the conversation cannot be loaded", async () => {
    loadLeadMessages.mockResolvedValue({ ok: false, error: "Lead not found." });
    renderChat();

    expect(await screen.findByRole("alert")).toHaveTextContent("Lead not found.");
    expect(screen.getByRole("textbox", { name: "Message Juliana Arango" })).toBeInTheDocument();
  });
});
