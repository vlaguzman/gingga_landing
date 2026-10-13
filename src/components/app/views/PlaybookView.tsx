"use client";

import { useState } from "react";
import { PLAYBOOK_GROUPS } from "@/data/app/playbook";
import { useApp } from "../AppProvider";

export function PlaybookView() {
  const { playbookClaims, pbLoadingId, correctClaim, addToPlaybook } = useApp();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <h1 className="pg">Playbook</h1>
      <span className="eyebrow">
        What your GINGGA has learned about selling for you — every line has a source, and you have the final word
      </span>
      <p className="pf-basis">
        Learned from <b>412 WhatsApp conversations</b> · <b>38 visits</b> · <b>9 reservations</b> · <b>3 corrections from you</b>
      </p>
      {PLAYBOOK_GROUPS.map((g) => (
        <section key={g} className="pf-group">
          <h2 className="mini-eyebrow">{g}</h2>
          <div className="card pf-block">
            {playbookClaims
              .filter((c) => c.group === g)
              .map((c) => (
                <div key={c.id} className="pf-claim">
                  {pbLoadingId === c.id ? (
                    <div role="status" aria-label="Saving">
                      <div className="sk-bar sk-bar--lg" style={{ width: "72%" }} />
                      <div className="sk-bar" style={{ width: "34%" }} />
                    </div>
                  ) : (
                    <>
                      <div className="pf-claim-row">
                        <p className="pf-claim-t">{c.claim}</p>
                        <button type="button" className="pf-act" onClick={() => correctClaim(c)}>
                          Correct this in chat
                        </button>
                      </div>
                      {!c.corrected && c.because && (
                        <div className="pf-claim-meta">
                          <button
                            type="button"
                            className="pf-why"
                            onClick={() => setOpen(open === c.id ? null : c.id)}
                            aria-expanded={open === c.id}
                          >
                            {open === c.id ? "Hide" : "Why we think this"}
                          </button>
                        </div>
                      )}
                      {open === c.id && c.because && <p className="pf-because">{c.because}</p>}
                    </>
                  )}
                </div>
              ))}
            <div className="pf-claim pf-add">
              <button type="button" className="pf-add-btn" onClick={() => addToPlaybook(g)}>
                Something your GINGGA should know? Tell it in the chat
              </button>
            </div>
          </div>
        </section>
      ))}
      <p className="pf-foot">
        Your GINGGA writes every message and call script from this playbook. Anything uncorrected is taken as true — fix a line
        and every future draft uses it.
      </p>
    </div>
  );
}
