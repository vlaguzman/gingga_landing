"use client";

import { useState } from "react";
import { BOARD_STAGES, OUTCOME_STAGES, STAGES, type OutcomeStageId } from "@/data/app/chips";
import type { Deal, StageId } from "@/data/app/types";
import { AppIcon } from "../AppIcon";
import { useApp } from "../AppProvider";
import { ContactPanel } from "../ContactPanel";
import { DealChat } from "../DealChat";
import { ChanChip, StageChip } from "../Chips";

type Tab = "board" | "list" | OutcomeStageId;

/** Extra line shown for deals that left the board, per outcome. */
const OUTCOME_DETAIL: Record<OutcomeStageId, (d: Deal) => string> = {
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

function KanbanBoard({ deals, onSel }: { deals: Deal[]; onSel: (id: string) => void }) {
  return (
    <div className="kb">
      {BOARD_STAGES.map((s) => {
        const rows = deals.filter((d) => d.stage === s);
        return (
          <section key={s} className="kb-col" aria-label={STAGES[s].name}>
            <div className="kb-head" title={STAGES[s].hint}>
              <div className="kb-head-row">
                <StageChip r={s} />
                <span className="kb-n">{rows.length}</span>
              </div>
              <p className="kb-hint">{STAGES[s].hint}</p>
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

export function PipelineView() {
  const { deals, dealSel, setDealSel } = useApp();
  const [tab, setTab] = useState<Tab>("board");
  const deal = deals.find((d) => d.id === dealSel);

  if (!deal) {
    const tabs: [Tab, string][] = [
      ["board", "Board"],
      ["list", "List"],
      ...OUTCOME_STAGES.map((s): [Tab, string] => [s, STAGES[s].name]),
    ];
    const outcome = tab !== "board" && tab !== "list" ? tab : null;
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
          {tab === "board" && <KanbanBoard deals={deals} onSel={setDealSel} />}
          {tab === "list" &&
            BOARD_STAGES.map((s) => {
              const rows = deals.filter((d) => d.stage === s);
              if (!rows.length) return null;
              return (
                <div key={s} className="po-group">
                  <h2 className="mini-eyebrow" title={STAGES[s].hint}>
                    {STAGES[s].name} · {rows.length}
                  </h2>
                  {rows.map((d) => (
                    <DealRow key={d.id} deal={d} line={`${d.property} · ${d.meta}`} onSel={setDealSel} />
                  ))}
                </div>
              );
            })}
          {outcome && (
            <div className="po-group">
              <p className="po-hint">{STAGES[outcome].hint}</p>
              {deals
                .filter((d) => d.stage === outcome)
                .map((d) => (
                  <DealRow key={d.id} deal={d} line={OUTCOME_DETAIL[outcome](d)} onSel={setDealSel} />
                ))}
              {!deals.some((d) => d.stage === outcome) && <p className="id-empty">Nothing here yet.</p>}
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
