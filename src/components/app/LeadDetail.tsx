"use client";

import { useState, useTransition, type KeyboardEvent } from "react";
import { updateLeadStage } from "@/app/(app)/pipeline/actions";
import type { PipelineLead, PipelineStage } from "@/data/app/stages";
import { formatDay } from "./LeadCard";
import { initialsOf, LeadChat } from "./LeadChat";

function ContactInfo({ lead, stages, onClose }: { lead: PipelineLead; stages: PipelineStage[]; onClose: () => void }) {
  const [stageId, setStageId] = useState(lead.stageId);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const change = (next: string) => {
    const previous = stageId;
    setStageId(next);
    setError(null);
    start(async () => {
      const res = await updateLeadStage(lead.id, next);
      if (!res.ok) {
        setStageId(previous);
        setError(res.error);
      }
    });
  };

  const fields: [string, string][] = [
    ["Phone", lead.phone],
    ["Email", lead.email ?? "—"],
    ["Campaign", lead.campaign ?? "Direct"],
    ["Last contact", lead.lastContact ? formatDay(lead.lastContact) : "No contact yet"],
  ];
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <>
      <div className="cp-scrim" onClick={onClose} aria-hidden="true" />
      <aside id="contact-panel" className="cp card" aria-label="Contact details" onKeyDown={onKeyDown}>
        <div className="cp-top">
          <h3 className="mini-eyebrow">Contact info</h3>
          <button type="button" className="cp-close" onClick={onClose} aria-label="Close contact info" autoFocus>
            ✕
          </button>
        </div>
        <div className="cp-id">
          <span className="cp-avatar" aria-hidden="true">
            {initialsOf(lead.name)}
          </span>
          <p className="cp-name">{lead.name}</p>
        </div>
        <dl className="cp-fields">
          {fields.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt>
              <label htmlFor="lead-stage">Stage</label>
            </dt>
            <dd>
              <select
                id="lead-stage"
                className="se-input"
                value={stageId}
                disabled={pending}
                onChange={(e) => change(e.target.value)}
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </dd>
          </div>
        </dl>
        {error && (
          <p className="se-error" role="alert">
            {error}
          </p>
        )}
      </aside>
    </>
  );
}

export function LeadDetail({ lead, stages }: { lead: PipelineLead; stages: PipelineStage[] }) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className={`deal-layout${infoOpen ? " with-info" : ""}`}>
      <LeadChat lead={lead} infoOpen={infoOpen} onToggleInfo={() => setInfoOpen((o) => !o)} />
      {infoOpen && <ContactInfo lead={lead} stages={stages} onClose={() => setInfoOpen(false)} />}
    </div>
  );
}
