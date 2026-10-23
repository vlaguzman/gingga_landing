import type { playbookGroup, playbookSourceStatus } from "@/db/schema";

export type PlaybookGroupId = (typeof playbookGroup.enumValues)[number];
export type PlaybookSourceStatus = (typeof playbookSourceStatus.enumValues)[number];

export const PLAYBOOK_GROUP_ORDER: readonly PlaybookGroupId[] = ["who_we_target", "what_works", "objections", "process"];

export const PLAYBOOK_GROUP_LABEL: Record<PlaybookGroupId, string> = {
  who_we_target: "Who we target",
  what_works: "What works",
  objections: "Objections",
  process: "Process",
};

/** Characters, not tokens: a cheap, provider-independent ceiling for the agent context. */
export const DEFAULT_CONTEXT_BUDGET = 12_000;

const TRUNCATED = "\n[truncated]";

type ClaimInput = { group: PlaybookGroupId; claim: string; because: string | null };
type SourceInput = { filename: string; extractedText: string | null; status: PlaybookSourceStatus };

function cap(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - TRUNCATED.length)) + TRUNCATED;
}

/**
 * Builds the playbook text agents receive: claims by section (fixed order, input order kept inside a
 * section), then the extracted text of ready sources. The result never exceeds `maxChars`; claims have
 * priority and sources only get what is left. Callers must pass rows already filtered by brand.
 */
export function buildPlaybookContext(
  claims: readonly ClaimInput[],
  sources: readonly SourceInput[],
  { maxChars = DEFAULT_CONTEXT_BUDGET }: { maxChars?: number } = {},
): string {
  const sections: string[] = [];

  for (const group of PLAYBOOK_GROUP_ORDER) {
    const lines = claims
      .filter((c) => c.group === group)
      .map((c) => (c.because ? `- ${c.claim} (because: ${c.because})` : `- ${c.claim}`));
    if (lines.length > 0) sections.push(`## ${PLAYBOOK_GROUP_LABEL[group]}\n${lines.join("\n")}`);
  }

  let out = cap(sections.join("\n\n"), maxChars);

  for (const s of sources) {
    const text = s.extractedText?.trim();
    if (s.status !== "ready" || !text) continue;
    const header = `${out ? "\n\n" : ""}### ${s.filename}\n`;
    const room = maxChars - out.length - header.length;
    // Not worth a header if less than a short excerpt would fit.
    if (room < TRUNCATED.length + 20) break;
    out += header + cap(text, room);
  }

  return out;
}
