import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { demoHref } from "@/lib/demo";
import { Hero } from "./Hero";

vi.mock("./HeroVideo", () => ({ HeroVideo: () => <div data-testid="hero-video" /> }));

describe("Hero", () => {
  it("renders the headline, a generic booking link and an in-page demo link", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("More sales. From the leads you already have.");
    expect(screen.getByRole("link", { name: "Book a demo" })).toHaveAttribute("href", demoHref());
    expect(screen.getByRole("link", { name: "See it in action" })).toHaveAttribute("href", "#demo");
    expect(screen.getByTestId("hero-video")).toBeInTheDocument();
  });
});
