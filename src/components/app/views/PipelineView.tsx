"use client";

import { useState } from "react";
import type { PipelineLead, PipelineStage } from "@/data/app/stages";
import { useApp } from "../AppProvider";
import { KanbanBoard } from "../KanbanBoard";
import { LeadCard } from "../LeadCard";
import { LeadDetail } from "../LeadDetail";
import { StageEditor } from "../StageEditor";

type Tab = "board" | "list" | "edit" | (string & {});

export function PipelineView({ stages, leads }: { stages: PipelineStage[]; leads: PipelineLead[] }) {
  // The selected lead id lives in the app context so the shell breadcrumb can clear it.
  // A stale id (e.g. a mock deal id from another view) matches no lead and shows the board.
  const { dealSel, setDealSel } = useApp();
  const [tab, setTab] = useState<Tab>("board");
  const lead = leads.find((l) => l.id === dealSel);

  if (lead) return <LeadDetail key={lead.id} lead={lead} stages={stages} />;

  const openStages = stages.filter((s) => s.kind === "open");
  const outcomeStages = stages.filter((s) => s.kind !== "open");
  const outcome = outcomeStages.find((s) => s.id === tab) ?? null;
  const tabs: [Tab, string][] = [
    ["board", "Board"],
    ["list", "List"],
    ...outcomeStages.map((s): [Tab, string] => [s.id, s.name]),
    ["edit", "Edit stages"],
  ];

  return (
    <div>
      <h1 className="pg">Pipeline</h1>
      <span className="eyebrow">Every open conversation · from the first message to a reserved home</span>
      <div className="pipeline-body">
        <div className="seg" role="group" aria-label="Pipeline view">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={tab === id ? "on" : ""}
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "edit" && <StageEditor stages={stages} />}
        {tab === "board" && <KanbanBoard stages={openStages} leads={leads} onSel={setDealSel} />}
        {tab === "list" &&
          openStages.map((s) => {
            const rows = leads.filter((l) => l.stageId === s.id);
            if (!rows.length) return null;
            return (
              <div key={s.id} className="po-group">
                <h2 className="mini-eyebrow" title={s.hint}>
                  {s.name} · {rows.length}
                </h2>
                {rows.map((l) => (
                  <LeadCard key={l.id} lead={l} onSel={setDealSel} />
                ))}
              </div>
            );
          })}
        {outcome && (
          <div className="po-group">
            <p className="po-hint">{outcome.hint}</p>
            {leads
              .filter((l) => l.stageId === outcome.id)
              .map((l) => (
                <LeadCard key={l.id} lead={l} onSel={setDealSel} />
              ))}
            {!leads.some((l) => l.stageId === outcome.id) && <p className="id-empty">Nothing here yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
