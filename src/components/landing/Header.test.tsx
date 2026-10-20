import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoHref } from "@/lib/demo";
import { Header } from "./Header";

const usePathname = vi.fn();
vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));

beforeEach(() => usePathname.mockReturnValue("/"));

const toggle = () => screen.getByRole("button", { name: /Use cases/ });
const menu = () => document.getElementById("use-cases-menu")!;

describe("Header", () => {
  it("links home and to the home sections", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "GINGGA home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "How it works" })).toHaveAttribute("href", "/#how-it-works");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/#services");
  });

  it("uses the generic booking link on the home page", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Book a demo" })).toHaveAttribute("href", demoHref());
  });

  it("uses the sector booking link and marks the current page on a sector route", () => {
    usePathname.mockReturnValue("/property-sales");
    render(<Header />);
    expect(screen.getByRole("link", { name: "Book a demo" })).toHaveAttribute("href", demoHref("property-sales"));
    fireEvent.click(toggle());
    expect(screen.getByRole("link", { name: "Property sales" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Student recruitment" })).not.toHaveAttribute("aria-current");
  });

  it("toggles the use-cases menu", () => {
    render(<Header />);
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(menu()).toHaveAttribute("hidden");
    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(menu()).not.toHaveAttribute("hidden");
    expect(screen.getByRole("link", { name: "Student recruitment" })).toHaveAttribute("href", "/student-recruitment");
    fireEvent.click(toggle());
    expect(menu()).toHaveAttribute("hidden");
  });

  it("closes on Escape and returns focus to the toggle", () => {
    render(<Header />);
    fireEvent.click(toggle());
    fireEvent.keyDown(screen.getByRole("link", { name: "Property sales" }), { key: "Escape" });
    expect(menu()).toHaveAttribute("hidden");
    expect(toggle()).toHaveFocus();
  });

  it("ignores Escape while closed and other keys while open", () => {
    render(<Header />);
    fireEvent.keyDown(toggle(), { key: "Escape" });
    expect(menu()).toHaveAttribute("hidden");
    fireEvent.click(toggle());
    fireEvent.keyDown(toggle(), { key: "a" });
    expect(menu()).not.toHaveAttribute("hidden");
  });

  it("closes when a menu link is chosen", () => {
    render(<Header />);
    fireEvent.click(toggle());
    const link = screen.getByRole("link", { name: "Property sales" });
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);
    expect(menu()).toHaveAttribute("hidden");
  });

  it("closes on a pointer press outside but not inside", () => {
    render(<Header />);
    fireEvent.click(toggle());
    fireEvent.pointerDown(toggle());
    expect(menu()).not.toHaveAttribute("hidden");
    fireEvent.pointerDown(document.body);
    expect(menu()).toHaveAttribute("hidden");
  });

  it("closes when focus leaves the menu, but not when it moves within", () => {
    render(<Header />);
    fireEvent.click(toggle());
    const link = screen.getByRole("link", { name: "Student recruitment" });
    fireEvent.blur(toggle(), { relatedTarget: link });
    expect(menu()).not.toHaveAttribute("hidden");
    fireEvent.blur(link, { relatedTarget: null });
    expect(menu()).toHaveAttribute("hidden");
  });
});
