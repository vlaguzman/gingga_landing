import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ResolvedVideo } from "@/lib/video-assets";
import { DemoVideo } from "./DemoVideo";

const base: ResolvedVideo = {
  id: "property-sales",
  src: "/assets/a.mp4",
  poster: "/assets/a.jpg",
  vtt: "/assets/a.vtt",
  vttLang: "en",
  width: 1280,
  height: 720,
  title: "Demo title",
  label: "Demo label",
  caption: "c",
  linkLabel: "l",
  available: true,
};

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("DemoVideo", () => {
  it("renders a user-initiated player with poster, source, subtitles and aspect ratio", () => {
    const { container } = render(<DemoVideo video={base} />);
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("controls");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", "/assets/a.jpg");
    expect(video).toHaveAttribute("aria-label", "Demo title");
    expect(container.querySelector("source")).toHaveAttribute("src", "/assets/a.mp4");
    const track = container.querySelector("track")!;
    expect(track).toHaveAttribute("src", "/assets/a.vtt");
    expect(track).toHaveAttribute("srclang", "en");
    expect((container.firstChild as HTMLElement).style.aspectRatio).toBe("1280 / 720");
  });

  it("omits the subtitle track when there is no vtt", () => {
    const { container } = render(<DemoVideo video={{ ...base, vtt: undefined }} />);
    expect(container.querySelector("track")).toBeNull();
  });

  it("shows a placeholder when the video is unavailable", () => {
    const { container } = render(<DemoVideo video={{ ...base, available: false }} />);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("group", { name: "Demo title" })).toBeInTheDocument();
    expect(screen.getByText(/Demo video unavailable/)).toBeInTheDocument();
  });

  it("falls back to the placeholder when the video errors", () => {
    const { container } = render(<DemoVideo video={base} />);
    fireEvent.error(container.querySelector("video")!);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByText(/Demo video unavailable/)).toBeInTheDocument();
  });

  it("pauses playback on unmount", () => {
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const { unmount } = render(<DemoVideo video={base} />);
    unmount();
    expect(pause).toHaveBeenCalled();
  });
});
