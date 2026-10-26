"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { loadLeadMessages, sendLeadMessage } from "@/app/(app)/pipeline/actions";
import type { PipelineLead, PipelineMessage } from "@/data/app/stages";
import { AppIcon } from "./AppIcon";

export function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function dayLabel(d: Date) {
  const now = new Date();
  if (sameDay(d, now)) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const timeLabel = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

/** The WhatsApp-style conversation panel. Always rendered, even when the lead has no messages yet. */
export function LeadChat({
  lead,
  infoOpen,
  onToggleInfo,
}: {
  lead: PipelineLead;
  infoOpen: boolean;
  onToggleInfo: () => void;
}) {
  const [thread, setThread] = useState<PipelineMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, start] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadLeadMessages(lead.id).then((res) => {
      if (cancelled) return;
      if (res.ok) setThread(res.messages);
      else setError(res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [lead.id]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setError(null);
    start(async () => {
      const res = await sendLeadMessage(lead.id, text);
      if (res.ok) {
        setThread((t) => [...t, res.message]);
        setDraft("");
      } else {
        setError(res.error);
      }
    });
  };

  let lastDay = "";
  return (
    <section className="wa" aria-label={`WhatsApp chat with ${lead.name}`}>
      <header className="wa-head">
        <span className="wa-avatar" aria-hidden="true">
          {initialsOf(lead.name)}
        </span>
        <div className="wa-who">
          <h3>{lead.name}</h3>
          <p>{lead.phone}</p>
        </div>
        <button type="button" className="wa-info" onClick={onToggleInfo} aria-expanded={infoOpen} aria-controls="contact-panel">
          <AppIcon name="gear" size={15} /> Contact info
        </button>
      </header>
      <div className="wa-list" ref={listRef} role="log" aria-live="polite" aria-label="Messages">
        {loading && <p className="wa-empty">Loading messages…</p>}
        {!loading && thread.length === 0 && <p className="wa-empty">No messages yet. Say hello below.</p>}
        {thread.map((m) => {
          const d = new Date(m.createdAt);
          const day = d.toDateString();
          const sep = day !== lastDay;
          lastDay = day;
          return (
            <div key={m.id} className="wa-row">
              {sep && <span className="wa-day">{dayLabel(d)}</span>}
              <div className={`wa-msg ${m.direction === "outbound" ? "out" : "in"}`}>
                <p>{m.text}</p>
                <span className="wa-time">{timeLabel(d)}</span>
              </div>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="se-error wa-error" role="alert">
          {error}
        </p>
      )}
      <form className="wa-composer" onSubmit={submit}>
        <input
          className="wa-input"
          type="text"
          value={draft}
          maxLength={2000}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message"
          aria-label={`Message ${lead.name}`}
          autoComplete="off"
        />
        <button type="submit" className="wa-send" disabled={!draft.trim() || sending} aria-label="Send message">
          <AppIcon name="up" size={16} />
        </button>
      </form>
    </section>
  );
}
