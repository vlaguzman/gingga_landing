import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeCopy, type Lang } from "@/data/home-copy";
import { demoHref } from "@/lib/demo";
import { ContentExample } from "./ContentExample";
import { HomeContent } from "./HomeContent";
import { HomeFaq } from "./HomeFaq";
import { HomeHero } from "./HomeHero";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { Integrations } from "./Integrations";
import { Roadmap } from "./Roadmap";
import { StartingPoints } from "./StartingPoints";

const LANGS: Lang[] = ["en", "es"];

describe("homeCopy", () => {
  it("has the same shape in both languages", () => {
    const en = homeCopy.en;
    const es = homeCopy.es;
    expect(es.how.steps).toHaveLength(en.how.steps.length);
    expect(es.hero.ideas).toHaveLength(en.hero.ideas.length);
    expect(es.points.items).toHaveLength(en.points.items.length);
    expect(es.faq.items).toHaveLength(en.faq.items.length);
    expect(es.vision.today).toHaveLength(en.vision.today.length);
    expect(es.vision.next).toHaveLength(en.vision.next.length);
    expect(es.integrations.groups.map((g) => g.tools)).toEqual(en.integrations.groups.map((g) => g.tools));
  });
});

describe.each(LANGS)("home sections (%s)", (lang) => {
  const c = homeCopy[lang];

  it("hero has one h1 and booking plus example calls to action", () => {
    render(<HomeHero lang={lang} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: c.hero.cta })).toHaveAttribute(
      "href",
      demoHref(undefined, undefined, lang),
    );
    expect(screen.getByRole("link", { name: c.hero.secondary })).toHaveAttribute("href", "#example");
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText(c.hero.note)).toBeInTheDocument();
  });

  it("how it works is the #how-it-works target with three ordered steps", () => {
    const { container } = render(<HomeHowItWorks lang={lang} />);
    expect(container.querySelector("section#how-it-works")).not.toBeNull();
    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps.map((s) => within(s).getByRole("heading").textContent)).toEqual(c.how.steps.map((s) => s.title));
    expect(screen.getByText(`${c.how.stepLabel} 1`)).toBeInTheDocument();
    expect(steps[0].style.getPropertyValue("--bar")).toBe("#0047ff");
  });

  it("example is the #example target and is labelled illustrative", () => {
    const { container } = render(<ContentExample lang={lang} />);
    expect(container.querySelector("section#example")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(c.example.draftTitle);
    expect(screen.getByText(c.example.note)).toBeInTheDocument();
  });

  it("integrations is the #integrations target and lists every source", () => {
    const { container } = render(<Integrations lang={lang} />);
    expect(container.querySelector("section#integrations")).not.toBeNull();
    for (const tool of c.integrations.groups.flatMap((g) => g.tools)) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });

  it("starting points lists three cards", () => {
    render(<StartingPoints lang={lang} />);
    expect(screen.getAllByRole("listitem").map((li) => within(li).getByRole("heading").textContent)).toEqual(
      c.points.items.map((p) => p.title),
    );
  });

  it("faq renders closed disclosures", () => {
    const { container } = render(<HomeFaq lang={lang} />);
    const items = container.querySelectorAll("details");
    expect(items).toHaveLength(3);
    for (const d of items) expect(d.open).toBe(false);
    expect(screen.getByText(c.faq.items[0].q)).toBeInTheDocument();
  });

  it("roadmap is the #vision target and links to the CRM solution", () => {
    const { container } = render(<Roadmap lang={lang} />);
    expect(container.querySelector("section#vision")).not.toBeNull();
    expect(screen.getByText(c.vision.todayLabel)).toBeInTheDocument();
    expect(screen.getByText(c.vision.nextLabel)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(c.vision.today.length + c.vision.next.length);
    expect(screen.getByRole("link", { name: c.vision.crmLink })).toHaveAttribute("href", "/crm-solution");
  });
});

describe("HomeContent", () => {
  it("marks the Spanish page with lang=es and leaves English to the document language", () => {
    const es = render(<HomeContent lang="es" />);
    expect(es.container.firstElementChild).toHaveAttribute("lang", "es");
    es.unmount();
    const en = render(<HomeContent lang="en" />);
    expect(en.container.firstElementChild).not.toHaveAttribute("lang");
  });

  it("books a demo in the page language from the final call to action", () => {
    render(<HomeContent lang="es" />);
    const links = screen.getAllByRole("link", { name: homeCopy.es.cta.label });
    for (const l of links) expect(l).toHaveAttribute("href", demoHref(undefined, undefined, "es"));
  });
});
