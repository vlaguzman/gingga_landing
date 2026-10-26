"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { renameStage, reorderStages } from "@/app/(app)/pipeline/actions";
import type { PipelineLead, PipelineStage } from "@/data/app/stages";
import { AppIcon } from "./AppIcon";
import { LeadCard } from "./LeadCard";

function ColumnName({ stage, onDone }: { stage: PipelineStage; onDone: () => void }) {
  const [name, setName] = useState(stage.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const save = () => {
    if (name.trim() === stage.name) return onDone();
    start(async () => {
      const res = await renameStage(stage.id, name);
      if (res.ok) onDone();
      else setError(res.error);
    });
  };

  return (
    <>
      <input
        className="kb-name-input"
        value={name}
        autoFocus
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
            onDone();
          }
        }}
      />
      {error && (
        <p className="se-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

/** Board columns for the open stages. Double-click a name to rename it; drag a header (or use ← →) to reorder. */
export function KanbanBoard({
  stages,
  leads,
  onSel,
}: {
  stages: PipelineStage[];
  leads: PipelineLead[];
  onSel: (id: string) => void;
}) {
  const [ids, setIds] = useOptimistic(stages.map((s) => s.id));
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();
  const dragId = useRef<string | null>(null);
  const byId = new Map(stages.map((s) => [s.id, s]));

  const move = (id: string, to: number) => {
    const from = ids.indexOf(id);
    if (from < 0 || to < 0 || to >= ids.length || from === to) return;
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, id);
    setError(null);
    start(async () => {
      setIds(next);
      const res = await reorderStages(next);
      if (!res.ok) setError(res.error);
    });
  };

  return (
    <>
      {error && (
        <p className="se-error" role="alert">
          {error}
        </p>
      )}
      <div className="kb">
        {ids.map((id, index) => {
          const s = byId.get(id);
          if (!s) return null;
          const rows = leads.filter((l) => l.stageId === id);
          return (
            <section
              key={id}
              className="kb-col"
              aria-label={s.name}
              onDragOver={(e) => dragId.current && e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId.current) move(dragId.current, index);
                dragId.current = null;
              }}
            >
              <div
                className="kb-head"
                title={s.hint}
                draggable={editing !== id}
                onDragStart={(e) => {
                  dragId.current = id;
                  e.dataTransfer?.setData("text/plain", id);
                }}
                onDragEnd={() => {
                  dragId.current = null;
                }}
              >
                <div className="kb-head-row">
                  {editing === id ? (
                    <ColumnName stage={s} onDone={() => setEditing(null)} />
                  ) : (
                    <span className="role-chip role-chip--open kb-name" onDoubleClick={() => setEditing(id)}>
                      {s.name}
                    </span>
                  )}
                  <span className="kb-n">{rows.length}</span>
                </div>
                <div className="kb-tools">
                  <button type="button" aria-label={`Rename ${s.name}`} onClick={() => setEditing(id)}>
                    <AppIcon name="pen" size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${s.name} left`}
                    disabled={index === 0}
                    onClick={() => move(id, index - 1)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${s.name} right`}
                    disabled={index === ids.length - 1}
                    onClick={() => move(id, index + 1)}
                  >
                    →
                  </button>
                </div>
                <p className="kb-hint">{s.hint}</p>
              </div>
              <div className="kb-cards">
                {rows.map((l) => (
                  <LeadCard key={l.id} lead={l} onSel={onSel} />
                ))}
                {rows.length === 0 && <div className="kb-empty">Nothing here yet</div>}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
