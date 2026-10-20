import { app, renderInApp } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CHATS } from "@/data/app/chats";
import { ChatsView } from "./ChatsView";

describe("ChatsView", () => {
  it("lists every conversation under its time group", () => {
    renderInApp(<ChatsView />, { path: "/chats" });
    expect(screen.getByRole("heading", { level: 1, name: "Chats" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Today",
      "This week",
      "Previous weeks",
    ]);
    expect(screen.getAllByRole("button")).toHaveLength(CHATS.length);

    const today = screen.getByRole("heading", { name: "Today" }).closest("section")!;
    expect(within(today).getByText("Overnight lead capture")).toBeInTheDocument();
    expect(within(today).getByText("9 new leads — 3 are worth a first message today.")).toBeInTheDocument();
    expect(within(today).getByText("First message to Valentina")).toBeInTheDocument();
  });

  it("opens a conversation in the chat panel", async () => {
    const user = userEvent.setup();
    renderInApp(<ChatsView />, { path: "/chats" });
    await user.click(screen.getByRole("button", { name: /Connecting WhatsApp and Meta/ }));
    expect(app().msgs[0]).toEqual({ role: "title", text: "Connecting WhatsApp and Meta", when: "Aug 3 · Previous weeks" });
    expect(app().msgs).toHaveLength(1 + CHATS[3].msgs.length);
  });
});
