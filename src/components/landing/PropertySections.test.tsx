import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BuyerContext, CallsAndMeetings, WhatsAppDelegation } from "./PropertySections";

describe("CallsAndMeetings", () => {
  it("renders the three call steps and the viewing example card", () => {
    render(<CallsAndMeetings />);
    for (const t of ["Coordinate", "Prepare", "Follow through"]) {
      expect(screen.getByRole("heading", { level: 3, name: t })).toBeInTheDocument();
    }
    expect(screen.getByText("Viewing request")).toBeInTheDocument();
    expect(screen.getByText("Awaiting buyer")).toBeInTheDocument();
    expect(screen.getByText("Saturday 10:00 or 14:00")).toBeInTheDocument();
  });
});

describe("WhatsAppDelegation", () => {
  it("lists example instructions and shows the confirmation-required conversation", () => {
    render(<WhatsAppDelegation />);
    expect(screen.getByRole("heading", { name: "An AI agent you can delegate to." })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText(/Create a task to call James tomorrow\./)).toBeInTheDocument();
    expect(screen.getByText("Awaiting your confirmation")).toBeInTheDocument();
    expect(screen.getByText(/Nothing has been sent yet/)).toBeInTheDocument();
    expect(screen.getByText("Example conversation")).toBeInTheDocument();
  });
});

describe("BuyerContext", () => {
  it("renders the buyer context example card", () => {
    render(<BuyerContext />);
    expect(screen.getByText("Buyer context")).toBeInTheDocument();
    expect(screen.getByText("Call booked")).toBeInTheDocument();
    expect(screen.getByText("Preferred location")).toBeInTheDocument();
    expect(screen.getByText(/Example data\. Fictional prospect/)).toBeInTheDocument();
  });
});
