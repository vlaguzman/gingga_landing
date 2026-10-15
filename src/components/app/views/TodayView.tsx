"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_TODAY, SECTION_HREF } from "@/data/app/nav";
import { ATTENTION, KPIS, WEEK_DAYS, type Target } from "@/data/app/today";
import { AppIcon } from "../AppIcon";
import { useApp } from "../AppProvider";

function WeekStrip({ onOpen }: { onOpen: (t: Target) => void }) {
  return (
    <Link
      className="card wk-strip"
      href={SECTION_HREF.pipeline}
      title="Open your pipeline"
      onClick={() => onOpen(["pipeline"])}
    >
      <span className="wk-lbl">Visits this week</span>
      {WEEK_DAYS.map((d, i) => (
        <span key={i} className="wk-day">
          <i className={`wk-dot ${d.st}`}>{d.st === "published" ? "✓" : ""}</i>
          <em>{d.d}</em>
        </span>
      ))}
      <span className="wk-legend">
        <i className="wk-dot published wk-dot--key" /> done <i className="wk-dot scheduled wk-dot--key" /> booked{" "}
        <i className="wk-dot open wk-dot--key" /> open
      </span>
    </Link>
  );
}

export function TodayView() {
  const { user, openRecord } = useApp();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const first = user.name.trim().split(/\s+/)[0] || "there";
  const open = ([section, id]: Target) => openRecord(section, id);
  const live = ATTENTION.filter((a) => !dismissed.includes(a.h));

  return (
    <div>
      <p className="eyebrow">Your day · {MOCK_TODAY}</p>
      <h1 className="pg">Morning, {first}.</h1>
      <p className="pg-sub">
        Overnight, 9 new leads came in (3 worth your time), a buyer is waiting on a mortgage answer, and two visits are
        booked for this week.
      </p>
      <WeekStrip onOpen={open} />
      <ul className="ov-grid">
        {KPIS.map((c) => (
          <li key={c.k}>
            <Link className="card ov-card" href={SECTION_HREF[c.to[0]]} onClick={() => open(c.to)}>
              <span className="ov-n">{c.n}</span>
              <span className="ov-k">{c.k}</span>
              <span className="ov-sub">{c.s}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="attn" aria-labelledby="attn-h">
        <h2 className="mini-eyebrow" id="attn-h">
          Needs your attention
        </h2>
        {live.map((a) => (
          <div key={a.h} className="card attn-row">
            <Link className="attn-link" href={SECTION_HREF[a.to[0]]} onClick={() => open(a.to)}>
              <span className="attn-ic">
                <AppIcon name={a.icon} />
              </span>
              <div className="attn-text">
                <h3>{a.h}</h3>
                <p>{a.p}</p>
              </div>
              <span className="chev">
                <AppIcon name="chevR" size={15} />
              </span>
            </Link>
            <button
              type="button"
              className="attn-later"
              title="Not today"
              aria-label={`Dismiss: ${a.h}`}
              onClick={() => setDismissed((d) => [...d, a.h])}
            >
              ×
            </button>
          </div>
        ))}
        {live.length === 0 && <p className="attn-clear">All clear. Nothing waiting on you.</p>}
      </section>
    </div>
  );
}
