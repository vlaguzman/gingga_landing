import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoHref } from "@/lib/demo";
import { Header } from "./Header";

const usePathname = vi.fn();
vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));

beforeEach(() => usePathname.mockReturnValue("/crm-solution"));

const toggle = () => screen.getByRole("button", { name: /Use cases/ });
const menu = () => document.getElementById("use-cases-menu")!;

describe("Header", () => {
  it("links home and to the CRM solution sections", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "GINGGA home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "How it works" })).toHaveAttribute("href", "/crm-solution#how-it-works");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/crm-solution#services");
  });

  it("shows the home navigation, without the use-cases menu, on the home page", () => {
    usePathname.mockReturnValue("/");
    render(<Header />);
    expect(screen.getByRole("link", { name: "How it works" })).toHaveAttribute("href", "/#how-it-works");
    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute("href", "/#example");
    expect(screen.getByRole("link", { name: "Integrations" })).toHaveAttribute("href", "/#integrations");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/#pricing");
    expect(screen.getByRole("link", { name: "Vision" })).toHaveAttribute("href", "/#vision");
    expect(screen.getByRole("link", { name: "For sales teams" })).toHaveAttribute("href", "/crm-solution");
    expect(screen.queryByRole("button", { name: /Use cases/ })).toBeNull();
  });

  it("shows the Spanish navigation, links and language switch on /es", () => {
    usePathname.mockReturnValue("/es");
    render(<Header />);
    expect(screen.getByRole("link", { name: "GINGGA home" })).toHaveAttribute("href", "/es");
    expect(screen.getByRole("link", { name: "Cómo funciona" })).toHaveAttribute("href", "/es#how-it-works");
    expect(screen.getByRole("link", { name: "View this page in English" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Reservar una demo" })).toHaveAttribute(
      "href",
      demoHref(undefined, undefined, "es"),
    );
  });

  it("offers a switch to Spanish on the English home and none on CRM pages", () => {
    usePathname.mockReturnValue("/");
    const { unmount } = render(<Header />);
    expect(screen.getByRole("link", { name: "Ver esta página en español" })).toHaveAttribute("href", "/es");
    unmount();
    usePathname.mockReturnValue("/crm-solution");
    render(<Header />);
    expect(screen.queryByRole("link", { name: "Ver esta página en español" })).toBeNull();
  });

  it("uses the generic booking link outside a sector", () => {
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
