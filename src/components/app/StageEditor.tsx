"use client";

import { useState, useTransition } from "react";
import { renameStage } from "@/app/(app)/pipeline/actions";
import type { PipelineStage } from "@/data/app/stages";

function StageRow({ stage }: { stage: PipelineStage }) {
  const [name, setName] = useState(stage.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const dirty = name.trim() !== stage.name;

  const save = () => {
    if (!dirty) return;
    start(async () => {
      const res = await renameStage(stage.id, name);
      if (res.ok) setError(null);
      else setError(res.error);
    });
  };

  return (
    <li className="se-row">
      <label className="se-field">
        <span className="se-kind">{stage.kind === "open" ? "Board column" : `Outcome · ${stage.kind}`}</span>
        <input
          className="se-input"
          value={name}
          maxLength={40}
          disabled={pending}
          aria-label={`Name for ${stage.name}`}
          aria-invalid={error ? true : undefined}
          onChange={(e) => setName(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setName(stage.name);
              setError(null);
            }
          }}
        />
      </label>
      {error && (
        <p className="se-error" role="alert">
          {error}
        </p>
      )}
    </li>
  );
}

export function StageEditor({ stages }: { stages: PipelineStage[] }) {
  return (
    <section className="se" aria-label="Edit stages">
      <p className="po-hint">Rename the stages of your pipeline. Changes save when you leave the field or press Enter.</p>
      <ul className="se-list">
        {stages.map((s) => (
          // Keyed by name too, so the field resets to the saved value after a server refresh.
          <StageRow key={`${s.id}:${s.name}`} stage={s} />
        ))}
      </ul>
    </section>
  );
}
