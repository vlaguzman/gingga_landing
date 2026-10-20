import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { demoHref } from "@/lib/demo";
import { Services } from "./Services";

describe("Services", () => {
  it("renders the three tiers", () => {
    render(<Services />);
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(["Convert", "Optimise", "Scale"]);
  });

  it("builds each CTA with the tier as topic", () => {
    render(<Services />);
    for (const name of ["Convert", "Optimise", "Scale"]) {
      expect(screen.getByRole("link", { name: `Discuss ${name}` })).toHaveAttribute(
        "href",
        demoHref(undefined, name),
      );
    }
  });

  it("flags only Optimise as recommended/featured", () => {
    render(<Services />);
    expect(screen.getAllByText("Recommended")).toHaveLength(1);
    const featured = screen.getByRole("heading", { name: "Optimise" }).closest("article")!;
    expect(featured).toHaveClass("plan--featured");
    expect(within(featured).getByRole("link")).toHaveClass("btn--cyan");
    expect(screen.getByRole("heading", { name: "Convert" }).closest("article")).not.toHaveClass("plan--featured");
  });

  it("shows prices with prefix and unit, or a bare label for Scale", () => {
    render(<Services />);
    const convert = screen.getByRole("heading", { name: "Convert" }).closest("article")!;
    expect(within(convert).getByText("£470")).toBeInTheDocument();
    expect(within(convert).getByText("from")).toBeInTheDocument();
    expect(within(convert).getByText("/ month")).toBeInTheDocument();
    const scale = screen.getByRole("heading", { name: "Scale" }).closest("article")!;
    expect(within(scale).getByText("Let’s talk")).toBeInTheDocument();
    expect(within(scale).queryByText("from")).toBeNull();
    expect(within(scale).queryByText("/ month")).toBeNull();
  });

  it("lists features and keeps the #services anchor", () => {
    const { container } = render(<Services />);
    expect(container.querySelector("section#services")).not.toBeNull();
    expect(screen.getByText("Initial qualification")).toBeInTheDocument();
    expect(screen.getByText("Everything in Convert, plus:")).toBeInTheDocument();
  });
});
