import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./LoginForm", () => ({ LoginForm: () => <form data-testid="login-form" /> }));
vi.mock("./login.css", () => ({}));

import LoginPage, { metadata } from "./page";

describe("LoginPage", () => {
  it("renders the heading, form and links", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sign in to your workspace");
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GINGGA home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "See how it works" })).toHaveAttribute(
      "href",
      "/#services",
    );
    expect(screen.getByAltText("GINGGA")).toBeInTheDocument();
  });

  it("is kept out of search results", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
