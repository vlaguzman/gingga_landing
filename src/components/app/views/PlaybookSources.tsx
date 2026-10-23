"use client";

import { useActionState } from "react";
import { uploadSource } from "@/app/(app)/playbook/actions";
import type { PlaybookSourceItem } from "@/data/app/types";

const STATUS_LABEL: Record<PlaybookSourceItem["status"], string> = {
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PlaybookSources({ sources }: { sources: readonly PlaybookSourceItem[] }) {
  const [state, action, pending] = useActionState(uploadSource, {});

  return (
    <section className="pf-group pf-source-group">
      <h2 className="mini-eyebrow">Uploaded sources</h2>
      <div className="card pf-block">
        {sources.length === 0 ? (
          <p className="pf-source-empty">No documents yet. Upload a PDF, TXT or MD file (up to 10 MB).</p>
        ) : (
          <ul className="pf-source-list">
            {sources.map((s) => (
              <li key={s.id} className="pf-source-item">
                <div className="pf-source-main">
                  <span className="pf-source-name">{s.filename}</span>
                  <span className="meta">{formatSize(s.sizeBytes)}</span>
                </div>
                <span className={`pf-source-status pf-source-status--${s.status}`}>{STATUS_LABEL[s.status]}</span>
                {s.status === "failed" && s.errorMessage && <p className="pf-source-error">{s.errorMessage}</p>}
              </li>
            ))}
          </ul>
        )}
        <form action={action} className="pf-source-form">
          <label htmlFor="pf-source-file" className="pf-source-label">
            Choose a document
          </label>
          <input id="pf-source-file" name="file" type="file" accept=".pdf,.txt,.md" />
          <button type="submit" className="pf-act primary" disabled={pending}>
            {pending ? "Uploading…" : "Upload"}
          </button>
        </form>
        {state.error && (
          <p role="alert" className="pf-source-error pf-source-msg">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="meta pf-source-msg">
            {state.success}
          </p>
        )}
      </div>
    </section>
  );
}
