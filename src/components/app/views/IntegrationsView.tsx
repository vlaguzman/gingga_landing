"use client";

import { useState } from "react";
import { INITIALLY_CONNECTED, INTEGRATIONS } from "@/data/app/integrations";
import { AppIcon } from "../AppIcon";

/** Fake sign-in latency, so the "Signing in…" state is visible in the demo. */
const SIGN_IN_MS = 1600;

export function IntegrationsView() {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [keyFor, setKeyFor] = useState<string | null>(null);
  const [keyVal, setKeyVal] = useState("");
  const [connected, setConnected] = useState<Record<string, boolean>>(INITIALLY_CONNECTED);

  const signIn = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnected((c) => ({ ...c, [id]: true }));
      setConnecting(null);
    }, SIGN_IN_MS);
  };
  const saveKey = (id: string) => {
    if (!keyVal.trim()) return;
    setConnected((c) => ({ ...c, [id]: true }));
    setKeyFor(null);
    setKeyVal("");
  };
  const cancelKey = () => {
    setKeyFor(null);
    setKeyVal("");
  };

  return (
    <div>
      <h1 className="pg">Integrations</h1>
      <span className="eyebrow">Where your leads come from — and where your GINGGA reaches out</span>
      <ul className="sr-list">
        {INTEGRATIONS.map((it) => (
          <li key={it.id} className="card sr-row">
            <span className="src-ic">
              <AppIcon name={it.icon} size={16} />
            </span>
            <div className="sr-main">
              <h2>{it.name}</h2>
              <p>{it.desc}</p>
              {keyFor === it.id && (
                <div className="sr-key">
                  <input
                    className="sr-key-inp"
                    type="password"
                    placeholder="Paste your API key"
                    aria-label={`${it.name} API key`}
                    value={keyVal}
                    onChange={(e) => setKeyVal(e.target.value)}
                    autoFocus
                  />
                  <button type="button" className="pf-act primary" onClick={() => saveKey(it.id)}>
                    Save
                  </button>
                  <button type="button" className="pf-act" onClick={cancelKey}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {connected[it.id] ? (
              <span className="sr-conn-wrap">
                <span className="sr-state">
                  <i />
                  Connected
                </span>
                <button
                  type="button"
                  className="sr-disc"
                  onClick={() => setConnected((c) => ({ ...c, [it.id]: false }))}
                  aria-label={`Disconnect ${it.name}`}
                >
                  Disconnect
                </button>
              </span>
            ) : connecting === it.id ? (
              <span className="sr-state pending" role="status">
                Signing in…
              </span>
            ) : it.kind === "oauth" ? (
              <button type="button" className="sr-connect" onClick={() => signIn(it.id)}>
                Sign in
              </button>
            ) : (
              <button
                type="button"
                className="sr-connect"
                onClick={() => {
                  setKeyFor(it.id);
                  setKeyVal("");
                }}
              >
                Add API key
              </button>
            )}
          </li>
        ))}
      </ul>
      <p className="pf-foot pf-foot--tight">
        Sign-in integrations use OAuth 2.0 — your GINGGA never sees your password. Everything it sends goes out under
        your name, after your approval.
      </p>
    </div>
  );
}
