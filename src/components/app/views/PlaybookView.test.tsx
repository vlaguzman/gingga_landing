import { advance, app, renderInApp, run } from "@/test/app.helper";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PLAYBOOK_CLAIMS, PLAYBOOK_GROUPS } from "@/data/app/playbook";
import { PlaybookView } from "./PlaybookView";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const setup = () => {
  const user = userEvent.setup({ delay: null });
  renderInApp(<PlaybookView />, { path: "/playbook" });
  return user;
};
const group = (g: string) => screen.getByRole("heading", { name: g }).closest("section") as HTMLElement;

describe("PlaybookView", () => {
  it("shows each claim under its group", () => {
    setup();
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      ...PLAYBOOK_GROUPS,
      "Uploaded sources",
    ]);
    for (const g of PLAYBOOK_GROUPS) {
      for (const c of PLAYBOOK_CLAIMS.filter((x) => x.group === g)) {
        expect(within(group(g)).getByText(c.claim)).toBeInTheDocument();
      }
    }
    expect(screen.getByText("412 WhatsApp conversations")).toBeInTheDocument();
  });

  it("reveals and hides the evidence behind a claim", async () => {
    const user = setup();
    const claim = PLAYBOOK_CLAIMS[0];
    const [why] = within(group("Who we target")).getAllByRole("button", { name: "Why we think this" });
    expect(why).toHaveAttribute("aria-expanded", "false");
    await user.click(why);
    expect(screen.getByText(claim.because)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hide" }));
    expect(screen.queryByText(claim.because)).not.toBeInTheDocument();
  });

  it("keeps a single explanation open at a time", async () => {
    const user = setup();
    const [first, second] = screen.getAllByRole("button", { name: "Why we think this" });
    await user.click(first);
    await user.click(second);
    expect(screen.getByText(PLAYBOOK_CLAIMS[1].because)).toBeInTheDocument();
    expect(screen.queryByText(PLAYBOOK_CLAIMS[0].because)).not.toBeInTheDocument();
  });

  it("starts a correction chat, shows saving, then the corrected claim without its evidence button", async () => {
    const user = setup();
    const whyBefore = screen.getAllByRole("button", { name: "Why we think this" }).length;
    await user.click(within(group("Who we target")).getAllByRole("button", { name: "Correct this in chat" })[0]);
    expect(app().msgs[0]).toMatchObject({ role: "title", text: "Playbook correction" });

    run(() => app().send("Prefer pre-approved buyers."));
    advance(500);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
    expect(screen.queryByText(PLAYBOOK_CLAIMS[0].claim)).not.toBeInTheDocument();
    advance(1600);

    expect(screen.queryByRole("status", { name: "Saving" })).not.toBeInTheDocument();
    expect(screen.getByText("Prefer pre-approved buyers.")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Why we think this" })).toHaveLength(whyBefore - 1);
  });

  it("starts an add-to-playbook chat for a group and shows the new claim", async () => {
    const user = setup();
    await user.click(within(group("Process")).getByRole("button", { name: /Something your GINGGA should know/ }));
    expect(app().msgs[1]).toMatchObject({ text: "I want to add something to the playbook — process." });

    run(() => app().send("Confirm every visit by WhatsApp."));
    advance(2100);
    expect(within(group("Process")).getByText("Confirm every visit by WhatsApp.")).toBeInTheDocument();
    expect(within(group("Process")).getAllByRole("button", { name: "Correct this in chat" })).toHaveLength(3);
  });
});

describe("PlaybookView sources", () => {
  it("renders the uploaded sources block with the sources it receives", () => {
    renderInApp(
      <PlaybookView sources={[{ id: "s1", filename: "faq.md", sizeBytes: 10, status: "ready", errorMessage: null }]} />,
      { path: "/playbook" },
    );
    expect(screen.getByRole("heading", { name: "Uploaded sources" })).toBeInTheDocument();
    expect(screen.getByText("faq.md")).toBeInTheDocument();
  });

  it("shows the empty sources state by default", () => {
    setup();
    expect(screen.getByText(/No documents yet/)).toBeInTheDocument();
  });
});
