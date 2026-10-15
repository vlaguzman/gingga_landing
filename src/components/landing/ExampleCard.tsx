import type { ReactNode } from "react";

type Field = { label: string; value: string };

/** Lead/application/buyer card built from the existing .summary pattern. Always labelled as an example. */
export function ExampleCard({
  title,
  fields,
  footer,
  tag,
}: {
  title: string;
  fields: readonly Field[];
  footer?: ReactNode;
  tag?: string;
}) {
  return (
    <figure className="lead-card">
      <figcaption className="lead-card__label">Example data. Fictional prospect, not a real client.</figcaption>
      <div className="summary lead-card__body">
        <div className="lead-card__head">
          <div className="summary__title">{title}</div>
          {tag && <span className="tag">{tag}</span>}
        </div>
        <dl className="summary__grid lead-card__grid">
          {fields.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        {footer && <div className="summary__status">{footer}</div>}
      </div>
    </figure>
  );
}

export type ChatLine = { from: "in" | "out"; text: string };

export function ChatExcerpt({ title, channel, lines }: { title: string; channel: string; lines: readonly ChatLine[] }) {
  return (
    <figure className="chat chat--excerpt">
      <figcaption className="lead-card__label lead-card__label--dark">Example conversation</figcaption>
      <div className="chat__head">
        <div className="chat__title">{title}</div>
        <div className="chat__channel">{channel}</div>
      </div>
      {lines.map((l, i) => (
        <div key={i} className={l.from === "in" ? "bubble bubble--in" : "bubble bubble--out"}>
          {l.text}
        </div>
      ))}
    </figure>
  );
}
