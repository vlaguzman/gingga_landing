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

/** Default stage slug whose name matches, used only for chip colours. */
export function stageSlug(stage: PipelineStage): StageId | undefined {
  return (Object.keys(STAGES) as StageId[]).find((s) => STAGES[s].name === stage.name);
}

/**
 * Bridge while deals are still mock data: a deal sits in the stage whose name matches its slug's
 * default name, or in the first open stage if that stage was renamed or removed.
 */
export function dealStage(deal: Deal, stages: PipelineStage[]): PipelineStage | undefined {
  return stages.find((s) => s.name === STAGES[deal.stage].name) ?? stages.find((s) => s.kind === "open");
}
