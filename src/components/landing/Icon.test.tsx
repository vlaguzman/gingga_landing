import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./Icon";
import { IconSprite } from "./IconSprite";

describe("Icon", () => {
  it("references the matching sprite symbol and is hidden from assistive tech", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("use")).toHaveAttribute("href", "#i-check");
  });
});

describe("IconSprite", () => {
  it("defines a symbol for every IconName", () => {
    const { container } = render(<IconSprite />);
    const ids = [...container.querySelectorAll("symbol")].map((s) => s.id).sort();
    expect(ids).toEqual(["i-arrow", "i-check", "i-chevron", "i-drop", "i-play"]);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
