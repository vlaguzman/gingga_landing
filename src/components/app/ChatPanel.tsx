"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { ChatMessage } from "@/data/app/types";
import { AppIcon } from "./AppIcon";
import { useApp } from "./AppProvider";
import { Mark } from "./Mark";

const MAX_INPUT_HEIGHT = 160;

type ToolMessage = Extract<ChatMessage, { role: "tool" }>;

function ToolMsg({ msg }: { msg: ToolMessage }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tool-row">
      <div className="tool-head">
        {msg.status === "running" ? (
          <span className="tool-spin" role="status" aria-label="Running" />
        ) : (
          <span className="tool-check" aria-label="Done">
            ✓
          </span>
        )}
        <span className="tool-name">{msg.name}</span>
        <button type="button" className="tool-more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "hide" : "show more"}
        </button>
      </div>
      {open && <pre className="tool-detail">{msg.detail}</pre>}
    </div>
  );
}

export function ChatPanel({
  width,
  onClose,
  onCollapse,
}: {
  width: number;
  onClose: () => void;
  onCollapse: () => void;
}) {
  const { msgs, send, pillsFor, user } = useApp();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
    el.classList.toggle("scrolls", el.scrollHeight > MAX_INPUT_HEIGHT);
  };

  const submit = (text: string) => {
    if (!text.trim()) return;
    send(text);
    setInput("");
    if (askRef.current) resize(askRef.current);
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    resize(e.target);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const last = msgs[msgs.length - 1];
  const typing = last && (last.role === "user" || (last.role === "tool" && last.status === "running"));

  return (
    <section className="chat-col" style={{ width: `${width}%` }} aria-label="Chat with GINGGA">
      <button type="button" className="chat-close" onClick={onClose} aria-label="Close chat">
        ✕
      </button>
      <button type="button" className="chat-collapse" onClick={onCollapse} aria-label="Collapse chat">
        <AppIcon name="panel" size={16} />
      </button>
      <div className="th-scroll" ref={scrollRef}>
        {msgs.length === 0 ? (
          <div className="th-empty">
            <Mark size={46} />
            <p className="th-empty-h">Your GINGGA is on the case.</p>
            <p className="th-empty-p">
              Ask for a triage, a first message, or a visit slot — the workspace on the right keeps up.
            </p>
          </div>
        ) : (
          <div className="th">
            {msgs.map((m, i) => {
              if (m.role === "title") {
                return (
                  <div key={i} className="th-title">
                    <span>{m.text}</span>
                    <em>{m.when}</em>
                  </div>
                );
              }
              if (m.role === "tool") return <ToolMsg key={m.id} msg={m} />;
              return (
                <div key={i} className={`th-msg ${m.role}`}>
                  <span className="who">{m.role === "user" ? user.initials : <Mark size={16} />}</span>
                  <div className="th-text">
                    <p>{m.text}</p>
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="th-msg assistant th-typing" role="status" aria-label="GINGGA is working">
                <span className="who">
                  <Mark size={16} />
                </span>
                <div>
                  <span className="ty">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="dock">
        <div className="pills">
          {pillsFor().map((p) => (
            <button key={p} type="button" className="app-pill" onClick={() => submit(p)}>
              {p}
            </button>
          ))}
        </div>
        <div className="ask">
          <span className="spark">
            <AppIcon name="spark" />
          </span>
          <textarea
            className="ask-input"
            ref={askRef}
            rows={1}
            value={input}
            placeholder="Ask GINGGA anything…"
            aria-label="Message GINGGA"
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            className="ask-send"
            onClick={() => submit(input)}
            disabled={!input.trim()}
            aria-label="Send"
          >
            <AppIcon name="up" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
