import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { demoHref } from "@/lib/demo";
import type { ResolvedVideo } from "@/lib/video-assets";
import { SectorHero } from "./SectorHero";

vi.mock("./DemoVideo", () => ({
  DemoVideo: ({ video }: { video: ResolvedVideo }) => <div data-testid="demo-video">{video.title}</div>,
}));

const video = { title: "Vid", label: "Vid label" } as ResolvedVideo;

describe("SectorHero", () => {
  it("renders copy, a sector-specific booking link and the video with its label", () => {
    render(<SectorHero sector="student-recruitment" title="Hero title" lead="Lead copy" service="Service note" video={video} />);
    expect(screen.getByRole("heading", { level: 1, name: "Hero title" })).toBeInTheDocument();
    expect(screen.getByText("Lead copy")).toBeInTheDocument();
    expect(screen.getByText("Service note")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book a student recruitment demo" })).toHaveAttribute(
      "href",
      demoHref("student-recruitment"),
    );
    expect(screen.getByTestId("demo-video")).toHaveTextContent("Vid");
    expect(screen.getByText("Vid label")).toBeInTheDocument();
  });
});
