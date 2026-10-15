import type { SectorId } from "@/lib/demo";

export type DemoVideoConfig = {
  id: SectorId;
  /** Files live in /public. Missing files are detected at build time and a placeholder is rendered instead. */
  src: string;
  poster: string;
  /** Optional WebVTT subtitles. Omitted from the page when the file does not exist. */
  vtt?: string;
  vttLang: string;
  /** Intrinsic dimensions, used to preserve the original aspect ratio. */
  width: number;
  height: number;
  title: string;
  label: string;
  caption: string;
  linkLabel: string;
};

export const DEMO_VIDEOS: Record<SectorId, DemoVideoConfig> = {
  "student-recruitment": {
    id: "student-recruitment",
    src: "/assets/hero-demo.mp4",
    poster: "/assets/hero-demo-poster.jpg",
    vtt: "/assets/hero-demo.en.vtt",
    vttLang: "en",
    width: 1280,
    height: 720,
    title: "Student recruitment workflow demo",
    label: "Student recruitment workflow demo",
    caption: "From initial enquiry to a better-prepared student application.",
    linkLabel: "Explore student recruitment",
  },
  "property-sales": {
    id: "property-sales",
    src: "/assets/property-sales-demo.mp4",
    poster: "/assets/property-sales-demo-poster.jpg",
    vtt: "/assets/property-sales-demo.en.vtt",
    vttLang: "en",
    width: 1280,
    height: 720,
    title: "Property sales workflow demo",
    label: "Property sales workflow demo",
    caption: "From property enquiry to a better-prepared sales conversation.",
    linkLabel: "Explore property sales",
  },
};
