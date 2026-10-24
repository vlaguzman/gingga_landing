"use client";

import { useState } from "react";
import { dealStage, stageSlug, type PipelineStage } from "@/data/app/stages";
import type { Deal, StageId } from "@/data/app/types";
import { AppIcon } from "../AppIcon";
import { useApp } from "../AppProvider";
import { ContactPanel } from "../ContactPanel";
import { DealChat } from "../DealChat";
import { ChanChip, StageChip } from "../Chips";

type OutcomeKind = "won" | "lost" | "nurturing";
type Tab = "board" | "list" | (string & {});

/** Extra line shown for deals that left the board, per outcome. */
const OUTCOME_DETAIL: Record<OutcomeKind, (d: Deal) => string> = {
  won: (d) => `${d.property} · ${d.price} · deed signed ${d.closedOn}`,
  lost: (d) => `${d.lostReason} · ${d.closedOn}`,
  nurturing: (d) => `Next touch ${d.nextTouch} · ${d.nurtureReason}`,
};

const STATE_TITLE: Record<StageId, (d: Deal) => string> = {
  new: () => "New lead — no contact attempt yet",
  contacting: () => "Contacting — follow-ups in progress",
  qualified: () => "Qualified — budget and zone validated",
  visit: (d) => `Visit scheduled · ${d.when}`,
  proposal: () => "Proposal sent — waiting for feedback",
  negotiation: () => "Negotiation — resolving financing and conditions",
  reserved: () => "Reserved — documentation in progress",
  won: (d) => `Won — ${d.price}`,
  lost: () => "Lost — see the reason in contact info",
  nurturing: (d) => `Nurturing — next touch ${d.nextTouch}`,
};

function DbStageChip({ stage }: { stage: PipelineStage }) {
  return (
    <span className={`role-chip role-chip--${stageSlug(stage) ?? stage.kind}`} title={stage.hint}>
      {stage.name}
    </span>
  );
}

function KanbanBoard({
  stages,
  deals,
  onSel,
}: {
  stages: PipelineStage[];
  deals: Deal[];
  onSel: (id: string) => void;
}) {
  return (
    <div className="kb">
      {stages
        .filter((s) => s.kind === "open")
        .map((s) => {
          const rows = deals.filter((d) => dealStage(d, stages)?.id === s.id);
          return (
            <section key={s.id} className="kb-col" aria-label={s.name}>
              <div className="kb-head" title={s.hint}>
                <div className="kb-head-row">
                  <DbStageChip stage={s} />
                  <span className="kb-n">{rows.length}</span>
                </div>
                <p className="kb-hint">{s.hint}</p>
              </div>
              <div className="kb-cards">
                {rows.map((d) => (
                  <button key={d.id} type="button" className="card kb-card" onClick={() => onSel(d.id)}>
                    <span className="kb-title">{d.name}</span>
                    <span className="kb-contact">{d.property}</span>
                    <span className="kb-last">{d.last || d.next}</span>
                    <span className="kb-meta">
                      <ChanChip p={d.channel} />
                      <em>{d.meta}</em>
                    </span>
                  </button>
                ))}
                {rows.length === 0 && <div className="kb-empty">Nothing here yet</div>}
              </div>
            </section>
          );
        })}
    </div>
  );
}

function DealRow({ deal, line, onSel }: { deal: Deal; line: string; onSel: (id: string) => void }) {
  return (
    <button type="button" className="card po-row" onClick={() => onSel(deal.id)}>
      <span className="po-main">
        <span className="df-title">{deal.name}</span>
        <span className="meta">{line}</span>
      </span>
      <span className="po-status">
        <StageChip r={deal.stage} />
        <ChanChip p={deal.channel} /> <AppIcon name="chevR" size={13} />
      </span>
    </button>
  );
}

export function PipelineView({ stages }: { stages: PipelineStage[] }) {
  const { deals, dealSel, setDealSel } = useApp();
  const [tab, setTab] = useState<Tab>("board");
  const deal = deals.find((d) => d.id === dealSel);

  if (!deal) {
    const boardStages = stages.filter((s) => s.kind === "open");
    const tabs: [Tab, string][] = [
      ["board", "Board"],
      ["list", "List"],
      ...stages.filter((s) => s.kind !== "open").map((s): [Tab, string] => [s.id, s.name]),
    ];
    const outcome = stages.find((s) => s.id === tab && s.kind !== "open") ?? null;
    const outcomeDeals = outcome ? deals.filter((d) => dealStage(d, stages)?.id === outcome.id) : [];
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
          {tab === "board" && <KanbanBoard stages={stages} deals={deals} onSel={setDealSel} />}
          {tab === "list" &&
            boardStages.map((s) => {
              const rows = deals.filter((d) => dealStage(d, stages)?.id === s.id);
              if (!rows.length) return null;
              return (
                <div key={s.id} className="po-group">
                  <h2 className="mini-eyebrow" title={s.hint}>
                    {s.name} · {rows.length}
                  </h2>
                  {rows.map((d) => (
                    <DealRow key={d.id} deal={d} line={`${d.property} · ${d.meta}`} onSel={setDealSel} />
                  ))}
                </div>
              );
            })}
          {outcome && (
            <div className="po-group">
              <p className="po-hint">{outcome.hint}</p>
              {outcomeDeals.map((d) => (
                <DealRow key={d.id} deal={d} line={OUTCOME_DETAIL[outcome.kind as OutcomeKind](d)} onSel={setDealSel} />
              ))}
              {outcomeDeals.length === 0 && <p className="id-empty">Nothing here yet.</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <DealDetail key={deal.id} deal={deal} />;
}

function DealDetail({ deal }: { deal: Deal }) {
  const { goTo } = useApp();
  const [infoOpen, setInfoOpen] = useState(false);
  const icon = deal.stage === "visit" ? "cal" : deal.stage === "reserved" || deal.stage === "won" ? "check" : "mail";

  return (
    <div>
      <div className={`post-state ${deal.stage === "won" || deal.stage === "reserved" ? "is-live" : "is-sched"}`}>
        <span className="post-state-ic">
          <AppIcon name={icon} size={16} />
        </span>
        <div className="post-state-text">
          <p className="post-state-h">{STATE_TITLE[deal.stage](deal)}</p>
          <p className="post-state-p">
            <StageChip r={deal.stage} /> · {deal.property} · {deal.meta}
          </p>
        </div>
        {deal.draft && (
          <button type="button" className="post-state-act" onClick={() => goTo("outreach", deal.draft)}>
            Open the draft <AppIcon name="arrow" size={13} />
          </button>
        )}
      </div>
      <div className={`deal-layout${infoOpen ? " with-info" : ""}`}>
        <DealChat deal={deal} infoOpen={infoOpen} onToggleInfo={() => setInfoOpen((o) => !o)} />
        {infoOpen && <ContactPanel deal={deal} onClose={() => setInfoOpen(false)} />}
      </div>
    </div>
  );
}
