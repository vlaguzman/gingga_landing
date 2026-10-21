import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ManagedService } from "./ManagedService";

describe("ManagedService", () => {
  it("is the #how-it-works anchor target with three ordered steps", () => {
    const { container } = render(<ManagedService />);
    expect(container.querySelector("section#how-it-works")).not.toBeNull();
    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps.map((s) => within(s).getByRole("heading").textContent)).toEqual(["Map", "Launch", "Improve"]);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("exposes each step colour as a CSS custom property", () => {
    render(<ManagedService />);
    const first = screen.getAllByRole("listitem")[0];
    expect(first.style.getPropertyValue("--bar")).toBe("#0047ff");
  });
});
