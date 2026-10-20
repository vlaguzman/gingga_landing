import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SectorId } from "@/lib/demo";
import type { ResolvedVideo } from "@/lib/video-assets";
import { DemoSelector } from "./DemoSelector";

function video(id: SectorId, extra: Partial<ResolvedVideo> = {}): ResolvedVideo {
  return {
    id,
    src: `/assets/${id}.mp4`,
    vttLang: "en",
    width: 1280,
    height: 720,
    title: `${id} title`,
    label: `${id} label`,
    caption: `${id} caption`,
    linkLabel: `${id} link`,
    available: true,
    ...extra,
  };
}

const videos = {
  "student-recruitment": video("student-recruitment"),
  "property-sales": video("property-sales", { available: false }),
};

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

const tabs = () => screen.getAllByRole("tab");

describe("DemoSelector", () => {
  it("shows the first workflow selected by default", () => {
    render(<DemoSelector videos={videos} />);
    expect(screen.getByRole("tablist", { name: "Choose a workflow demo" })).toBeInTheDocument();
    expect(tabs().map((t) => t.textContent)).toEqual(["Student recruitment", "Property sales"]);
    expect(tabs()[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs()[0]).toHaveAttribute("tabindex", "0");
    expect(tabs()[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs()[1]).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("student-recruitment caption")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /student-recruitment link/ })).toHaveAttribute("href", "/student-recruitment");
    // inactive panel is hidden and renders no content
    expect(screen.queryByText("property-sales caption")).toBeNull();
  });

  it("wires each tab to its panel via aria attributes", () => {
    render(<DemoSelector videos={videos} />);
    const tab = tabs()[0];
    const panel = document.getElementById(tab.getAttribute("aria-controls")!)!;
    expect(panel).toHaveAttribute("role", "tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    expect(document.getElementById("demo-panel-property-sales")).toHaveAttribute("hidden");
  });

  it("switches panel on click", () => {
    render(<DemoSelector videos={videos} />);
    fireEvent.click(tabs()[1]);
    expect(tabs()[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("property-sales caption")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /property-sales link/ })).toHaveAttribute("href", "/property-sales");
    expect(screen.queryByText("student-recruitment caption")).toBeNull();
    // unavailable video falls back to the placeholder
    expect(screen.getByText(/Demo video unavailable/)).toBeInTheDocument();
  });

  it("moves selection and focus with the arrow keys, wrapping around", () => {
    render(<DemoSelector videos={videos} />);
    fireEvent.keyDown(tabs()[0], { key: "ArrowRight" });
    expect(tabs()[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs()[1]).toHaveFocus();
    fireEvent.keyDown(tabs()[1], { key: "ArrowRight" });
    expect(tabs()[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs()[0]).toHaveFocus();
    fireEvent.keyDown(tabs()[0], { key: "ArrowLeft" });
    expect(tabs()[1]).toHaveAttribute("aria-selected", "true");
  });

  it("supports Home and End", () => {
    render(<DemoSelector videos={videos} />);
    fireEvent.keyDown(tabs()[0], { key: "End" });
    expect(tabs()[1]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs()[1], { key: "Home" });
    expect(tabs()[0]).toHaveAttribute("aria-selected", "true");
  });

  it("does not prevent default or change tab for unrelated keys", () => {
    render(<DemoSelector videos={videos} />);
    const notPrevented = fireEvent.keyDown(tabs()[0], { key: "a" });
    expect(notPrevented).toBe(true);
    expect(tabs()[0]).toHaveAttribute("aria-selected", "true");
    const prevented = fireEvent.keyDown(tabs()[0], { key: "ArrowRight" });
    expect(prevented).toBe(false);
  });
});
