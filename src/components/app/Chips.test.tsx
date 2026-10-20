import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { STAGES } from "@/data/app/chips";
import { AppIcon } from "./AppIcon";
import { ChanChip, StageChip, ViaChip } from "./Chips";
import { Mark } from "./Mark";

describe("ViaChip", () => {
  it("shows the lead source name and mark", () => {
    render(<ViaChip v="instagram" />);
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("IG")).toHaveClass("mark--violet");
    expect(screen.getByText("Instagram").closest(".via")).toHaveAttribute("title", "Instagram");
  });
});

describe("ChanChip", () => {
  it("shows the channel name and mark", () => {
    render(<ChanChip p="call" />);
    expect(screen.getByText("Call")).toBeInTheDocument();
    expect(screen.getByText("☎")).toHaveClass("mark--violet");
  });
});

describe("StageChip", () => {
  it("shows the stage name with its hint as a tooltip", () => {
    render(<StageChip r="visit" />);
    const chip = screen.getByText("Visit Scheduled");
    expect(chip).toHaveClass("role-chip--visit");
    expect(chip).toHaveAttribute("title", STAGES.visit.hint);
  });
});

describe("AppIcon", () => {
  const names = [
    "sun", "chat", "radar", "mail", "funnel", "book", "db", "pen", "phone", "arrow",
    "chevR", "burger", "panel", "gear", "exit", "up", "spark", "cal", "check", "copy",
  ] as const;

  it.each(names)("renders the %s icon as a decorative svg with content", (name) => {
    const { container } = render(<AppIcon name={name} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "17");
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it("honours a custom size", () => {
    const { container } = render(<AppIcon name="sun" size={30} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "30");
    expect(svg).toHaveAttribute("height", "30");
  });
});

describe("Mark", () => {
  it("scales the mark keeping the 605x425 ratio and is decorative by default", () => {
    const { container } = render(<Mark size={46} />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("width", "46");
    expect(img).toHaveAttribute("height", String(Math.round((46 * 425) / 605)));
    expect(img).toHaveAttribute("alt", "");
  });

  it("uses the default size and an explicit alt text", () => {
    render(<Mark alt="GINGGA mark" />);
    const img = screen.getByRole("img", { name: "GINGGA mark" });
    expect(img).toHaveAttribute("width", "22");
    expect(img).toHaveAttribute("height", "15");
  });
});
