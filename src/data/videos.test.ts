import { describe, expect, it } from "vitest";
import { SECTORS } from "@/lib/demo";
import { DEMO_VIDEOS } from "./videos";

describe("DEMO_VIDEOS", () => {
  it("has exactly one entry per sector, keyed by its own id", () => {
    expect(Object.keys(DEMO_VIDEOS).sort()).toEqual(Object.keys(SECTORS).sort());
    for (const [key, video] of Object.entries(DEMO_VIDEOS)) expect(video.id).toBe(key);
  });

  it("points at root-relative public assets", () => {
    for (const v of Object.values(DEMO_VIDEOS)) {
      expect(v.src).toMatch(/^\/assets\/.+\.mp4$/);
      expect(v.poster).toMatch(/^\/assets\//);
      expect(v.vtt).toMatch(/\.vtt$/);
    }
  });

  it("has positive dimensions and copy for the UI", () => {
    for (const v of Object.values(DEMO_VIDEOS)) {
      expect(v.width).toBeGreaterThan(0);
      expect(v.height).toBeGreaterThan(0);
      expect(v.title && v.label && v.caption && v.linkLabel && v.vttLang).toBeTruthy();
    }
  });
});
