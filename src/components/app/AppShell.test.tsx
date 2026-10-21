import { app, Probe, setPath, USER } from "@/test/app.helper";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";
import { act } from "react";

const setup = (path = "/today-dashboard") => {
  setPath(path);
  const user = userEvent.setup();
  const utils = render(
    <AppShell user={USER}>
      <Probe />
      <p>page content</p>
    </AppShell>,
  );
  return { user, ...utils };
};

const breadcrumb = () => screen.getByRole("navigation", { name: "Breadcrumb" });

describe("AppShell navigation", () => {
  it("renders the page inside the workspace with the signed-in user", () => {
    setup();
    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });

  it("lists every section and marks the current one", () => {
    setup("/pipeline");
    const nav = screen.getByRole("navigation", { name: "Workspace" });
    const names = within(nav).getAllByRole("link").map((l) => l.textContent);
    expect(names).toEqual(["Today", "Chats", "Leads", "Outreach", "Pipeline", "Playbook", "Integrations"]);
    expect(within(nav).getByRole("link", { name: "Pipeline" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Today" })).not.toHaveAttribute("aria-current");
    expect(within(nav).getByRole("link", { name: "Leads" })).toHaveAttribute("href", "/leads");
  });

  it("clears open records when a nav item is picked", async () => {
    const { user } = setup("/leads");
    act(() => app().setLeadSel("l1"));
    expect(app().leadSel).toBe("l1");
    await user.click(within(screen.getByRole("navigation", { name: "Workspace" })).getByRole("link", { name: "Outreach" }));
    expect(app().leadSel).toBeNull();
  });

  it("links the logo back to the dashboard", () => {
    setup();
    expect(screen.getByRole("link", { name: "GINGGA workspace home" })).toHaveAttribute("href", "/today-dashboard");
  });

  it("collapses and expands the sidebar", async () => {
    const { user } = setup();
    const toggle = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "GINGGA workspace home" })).not.toBeInTheDocument();
    // Labels move to tooltips while collapsed.
    expect(screen.getByRole("link", { name: "Leads" })).toHaveAttribute("title", "Leads");
    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(screen.getByRole("link", { name: "GINGGA workspace home" })).toBeInTheDocument();
  });
});

describe("AppShell breadcrumb", () => {
  it("shows the section label for a list page", () => {
    setup("/leads");
    expect(within(breadcrumb()).getByText("Leads")).toHaveAttribute("aria-current", "page");
    expect(within(breadcrumb()).queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Leads" })).toBeInTheDocument();
  });

  it.each([
    ["/leads", "setLeadSel", "l1", "Leads", /Valentina Ospina — asked about 2-bedroom/, "leadSel"],
    ["/pipeline", "setDealSel", "d1", "Pipeline", "Juliana Arango", "dealSel"],
    ["/outreach", "setOutSel", "o1", "Outreach", "Valentina Ospina — first touch", "outSel"],
  ] as const)("adds the open record to the %s breadcrumb and goes back to the list", async (path, setter, id, parent, title, key) => {
    const { user } = setup(path);
    act(() => app()[setter](id));
    const crumb = breadcrumb();
    expect(within(crumb).getByText(title)).toHaveAttribute("aria-current", "page");
    await user.click(within(crumb).getByRole("button", { name: parent }));
    expect(app()[key]).toBeNull();
    expect(within(breadcrumb()).queryByRole("button")).not.toBeInTheDocument();
  });

  it("falls back to the section label when the open record is unknown", () => {
    setup("/pipeline");
    act(() => app().setDealSel("ghost"));
    expect(within(breadcrumb()).getByText("Pipeline", { selector: ".ws-crumb-here" })).toBeInTheDocument();
  });

  it("returns to the dashboard from the Workspace crumb", async () => {
    const { user } = setup("/leads");
    act(() => app().setLeadSel("l1"));
    await user.click(within(breadcrumb()).getByRole("link", { name: "Workspace" }));
    expect(app().leadSel).toBeNull();
  });
});

describe("AppShell user menu", () => {
  it("opens with Settings and Sign out, and closes from Settings", async () => {
    const { user } = setup();
    const trigger = screen.getByRole("button", { name: /Ada Lovelace/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Sign out" })).toHaveAttribute("type", "submit");
    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.queryByRole("button", { name: "Settings" })).not.toBeInTheDocument();
  });

  it("closes on an outside click but not on a click inside", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    fireEvent.mouseDown((document.querySelector(".col-resizer") as HTMLElement));
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    fireEvent.mouseDown(screen.getByRole("button", { name: "Sign out" }));
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });
});

describe("AppShell mobile and chat controls", () => {
  it("opens the mobile menu and closes it from the scrim", async () => {
    const { user, container } = setup();
    expect(container.querySelector(".sb-scrim")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(container.querySelector("aside.sb")).toHaveClass("mob-open");
    await user.click(container.querySelector(".sb-scrim") as HTMLElement);
    expect(container.querySelector("aside.sb")).not.toHaveClass("mob-open");
  });

  it("closes the mobile menu after choosing a section", async () => {
    const { user, container } = setup();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(within(screen.getByRole("navigation", { name: "Workspace" })).getByRole("link", { name: "Leads" }));
    expect(container.querySelector("aside.sb")).not.toHaveClass("mob-open");
  });

  it("toggles the chat on mobile and closes it from the scrim and the panel", async () => {
    const { user, container } = setup();
    const toggle = screen.getByRole("button", { name: "Open chat" });
    await user.click(toggle);
    expect(container.querySelector(".shell")).toHaveClass("chat-open");
    expect(screen.getAllByRole("button", { name: "Close chat" }).length).toBeGreaterThan(0);
    await user.click(container.querySelector(".chat-scrim") as HTMLElement);
    expect(container.querySelector(".shell")).not.toHaveClass("chat-open");

    await user.click(screen.getByRole("button", { name: "Open chat" }));
    await user.click(within(screen.getByRole("region", { name: "Chat with GINGGA" })).getByRole("button", { name: "Close chat" }));
    expect(container.querySelector(".shell")).not.toHaveClass("chat-open");
  });

  it("collapses the chat panel and brings it back", async () => {
    const { user, container } = setup();
    expect(screen.queryByRole("button", { name: "Expand chat" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Collapse chat" }));
    expect(container.querySelector(".work-row")).toHaveClass("chat-hidden");
    await user.click(screen.getByRole("button", { name: "Expand chat" }));
    expect(container.querySelector(".work-row")).not.toHaveClass("chat-hidden");
  });
});

describe("AppShell chat resizer", () => {
  const rowWith = (container: HTMLElement, rect: Partial<DOMRect> | null) => {
    const row = container.querySelector(".work-row") as HTMLElement;
    row.getBoundingClientRect = () => rect as DOMRect;
    return row;
  };
  const chatWidth = () => (screen.getByRole("region", { name: "Chat with GINGGA" }) as HTMLElement).style.width;

  it("resizes the chat while dragging, within limits, and stops on mouse up", () => {
    const { container } = setup();
    rowWith(container, { left: 100, width: 1000 });
    expect(chatWidth()).toBe("42%");

    fireEvent.mouseDown((document.querySelector(".col-resizer") as HTMLElement));
    expect(document.body.style.cursor).toBe("col-resize");

    fireEvent.mouseMove(window, { clientX: 600 });
    expect(chatWidth()).toBe("50%");
    fireEvent.mouseMove(window, { clientX: 0 });
    expect(chatWidth()).toBe("24%");
    fireEvent.mouseMove(window, { clientX: 5000 });
    expect(chatWidth()).toBe("70%");

    fireEvent.mouseUp(window);
    expect(document.body.style.cursor).toBe("");
    fireEvent.mouseMove(window, { clientX: 600 });
    expect(chatWidth()).toBe("70%");
  });

  it("does not start dragging without a measurable row", () => {
    setup();
    // The handler reads the separator's parent; an element without a parent rect cannot be dragged.
    const sep = (document.querySelector(".col-resizer") as HTMLElement);
    Object.defineProperty(sep, "parentElement", { value: null });
    fireEvent.mouseDown(sep);
    expect(document.body.style.cursor).toBe("");
  });
});
