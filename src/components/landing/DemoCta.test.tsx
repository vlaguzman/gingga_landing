import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { demoHref } from "@/lib/demo";
import { DemoCta } from "./DemoCta";

describe("DemoCta", () => {
  it("falls back to a generic label and generic link without a sector", () => {
    render(<DemoCta title="Ready?" lead="Talk to us" />);
    expect(screen.getByRole("heading", { name: "Ready?" })).toBeInTheDocument();
    expect(screen.getByText("Talk to us")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book a demo" })).toHaveAttribute("href", demoHref());
  });

  it("uses the sector label and sector-aware link", () => {
    render(<DemoCta sector="property-sales" title="t" lead="l" />);
    expect(screen.getByRole("link", { name: "Book a property sales demo" })).toHaveAttribute(
      "href",
      demoHref("property-sales"),
    );
  });

  it("lets an explicit label win over the sector label", () => {
    render(<DemoCta sector="student-recruitment" title="t" lead="l" label="Custom" />);
    expect(screen.getByRole("link", { name: "Custom" })).toBeInTheDocument();
  });

  it("keeps the decorative mark out of the accessibility tree", () => {
    const { container } = render(<DemoCta title="t" lead="l" />);
    expect(container.querySelector(".cta__mark")).toHaveAttribute("aria-hidden", "true");
  });
});
