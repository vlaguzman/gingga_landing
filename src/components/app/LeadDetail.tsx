"use client";

import { useState, useTransition } from "react";
import { updateLeadStage } from "@/app/(app)/pipeline/actions";
import type { PipelineLead, PipelineStage } from "@/data/app/stages";
import { formatDay } from "./LeadCard";

export function LeadDetail({ lead, stages }: { lead: PipelineLead; stages: PipelineStage[] }) {
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

  return (
    <div className="ld">
      <h1 className="pg">{lead.name}</h1>
      <dl className="ld-grid">
        <dt>Phone</dt>
        <dd>{lead.phone}</dd>
        <dt>Email</dt>
        <dd>{lead.email ?? "—"}</dd>
        <dt>Campaign</dt>
        <dd>{lead.campaign ?? "Direct"}</dd>
        <dt>Last contact</dt>
        <dd>{lead.lastContact ? formatDay(lead.lastContact) : "No contact yet"}</dd>
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
      </dl>
      {error && (
        <p className="se-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
