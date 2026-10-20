import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatExcerpt, ExampleCard } from "./ExampleCard";

describe("ExampleCard", () => {
  const fields = [
    { label: "Buyer", value: "Emma" },
    { label: "Status", value: "Waiting" },
  ];

  it("always labels the card as fictional example data and renders fields", () => {
    render(<ExampleCard title="Lead" fields={fields} />);
    expect(screen.getByText(/Example data\. Fictional prospect/)).toBeInTheDocument();
    expect(screen.getByText("Lead")).toBeInTheDocument();
    expect(screen.getByText("Buyer")).toBeInTheDocument();
    expect(screen.getByText("Emma")).toBeInTheDocument();
  });

  it("omits tag and footer when not provided", () => {
    const { container } = render(<ExampleCard title="Lead" fields={fields} />);
    expect(container.querySelector(".tag")).toBeNull();
    expect(container.querySelector(".summary__status")).toBeNull();
  });

  it("renders tag and footer when provided", () => {
    render(<ExampleCard title="Lead" fields={fields} tag="Hot" footer={<em>Done</em>} />);
    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});

describe("ChatExcerpt", () => {
  it("renders title, channel and directional bubbles", () => {
    const { container } = render(
      <ChatExcerpt
        title="Student"
        channel="WhatsApp"
        lines={[
          { from: "in", text: "Hi" },
          { from: "out", text: "Hello" },
        ]}
      />,
    );
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Example conversation")).toBeInTheDocument();
    expect(screen.getByText("Hi")).toHaveClass("bubble--in");
    expect(screen.getByText("Hello")).toHaveClass("bubble--out");
    expect(container.querySelectorAll(".bubble")).toHaveLength(2);
  });
});
