"use client";

import { CHATS, CHAT_GROUPS } from "@/data/app/chats";
import { AppIcon } from "../AppIcon";
import { useApp } from "../AppProvider";

export function ChatsView() {
  const { openThread } = useApp();

  return (
    <div>
      <h1 className="pg">Chats</h1>
      <p className="pg-sub">Every conversation with your GINGGA, in one place.</p>
      {CHAT_GROUPS.map((g) => {
        const rows = CHATS.filter((c) => c.group === g);
        if (!rows.length) return null;
        return (
          <section key={g} className="df-group">
            <h2 className="mini-eyebrow">{g}</h2>
            {rows.map((c) => (
              <button key={c.id} type="button" className="card df-row" onClick={() => openThread(c)}>
                <span className="src-ic">
                  <AppIcon name="chat" size={15} />
                </span>
                <span className="df-main">
                  <span className="df-title">{c.title}</span>
                  <span className="meta df-excerpt">{c.snippet}</span>
                </span>
                <span className="df-badge">
                  {c.when} <AppIcon name="chevR" size={13} />
                </span>
              </button>
            ))}
          </section>
        );
      })}
    </div>
  );
}
