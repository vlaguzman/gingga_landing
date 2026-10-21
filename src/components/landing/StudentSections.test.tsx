import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdviserHandoff, Documentation, StudentMeasure } from "./StudentSections";

describe("Documentation", () => {
  it("renders capabilities and the fictional checklist", () => {
    render(<Documentation />);
    expect(screen.getByText("Request required documents.")).toBeInTheDocument();
    expect(screen.getByText(/Example data\. Fictional application/)).toBeInTheDocument();
    expect(screen.getByText("Application checklist")).toBeInTheDocument();
    expect(screen.getByText("Passport copy")).toBeInTheDocument();
  });

  it("maps each document status to a kebab-case status class", () => {
    render(<Documentation />);
    expect(screen.getByText("Complete")).toHaveClass("status--complete");
    expect(screen.getByText("Received")).toHaveClass("status--received");
    expect(screen.getByText("Requested")).toHaveClass("status--requested");
    expect(screen.getByText("Needs review")).toHaveClass("status--needs-review");
  });
});

describe("AdviserHandoff", () => {
  it("shows the chat excerpt next to the handoff card", () => {
    render(<AdviserHandoff />);
    expect(screen.getByText("Prospective student")).toBeInTheDocument();
    expect(screen.getByText("Economics. I can send the transcript now.")).toHaveClass("bubble--in");
    expect(screen.getByText("Adviser handoff")).toBeInTheDocument();
    expect(screen.getByText("Ready for adviser")).toBeInTheDocument();
    expect(screen.getByText("Transcript, passport copy")).toBeInTheDocument();
  });
});

describe("StudentMeasure", () => {
  it("marks only the not-yet-connected stages as pending", () => {
    render(<StudentMeasure />);
    const stages = within(screen.getByRole("list", { name: /Progress stages/ })).getAllByRole("listitem");
    expect(stages).toHaveLength(5);
    expect(stages.filter((s) => s.classList.contains("is-pending")).map((s) => s.textContent)).toEqual([
      "ApplicationWhen data is connected",
      "EnrolmentWhen data is connected",
    ]);
    expect(stages[0]).not.toHaveClass("is-pending");
  });

  it("lists the measured metrics", () => {
    render(<StudentMeasure />);
    const chips = within(screen.getByRole("list", { name: "Measured by GINGGA" })).getAllByRole("listitem");
    expect(chips.map((c) => c.textContent)).toEqual([
      "Response times",
      "Information completeness",
      "Adviser handoffs",
    ]);
  });
});
