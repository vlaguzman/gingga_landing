import { STAGES } from "./chips";
import type { Deal, StageId } from "./types";

/** A pipeline stage as loaded from the database (user-editable per brand). */
export interface PipelineStage {
  id: string;
  name: string;
  hint: string;
  kind: "open" | "won" | "lost" | "nurturing";
  position: number;
}

const SLUGS = Object.keys(STAGES) as StageId[];

/**
 * Bridge while deals are still mock data: the default stages sit at positions 0..9 in the order of STAGES,
 * so a slug maps to a position and survives renames. Dropped when leads come from the database.
 */
export function stageSlug(stage: PipelineStage): StageId | undefined {
  return SLUGS[stage.position];
}

/** The stage a mock deal sits in, or the first open stage if its position no longer exists. */
export function dealStage(deal: Deal, stages: PipelineStage[]): PipelineStage | undefined {
  return stages.find((s) => s.position === SLUGS.indexOf(deal.stage)) ?? stages.find((s) => s.kind === "open");
}
