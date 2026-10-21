import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BenefitCards } from "./BenefitCards";

describe("BenefitCards", () => {
  it("renders the heading and one list item per benefit", () => {
    render(
      <BenefitCards
        heading="Why us"
        items={[
          { title: "Fast", text: "Replies quickly" },
          { title: "Smart", text: "Qualifies leads" },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Why us" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 3, name: "Smart" })).toBeInTheDocument();
    expect(screen.getByText("Replies quickly")).toBeInTheDocument();
  });
});
