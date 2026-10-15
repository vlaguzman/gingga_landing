"use client";

import { useState } from "react";
import { AppIcon } from "../AppIcon";
import { useApp } from "../AppProvider";
import { ChanChip, ViaChip } from "../Chips";

export function LeadsView() {
  const { leads, leadSel, setLeadSel, createOutreach, discardLead, undoDiscard, leadUndo, leadsLoading } = useApp();
  const [showCtx, setShowCtx] = useState(false);
  const lead = leads.find((l) => l.id === leadSel);

  if (!lead) {
    return (
      <div>
        <h1 className="pg">Leads</h1>
        <span className="eyebrow">Sourced overnight · pick the ones worth a first touch, discard the rest</span>
        <div className="card id-list">
          {leadsLoading ? (
            <div className="id-skeleton" role="status" aria-label="Updating leads">
              <div className="sk-bar sk-bar--lg" style={{ width: "70%" }} />
              <div className="sk-bar" style={{ width: "38%" }} />
              <div className="sk-bar sk-bar--lg sk-bar--gap" style={{ width: "62%" }} />
              <div className="sk-bar" style={{ width: "42%" }} />
            </div>
          ) : (
            <>
              {leads.map((l) => (
                <div key={l.id} className="id-row">
                  <button type="button" className="id-row-main" onClick={() => setLeadSel(l.id)}>
                    <span className="id-row-title">
                      {l.title}
                      {l.fresh && <span className="id-fresh">New</span>}
                    </span>
                    <span className="id-src">
                      <ViaChip v={l.src.via} />
                      <span className="id-src-label">{l.src.label}</span>
                      <span className="id-src-when">{l.src.when}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="id-discard"
                    onClick={() => discardLead(l.id)}
                    aria-label={`Discard lead: ${l.title}`}
                    title="Discard"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {leads.length === 0 && (
                <p className="id-empty">
                  Inbox pruned. Your GINGGA keeps working — new leads land here every morning.
                </p>
              )}
            </>
          )}
        </div>
        {leadUndo && (
          <div className="undo-bar" role="status">
            Lead discarded.{" "}
            <button type="button" onClick={undoDiscard}>
              Undo
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="id-detail">
      <span className="eyebrow">Lead{lead.fresh ? " · New today" : ""}</span>
      <h2 className="heading">{lead.title}</h2>
      <p className="id-src id-src--detail">
        <ViaChip v={lead.src.via} /> {lead.src.label} · {lead.src.when}
      </p>
      <div className="id-body">
        {lead.body.map((p, j) => (
          <p key={j}>{p}</p>
        ))}
      </div>
      <div className="id-facts">
        <div className="id-fact">
          <span className="id-fact-k">Contact</span>
          <p>{lead.contact}</p>
        </div>
        <div className="id-fact">
          <span className="id-fact-k">First touch</span>
          <div className="write-opts">
            {lead.writes.map((w, j) => (
              <button key={j} type="button" className="card write-opt" onClick={() => createOutreach(lead, w)}>
                <span className="write-text">
                  <b>{w.fmt}</b> — {w.who} · <ChanChip p={w.ch} />
                  <span className="write-promise">{w.promise}</span>
                </span>
                <span className="write-go">
                  Draft this <AppIcon name="arrow" size={13} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="id-links">
        <button type="button" className="ctx-toggle" onClick={() => setShowCtx((c) => !c)} aria-expanded={showCtx}>
          {showCtx ? "Hide context" : "More context"}{" "}
          <span className={`ctx-caret${showCtx ? " open" : ""}`}>
            <AppIcon name="chevR" size={12} />
          </span>
        </button>
        <button type="button" className="ctx-toggle" onClick={() => discardLead(lead.id)}>
          Discard lead
        </button>
      </div>
      {showCtx && (
        <div className="id-facts id-facts--ctx">
          <div className="id-fact">
            <span className="id-fact-k">Why GINGGA kept it</span>
            <p>{lead.why}</p>
          </div>
          <div className="id-fact">
            <span className="id-fact-k">Buyer fit</span>
            <p>{lead.fit}</p>
          </div>
        </div>
      )}
    </div>
  );
}
