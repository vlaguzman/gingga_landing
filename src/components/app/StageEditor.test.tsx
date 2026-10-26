import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PipelineStage } from "@/data/app/stages";

const { renameStage } = vi.hoisted(() => ({ renameStage: vi.fn() }));
vi.mock("@/app/(app)/pipeline/actions", () => ({ renameStage }));

import { StageEditor } from "./StageEditor";

const stages: PipelineStage[] = [
  { id: "a", name: "New Lead", hint: "", kind: "open", position: 0 },
  { id: "b", name: "Won", hint: "", kind: "won", position: 1 },
];

describe("StageEditor", () => {
  beforeEach(() => vi.clearAllMocks());

  it("saves the new name when the field loses focus", async () => {
    renameStage.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<StageEditor stages={stages} />);

    const input = screen.getByRole("textbox", { name: "Name for New Lead" });
    await user.clear(input);
    await user.type(input, "Inbox{Enter}");

    expect(renameStage).toHaveBeenCalledWith("a", "Inbox");
  });

  it("does not call the server when nothing changed", async () => {
    const user = userEvent.setup();
    render(<StageEditor stages={stages} />);

    await user.click(screen.getByRole("textbox", { name: "Name for Won" }));
    await user.tab();

    expect(renameStage).not.toHaveBeenCalled();
  });

  it("shows the server error", async () => {
    renameStage.mockResolvedValue({ ok: false, error: "Another stage already has that name." });
    const user = userEvent.setup();
    render(<StageEditor stages={stages} />);

    const input = screen.getByRole("textbox", { name: "Name for Won" });
    await user.clear(input);
    await user.type(input, "New Lead{Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Another stage already has that name.");
  });
});
