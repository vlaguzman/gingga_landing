/** A pipeline stage as loaded from the database (user-editable per brand). */
export interface PipelineStage {
  id: string;
  name: string;
  hint: string;
  /** "open" stages are board columns; the rest are outcomes that leave the board. */
  kind: "open" | "won" | "lost" | "nurturing";
  position: number;
}

/** A lead as loaded from the database for the pipeline. */
export interface PipelineLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  stageId: string;
  /** Campaign name, or null for organic / direct leads. */
  campaign: string | null;
  /** ISO date of the latest message, or null if the lead has none. */
  lastContact: string | null;
}
