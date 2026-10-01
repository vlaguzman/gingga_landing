import { Icon } from "./Icon";

const rows = [
  { without: "Sales manually contacts every lead.", with: "Every lead receives a fast response." },
  { without: "Response times vary.", with: "Qualification begins immediately." },
  { without: "Follow-up depends on individual reps.", with: "Follow-up runs automatically." },
  { without: "Teams repeat the same questions.", with: "Prospects arrive with context." },
  { without: "Unqualified leads consume time.", with: "Sales focuses on higher-intent prospects." },
  { without: "Marketing optimises around lead volume.", with: "Marketing can optimise against sales outcomes." },
] as const;

export function Compare() {
  return (
    <section className="section">
      <div className="container stack-48">
        <h2 className="h2" style={{ maxWidth: 820 }}>
          Give your sales team better conversations, not more admin.
        </h2>
        <div className="compare" role="table" aria-label="Sales without and with GINGGA">
          <div className="compare__row" role="row">
            <div className="compare__cell compare__cell--head" role="columnheader">
              Without GINGGA
            </div>
            <div className="compare__cell compare__cell--with compare__cell--head" role="columnheader">
              With GINGGA
            </div>
          </div>
          {rows.map((row) => (
            <div className="compare__row" role="row" key={row.without}>
              <div className="compare__cell" role="cell">
                {row.without}
              </div>
              <div className="compare__cell compare__cell--with" role="cell">
                <Icon name="check" />
                <span>{row.with}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
