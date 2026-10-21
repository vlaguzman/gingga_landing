import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("shows branding and a tel link for the contact", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByAltText("GINGGA")).toBeInTheDocument();
    expect(screen.getByText("Mastil")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+44 7551 273933" })).toHaveAttribute("href", "tel:+447551273933");
  });
});
