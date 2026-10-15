import { existsSync } from "node:fs";
import path from "node:path";
import { DEMO_VIDEOS, type DemoVideoConfig } from "@/data/videos";
import type { SectorId } from "@/lib/demo";

export type ResolvedVideo = Omit<DemoVideoConfig, "poster" | "vtt"> & {
  available: boolean;
  poster?: string;
  vtt?: string;
};

function exists(publicPath?: string): boolean {
  return !!publicPath && existsSync(path.join(process.cwd(), "public", publicPath));
}

/** Server-only: checks which of the configured files are really present in /public. */
export function resolveVideo(id: SectorId): ResolvedVideo {
  const { poster, vtt, ...rest } = DEMO_VIDEOS[id];
  return {
    ...rest,
    available: exists(rest.src),
    poster: exists(poster) ? poster : undefined,
    vtt: exists(vtt) ? vtt : undefined,
  };
}
