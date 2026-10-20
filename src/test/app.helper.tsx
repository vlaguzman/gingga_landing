import type { ReactNode } from "react";
import { act, render } from "@testing-library/react";
import { vi } from "vitest";
import { AppProvider, useApp } from "@/components/app/AppProvider";

/**
 * Shared harness for the simulated app UI. Importing this module registers the `next/*` mocks, so
 * import it BEFORE the component under test. `push` also moves `pathname`, so a `goTo` is visible as a
 * section change on the next render, like a real navigation.
 */
const nav = vi.hoisted(() => ({
  pathname: "/today-dashboard",
  push: undefined as unknown as ReturnType<typeof vi.fn>,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: nav.push }),
}));

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, onClick, ...rest }: Record<string, unknown> & { href: string; children?: ReactNode }) =>
      React.createElement(
        "a",
        {
          href,
          ...rest,
          onClick: (e: { preventDefault: () => void }) => {
            (onClick as ((e: unknown) => void) | undefined)?.(e);
            e.preventDefault();
          },
        },
        children,
      ),
  };
});

vi.mock("@/app/(auth)/login/actions", () => ({ logout: vi.fn() }));

nav.push = vi.fn((href: string) => {
  nav.pathname = href;
});

export const navMock = nav;

export type AppCtx = ReturnType<typeof useApp>;

let current: AppCtx;

/** Renders nothing; captures the live context so tests can read state and call actions. */
export function Probe() {
  current = useApp();
  return null;
}

export const app = () => current;

export const USER = { name: "Ada Lovelace", email: "ada@example.com" };

export function setPath(pathname: string) {
  nav.pathname = pathname;
  nav.push.mockClear();
}

export function renderInApp(ui: ReactNode, opts: { path?: string; user?: { name: string; email: string } } = {}) {
  setPath(opts.path ?? "/today-dashboard");
  return render(
    <AppProvider user={opts.user ?? USER}>
      <Probe />
      {ui}
    </AppProvider>,
  );
}

/** Advances fake timers inside act so React flushes the state updates they trigger. */
export const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

export const run = (fn: () => void) => act(fn);

// Testing Library only auto-advances fake timers when a global `jest` exists; without this shim
// every `userEvent` call hangs on its internal setTimeout under `vi.useFakeTimers()`.
(globalThis as unknown as { jest: unknown }).jest = {
  advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
};
