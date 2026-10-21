import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LoginState } from "./actions";

const login = vi.fn<(prev: LoginState, fd: FormData) => Promise<LoginState>>();
vi.mock("./actions", () => ({
  login: (prev: LoginState, fd: FormData) => login(prev, fd),
}));

import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty fields and an enabled submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Work email")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows field errors, marks inputs invalid and keeps the typed email", async () => {
    login.mockResolvedValue({
      email: "bad",
      fieldErrors: { email: "Enter a valid email address.", password: "Too short." },
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "bad");
    await user.type(screen.getByLabelText("Password"), "x");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Too short.")).toBeInTheDocument();
    const email = screen.getByLabelText("Work email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-describedby", "password-error");
    expect(email).toHaveValue("bad");
  });

  it("submits the entered credentials to the action", async () => {
    login.mockResolvedValue({});
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "a@b.co");
    await user.type(screen.getByLabelText("Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    const fd = login.mock.calls[0][1];
    expect(fd.get("email")).toBe("a@b.co");
    expect(fd.get("password")).toBe("password1");
  });

  it("shows the general error returned by the action", async () => {
    login.mockResolvedValue({ error: "Invalid email or password.", email: "a@b.co" });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
  });

  it("disables the button and shows progress while pending", async () => {
    let resolve!: (s: LoginState) => void;
    login.mockReturnValue(new Promise<LoginState>((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const pending = await screen.findByRole("button", { name: /Signing in/ });
    expect(pending).toBeDisabled();

    resolve({});
    expect(await screen.findByRole("button", { name: "Sign in" })).toBeEnabled();
  });
});
