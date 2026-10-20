import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_VIDEOS } from "@/data/videos";
import { resolveVideo } from "./video-assets";

let dir: string;

function touch(publicPath: string) {
  const file = path.join(dir, "public", publicPath);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, "x");
}

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), "video-assets-"));
  vi.spyOn(process, "cwd").mockReturnValue(dir);
});

afterEach(() => {
  vi.restoreAllMocks();
  rmSync(dir, { recursive: true, force: true });
});

describe("resolveVideo", () => {
  it("marks the video unavailable and drops poster/vtt when no files exist", () => {
    const v = resolveVideo("student-recruitment");
    expect(v.available).toBe(false);
    expect(v.poster).toBeUndefined();
    expect(v.vtt).toBeUndefined();
    expect(v.title).toBe(DEMO_VIDEOS["student-recruitment"].title);
  });

  it("keeps every asset path when all files exist", () => {
    const cfg = DEMO_VIDEOS["property-sales"];
    touch(cfg.src);
    touch(cfg.poster);
    touch(cfg.vtt!);
    const v = resolveVideo("property-sales");
    expect(v).toMatchObject({ available: true, src: cfg.src, poster: cfg.poster, vtt: cfg.vtt });
  });

  it("resolves each asset independently", () => {
    const cfg = DEMO_VIDEOS["student-recruitment"];
    touch(cfg.src);
    const v = resolveVideo("student-recruitment");
    expect(v.available).toBe(true);
    expect(v.poster).toBeUndefined();
    expect(v.vtt).toBeUndefined();
  });

  it("treats a config without vtt as having no subtitles", () => {
    const cfg = DEMO_VIDEOS["property-sales"];
    const original = cfg.vtt;
    delete cfg.vtt;
    try {
      touch(cfg.src);
      expect(resolveVideo("property-sales").vtt).toBeUndefined();
    } finally {
      cfg.vtt = original;
    }
  });
});
