"use server";

import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Front-end simulation: validates the input and sends the user to the demo workspace.
 * Swap the body for a real credential check once an auth backend exists.
 */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: NonNullable<LoginState["fieldErrors"]> = {};
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";

  if (fieldErrors.email || fieldErrors.password) return { fieldErrors, email };

  redirect("/today-dashboard");
}
