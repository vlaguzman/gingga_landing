import type { PipelineLead } from "@/data/app/stages";

/** Fixed locale and zone so server and client render the same text. */
export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export function LeadCard({ lead, onSel }: { lead: PipelineLead; onSel: (id: string) => void }) {
  return (
    <button type="button" className="card kb-card" onClick={() => onSel(lead.id)}>
      <span className="kb-title">{lead.name}</span>
      <span className="kb-contact">{lead.email ?? lead.phone}</span>
      <span className="kb-last">{lead.lastContact ? `Last contact ${formatDay(lead.lastContact)}` : "No contact yet"}</span>
      <span className="kb-meta">
        <em>{lead.campaign ?? "Direct"}</em>
      </span>
    </button>
  );
}
