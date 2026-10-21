import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroVideo } from "./HeroVideo";

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: IOCallback;
const observe = vi.fn();
const disconnect = vi.fn();
let play: ReturnType<typeof vi.spyOn>;
let pause: ReturnType<typeof vi.spyOn>;

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce }) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IOCallback) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  setReducedMotion(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("HeroVideo", () => {
  it("renders a muted, labelled illustrative video with its caption", () => {
    const { container } = render(<HeroVideo />);
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("poster", "/assets/hero-chat-poster.jpg");
    expect(video).toHaveAttribute("aria-label", expect.stringContaining("Illustrative example"));
    expect(screen.getByText("Illustrative example")).toBeInTheDocument();
    expect(container.querySelector("source")).toHaveAttribute("src", "/assets/hero-chat.mp4");
  });

  it("plays once when it scrolls into view and then stops observing", () => {
    render(<HeroVideo />);
    expect(observe).toHaveBeenCalledTimes(1);
    callback([{ isIntersecting: false }]);
    expect(play).not.toHaveBeenCalled();
    callback([{ isIntersecting: true }]);
    expect(disconnect).toHaveBeenCalled();
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("swallows a rejected play() (e.g. autoplay blocked)", async () => {
    play.mockRejectedValue(new Error("blocked"));
    render(<HeroVideo />);
    expect(() => callback([{ isIntersecting: true }])).not.toThrow();
    await Promise.resolve();
  });

  it("never observes or plays for reduced-motion users", () => {
    setReducedMotion(true);
    render(<HeroVideo />);
    expect(observe).not.toHaveBeenCalled();
    expect(play).not.toHaveBeenCalled();
  });

  it("disconnects and pauses on unmount", () => {
    const { unmount } = render(<HeroVideo />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
    expect(pause).toHaveBeenCalled();
  });
});
