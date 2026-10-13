"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Deal, DealMessage } from "@/data/app/types";
import { AppIcon } from "./AppIcon";
import { useApp } from "./AppProvider";

export function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** "Aug 20 · 11:02 AM" -> day and time. The mock "today" is Aug 20. */
function splitWhen(when: string): { day: string; time: string } {
  const [day, time = ""] = when.split(" · ");
  return { day, time };
}

function dayLabel(day: string) {
  if (day === "Aug 20") return "Today";
  if (day === "Aug 19") return "Yesterday";
  return day;
}

function Ticks() {
  return (
    <span className="wa-ticks" role="img" aria-label="Read">
      ✓✓
    </span>
  );
}

function Bubble({ m }: { m: DealMessage }) {
  const { time } = splitWhen(m.when);
  return (
    <div className={`wa-msg ${m.dir}`}>
      <p>{m.text}</p>
      <span className="wa-time">
        {time}
        {m.dir === "out" && <Ticks />}
      </span>
    </div>
  );
}

export function DealChat({ deal, infoOpen, onToggleInfo }: { deal: Deal; infoOpen: boolean; onToggleInfo: () => void }) {
  const { sendDealMessage, typingDealId } = useApp();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const typing = typingDealId === deal.id;

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [deal.thread.length, typing]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendDealMessage(deal.id, draft);
    setDraft("");
  };

  let lastDay = "";
  return (
    <section className="wa" aria-label={`WhatsApp chat with ${deal.name}`}>
      <header className="wa-head">
        <span className="wa-avatar" aria-hidden="true">
          {initialsOf(deal.name)}
        </span>
        <div className="wa-who">
          <h3>{deal.name}</h3>
          <p>{typing ? "typing…" : deal.presence}</p>
        </div>
        <button type="button" className="wa-info" onClick={onToggleInfo} aria-expanded={infoOpen} aria-controls="contact-panel">
          <AppIcon name="gear" size={15} /> Contact info
        </button>
      </header>
      <div className="wa-list" ref={listRef} role="log" aria-live="polite" aria-label="Messages">
        {deal.thread.length === 0 && <p className="wa-empty">No messages yet. Say hello below.</p>}
        {deal.thread.map((m, i) => {
          const { day } = splitWhen(m.when);
          const sep = day !== lastDay;
          lastDay = day;
          return (
            <div key={i} className="wa-row">
              {sep && <span className="wa-day">{dayLabel(day)}</span>}
              <Bubble m={m} />
            </div>
          );
        })}
        {typing && (
          <div className="wa-msg in wa-typing" role="status" aria-label={`${deal.name} is typing`}>
            <span className="ty">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>
      <form className="wa-composer" onSubmit={submit}>
        <input
          className="wa-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message"
          aria-label={`Message ${deal.name}`}
          autoComplete="off"
        />
        <button type="submit" className="wa-send" disabled={!draft.trim()} aria-label="Send message">
          <AppIcon name="up" size={16} />
        </button>
      </form>
    </section>
  );
}
