import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { demoHref } from "@/lib/demo";
import { ContentExample } from "./ContentExample";
import { HomeFaq } from "./HomeFaq";
import { HomeHero } from "./HomeHero";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { Integrations } from "./Integrations";
import { Roadmap } from "./Roadmap";
import { StartingPoints } from "./StartingPoints";

describe("HomeHero", () => {
  it("has one h1 and booking plus example calls to action", () => {
    render(<HomeHero />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Book a demo" })).toHaveAttribute("href", demoHref());
    expect(screen.getByRole("link", { name: "See an example" })).toHaveAttribute("href", "#example");
  });

  it("labels the idea list as illustrative", () => {
    render(<HomeHero />);
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText(/Illustrative example/)).toBeInTheDocument();
  });
});

describe("HomeHowItWorks", () => {
  it("is the #how-it-works target with three ordered steps", () => {
    const { container } = render(<HomeHowItWorks />);
    expect(container.querySelector("section#how-it-works")).not.toBeNull();
    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps.map((s) => within(s).getByRole("heading").textContent)).toEqual([
      "Connect your sources",
      "Ideas appear",
      "Add your voice",
    ]);
    expect(steps[0].style.getPropertyValue("--bar")).toBe("#0047ff");
  });
});

describe("ContentExample", () => {
  it("is the #example target, shows the idea and the draft, and is labelled illustrative", () => {
    const { container } = render(<ContentExample />);
    expect(container.querySelector("section#example")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(/which tool to buy/);
    expect(screen.getByText(/Illustrative example/)).toBeInTheDocument();
  });
});

describe("Integrations", () => {
  it("is the #integrations target and groups the sources", () => {
    const { container } = render(<Integrations />);
    expect(container.querySelector("section#integrations")).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Meetings and conversation notes" })).toBeInTheDocument();
    for (const tool of ["Fathom", "Fireflies", "Granola", "Microsoft Teams", "Read AI", "Readwise", "Wispr Flow"]) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });
});

describe("StartingPoints", () => {
  it("lists the three starting points", () => {
    render(<StartingPoints />);
    expect(screen.getAllByRole("listitem").map((li) => within(li).getByRole("heading").textContent)).toEqual([
      "Explore an offer",
      "Show your expertise",
      "Give your business a voice",
    ]);
  });
});

describe("HomeFaq", () => {
  it("renders each question as a closed disclosure with its answer", () => {
    const { container } = render(<HomeFaq />);
    const items = container.querySelectorAll("details");
    expect(items).toHaveLength(3);
    for (const d of items) expect(d.open).toBe(false);
    expect(screen.getByText("Do I need a business already running?")).toBeInTheDocument();
  });
});

describe("Roadmap", () => {
  it("is the #vision target, states what is available today and links to the CRM solution", () => {
    const { container } = render(<Roadmap />);
    expect(container.querySelector("section#vision")).not.toBeNull();
    expect(screen.getByText("Available today")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByRole("link", { name: "See the GINGGA CRM solution" })).toHaveAttribute("href", "/crm-solution");
  });
});
