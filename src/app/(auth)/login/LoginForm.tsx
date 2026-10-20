"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form className="login__form" action={formAction} noValidate>
      <div className="login__field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          placeholder="you@company.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
        />
        {errors.email && (
          <p className="login__error" id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="login__field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          required
        />
        {errors.password && (
          <p className="login__error" id="password-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {state.error && (
        <p className="login__error" role="alert">
          {state.error}
        </p>
      )}

      <button className="btn login__submit" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
