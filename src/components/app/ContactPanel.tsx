"use client";

import type { KeyboardEvent } from "react";
import { STAGES } from "@/data/app/chips";
import type { Deal } from "@/data/app/types";
import { AppIcon } from "./AppIcon";
import { useApp } from "./AppProvider";
import { StageChip } from "./Chips";
import { initialsOf } from "./DealChat";

export function ContactPanel({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const { goTo } = useApp();
  const fields: [string, string][] = [
    ["Phone", deal.phone],
    ["Email", deal.email],
    ["City", deal.city],
    ["Source", deal.source],
    ["First contact", deal.firstContact],
  ];
  const buying: [string, string][] = [
    ["Project / unit", deal.property],
    ["Budget", deal.budget],
    ["Preferred zone", deal.zone],
    ["Financing", deal.financing],
    ["Household", deal.household],
    ["Timeline to buy", deal.timeline],
  ];
  const outcome: [string, string][] = (
    [
      ["Sale price", deal.price],
      ["Closed on", deal.closedOn],
      ["Lost reason", deal.lostReason],
      ["Next touch", deal.nextTouch],
      ["Why nurturing", deal.nurtureReason],
    ] as [string, string | undefined][]
  ).filter((f): f is [string, string] => Boolean(f[1]));
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
            {initialsOf(deal.name)}
          </span>
          <p className="cp-name">{deal.name}</p>
          <p className="cp-interest">{deal.interest}</p>
          <StageChip r={deal.stage} />
          <p className="cp-stage">{STAGES[deal.stage].hint}</p>
        </div>
        <dl className="cp-fields">
          {fields.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <h4 className="cp-h">Looking for</h4>
        <dl className="cp-fields">
          {buying.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {outcome.length > 0 && (
          <>
            <h4 className="cp-h">Outcome</h4>
            <dl className="cp-fields">
              {outcome.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        <h4 className="cp-h">Tags</h4>
        <ul className="cp-tags">
          {deal.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h4 className="cp-h">Notes</h4>
        <p className="cp-text">{deal.notes}</p>
        <h4 className="cp-h">Next step</h4>
        <p className="cp-text">{deal.next}</p>
        {deal.draft && (
          <button type="button" className="btn-ink" onClick={() => goTo("outreach", deal.draft)}>
            Open the draft <AppIcon name="arrow" size={14} />
          </button>
        )}
        <h4 className="cp-h">Activity</h4>
        <ul className="cp-activity">
          {deal.activity.map(([when, what], j) => (
            <li key={j}>
              <span className="act-when">{when}</span>
              <span>{what}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
