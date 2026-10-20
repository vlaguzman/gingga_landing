"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV, SECTION_LABEL } from "@/data/app/nav";
import { AppIcon } from "./AppIcon";
import { logout } from "@/app/(auth)/login/actions";
import { AppProvider, useApp, type AppUser } from "./AppProvider";
import { ChatPanel } from "./ChatPanel";

const CHAT_MIN = 24;
const CHAT_MAX = 70;

function Shell({ children }: { children: ReactNode }) {
  const { section, user, leads, outreach, deals, leadSel, outSel, dealSel, setLeadSel, setOutSel, setDealSel, clearSelection } =
    useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobNav, setMobNav] = useState(false);
  const [mobChat, setMobChat] = useState(false);
  const [chatW, setChatW] = useState(42);
  const [chatHidden, setChatHidden] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (bottomRef.current && !bottomRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const startDrag = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const row = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!row) return;
    const move = (ev: MouseEvent) => {
      const pct = ((ev.clientX - row.left) / row.width) * 100;
      setChatW(Math.min(CHAT_MAX, Math.max(CHAT_MIN, pct)));
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    document.body.style.cursor = "col-resize";
  };

  // Detail breadcrumb: a record opened inside a section adds one level.
  let crumbHere: string = SECTION_LABEL[section];
  let crumbParent: { label: string; clear: () => void } | null = null;
  if (section === "leads" && leadSel) {
    crumbHere = leads.find((l) => l.id === leadSel)?.title ?? crumbHere;
    crumbParent = { label: "Leads", clear: () => setLeadSel(null) };
  } else if (section === "pipeline" && dealSel) {
    crumbHere = deals.find((d) => d.id === dealSel)?.name ?? crumbHere;
    crumbParent = { label: "Pipeline", clear: () => setDealSel(null) };
  } else if (section === "outreach" && outSel) {
    crumbHere = outreach.find((d) => d.id === outSel)?.title ?? crumbHere;
    crumbParent = { label: "Outreach", clear: () => setOutSel(null) };
  }

  const pick = () => {
    clearSelection();
    setMobNav(false);
  };

  return (
    <div className={`shell${mobChat ? " chat-open" : ""}`}>
      {mobNav && <div className="sb-scrim" onClick={() => setMobNav(false)} aria-hidden="true" />}
      <div className="mob-bar">
        <button type="button" className="mob-btn" onClick={() => setMobNav(true)} aria-label="Open menu">
          <AppIcon name="burger" size={18} />
        </button>
        <div className="mob-crumb">
          <span className="ws-crumb-root">Workspace</span>
          <span className="ws-crumb-sep">
            <AppIcon name="chevR" size={12} />
          </span>
          <span className="ws-crumb-here">{crumbHere}</span>
        </div>
        <button
          type="button"
          className="mob-btn mob-chat-btn"
          onClick={() => setMobChat((c) => !c)}
          aria-label={mobChat ? "Close chat" : "Open chat"}
        >
          <AppIcon name="chat" size={17} />
        </button>
      </div>

      <aside className={`sb${collapsed ? " collapsed" : ""}${mobNav ? " mob-open" : ""}`}>
        <div className="sb-head">
          {!collapsed && (
            <Link className="sb-logo" href="/today-dashboard" onClick={pick} aria-label="GINGGA workspace home">
              <Image src="/assets/logo.png" alt="GINGGA" width={1797} height={307} priority />
            </Link>
          )}
          <button
            type="button"
            className="sb-toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <AppIcon name="panel" />
          </button>
        </div>
        <nav className="sb-nav" aria-label="Workspace">
          {NAV.map((n) => (
            <div key={n.id} className="sb-group">
              {n.dividerBefore && <span className="sb-div" role="presentation" />}
              <Link
                href={n.href}
                className={`sb-item${section === n.id ? " on" : ""}`}
                aria-current={section === n.id ? "page" : undefined}
                title={collapsed ? n.label : undefined}
                onClick={pick}
              >
                <AppIcon name={n.icon} />
                <span className="sb-label">{n.label}</span>
              </Link>
            </div>
          ))}
        </nav>
        <div className="sb-bottom" ref={bottomRef}>
          {menuOpen && (
            <div className="sb-menu">
              <button type="button" onClick={() => setMenuOpen(false)}>
                <AppIcon name="gear" size={15} /> Settings
              </button>
              <hr />
              <form action={logout}>
                <button type="submit">
                  <AppIcon name="exit" size={15} /> Sign out
                </button>
              </form>
            </div>
          )}
          <button
            type="button"
            className="sb-user"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="sb-avatar">{user.initials}</span>
            <span className="sb-user-meta">
              <span className="sb-user-name">{user.name}</span>
              <span className="sb-user-mail">{user.email}</span>
            </span>
            <span className="sb-user-caret">
              <AppIcon name="chevR" size={13} />
            </span>
          </button>
        </div>
      </aside>

      {mobChat && <div className="chat-scrim" onClick={() => setMobChat(false)} aria-hidden="true" />}
      <div className={`work-row${chatHidden ? " chat-hidden" : ""}`}>
        {chatHidden && (
          <button
            type="button"
            className="chat-expand"
            onClick={() => setChatHidden(false)}
            aria-label="Expand chat"
            title="Expand chat with GINGGA"
          >
            <AppIcon name="chat" size={15} />
            <span>Chat</span>
          </button>
        )}
        <ChatPanel width={chatW} onClose={() => setMobChat(false)} onCollapse={() => setChatHidden(true)} />
        <div className="col-resizer" onMouseDown={startDrag} role="separator" aria-orientation="vertical" />
        <section className="ws-col" aria-label={crumbHere}>
          <nav className="ws-crumb" aria-label="Breadcrumb">
            <Link className="ws-crumb-root" href="/today-dashboard" onClick={pick}>
              Workspace
            </Link>
            <span className="ws-crumb-sep">
              <AppIcon name="chevR" size={12} />
            </span>
            {crumbParent ? (
              <>
                <button type="button" className="ws-crumb-root" onClick={crumbParent.clear}>
                  {crumbParent.label}
                </button>
                <span className="ws-crumb-sep">
                  <AppIcon name="chevR" size={12} />
                </span>
                <span className="ws-crumb-here" aria-current="page">
                  {crumbHere}
                </span>
              </>
            ) : (
              <span className="ws-crumb-here" aria-current="page">
                {crumbHere}
              </span>
            )}
          </nav>
          <main className="content">
            <div className="content-inner">{children}</div>
          </main>
        </section>
      </div>
    </div>
  );
}

export function AppShell({ children, user }: { children: ReactNode; user: AppUser }) {
  return (
    <AppProvider user={user}>
      <Shell>{children}</Shell>
    </AppProvider>
  );
}
