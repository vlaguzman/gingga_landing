"use client";

import { useEffect, useRef, useState } from "react";
import { CHAN } from "@/data/app/chips";
import type { Outreach } from "@/data/app/types";
import { AppIcon } from "../AppIcon";
import { useApp } from "../AppProvider";
import { ChanChip } from "../Chips";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// The mock "today" is Wed, Aug 20, so the schedule options are stable across renders.
const SCHEDULE_OPTIONS = ["Today · 8:00 AM", "Tomorrow · 8:00 AM", ...[2, 3, 4].map((i) => `${WEEKDAYS[(3 + i) % 7]} ${20 + i} · 8:00 AM`)];

interface MessageCardProps {
  from: string;
  item: Outreach;
  body: string;
  loading: boolean;
  editing: boolean;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
  onSend: (when: string) => void;
}

function MessageCard({ from, item, body, loading, editing, onEdit, onSave, onCancel, onSend }: MessageCardProps) {
  const editRef = useRef<HTMLTextAreaElement>(null);
  const [schedOpen, setSchedOpen] = useState(false);
  const [schedDay, setSchedDay] = useState(0);
  const [copied, setCopied] = useState(false);
  const isCall = item.channel === "call";

  const autosize = () => {
    const el = editRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };
  useEffect(() => {
    if (editing) autosize();
  }, [editing]);

  const copy = () => {
    navigator.clipboard?.writeText(body).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mail-card">
      <dl className="mail-head">
        <div>
          <dt>{isCall ? "Call" : "To"}</dt>
          <dd>{item.to}</dd>
        </div>
        <div>
          <dt>From</dt>
          <dd className="mail-from">
            {from} · via <b>{CHAN[item.channel].name}</b>
          </dd>
        </div>
      </dl>
      <div className="mail-body">
        {loading ? (
          <div className="sk" role="status" aria-label="Drafting">
            <div className="sk-bar" style={{ width: "88%" }} />
            <div className="sk-bar" style={{ width: "72%" }} />
            <div className="sk-bar" style={{ width: "80%" }} />
            <div className="sk-bar" style={{ width: "45%" }} />
          </div>
        ) : editing ? (
          <textarea
            className="mail-edit"
            ref={editRef}
            defaultValue={body}
            onInput={autosize}
            aria-label="Edit draft"
            autoFocus
          />
        ) : (
          body
        )}
      </div>
      <div className="mail-stats">
        {editing
          ? "Editing — changes save to memory"
          : isCall
            ? "Call script · GINGGA dials and logs the call, you talk"
            : "Draft · nothing goes out without your approval"}
      </div>
      {editing ? (
        <div className="mail-actions mail-actions--edit">
          <button type="button" className="mail-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="mail-save" disabled={loading} onClick={() => onSave(editRef.current?.value ?? body)}>
            Save
          </button>
        </div>
      ) : (
        <div className="mail-actions">
          <button type="button" className="mail-primary" disabled={loading} onClick={() => setSchedOpen((o) => !o)} aria-expanded={schedOpen}>
            <AppIcon name={isCall ? "phone" : "cal"} size={15} /> {isCall ? "Start the call" : "Approve & send"}
          </button>
          <button type="button" onClick={onEdit} disabled={loading}>
            <AppIcon name="pen" size={15} /> Edit
          </button>
          <button type="button" onClick={copy} disabled={loading}>
            <AppIcon name={copied ? "check" : "copy"} size={15} /> {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {schedOpen && !editing && (
        <div className="sched">
          <span className="sched-k">{isCall ? "Call" : "Goes out"}</span>
          {isCall ? (
            <button type="button" className="slot slot-main" disabled={loading} onClick={() => onSend("now")}>
              Dial now
            </button>
          ) : (
            <>
              <select
                className="slot slot-sel"
                value={schedDay}
                onChange={(e) => setSchedDay(Number(e.target.value))}
                aria-label="When"
              >
                {SCHEDULE_OPTIONS.map((l, i) => (
                  <option key={l} value={i}>
                    {l}
                  </option>
                ))}
              </select>
              <button type="button" className="slot slot-main" disabled={loading} onClick={() => onSend(SCHEDULE_OPTIONS[schedDay])}>
                Send
              </button>
            </>
          )}
          <button type="button" className="sched-cancel" onClick={() => setSchedOpen(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export function OutreachView() {
  const { outreach, outSel, setOutSel, bodies, outLoading, editing, setEditing, saveEdit, sendOutreach, user } =
    useApp();
  const item = outreach.find((d) => d.id === outSel);

  if (!item) {
    return (
      <div>
        <h1 className="pg">Outreach</h1>
        <span className="eyebrow">Drafted from your playbook · nothing goes out without your approval</span>
        <ul className="df-list">
          {outreach.map((d) => {
            const preview = (bodies[d.id] || d.body)
              .split("\n")
              .filter((l) => l.trim())
              .slice(0, 2)
              .join(" ");
            const excerpt = preview.length > 120 ? `${preview.slice(0, 120).replace(/\s+\S*$/, "")}…` : preview;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  className="card df-row"
                  onClick={() => {
                    setOutSel(d.id);
                    setEditing(false);
                  }}
                >
                  <span className="src-ic">
                    <AppIcon name={d.channel === "call" ? "phone" : "mail"} size={15} />
                  </span>
                  <span className="df-main">
                    <span className="df-title">{d.title}</span>
                    <span className="meta df-excerpt">{excerpt}</span>
                  </span>
                  <span className="df-badge">
                    <ChanChip p={d.channel} /> <AppIcon name="chevR" size={13} />
                  </span>
                </button>
              </li>
            );
          })}
          {outreach.length === 0 && <li className="id-empty">No drafts waiting. Approved ones move to Pipeline.</li>}
        </ul>
      </div>
    );
  }

  const loading = outLoading === item.id;
  const bodyNow = bodies[item.id] || item.body;
  const hook = bodyNow.split("\n").find((l) => l.trim()) ?? "";

  return (
    <div>
      <p className="mini-eyebrow">Outreach · {CHAN[item.channel].name}</p>
      <div className="df-shape">
        {(
          [
            ["Lead", item.meta.replace(/^From: /, ""), 55],
            ["Goal", item.goal, 42],
            ["Hook", `“${hook.length > 90 ? `${hook.slice(0, 90)}…` : hook}”`, 48],
          ] as const
        ).map(([k, v, w]) => (
          <div key={k} className="df-shape-row">
            <span className="id-fact-k">{k}</span>
            {loading ? <div className="sk-bar sk-bar--flat" style={{ width: `${w}%` }} /> : <p>{v}</p>}
          </div>
        ))}
      </div>
      <MessageCard
        from={`${user.name} · GINGGA`}
        item={item}
        body={bodyNow}
        loading={loading}
        editing={editing}
        onEdit={() => setEditing(true)}
        onSave={saveEdit}
        onCancel={() => setEditing(false)}
        onSend={sendOutreach}
      />
    </div>
  );
}
