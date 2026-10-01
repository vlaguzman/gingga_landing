import type { CSSProperties } from "react";

type Stage = { label: string; width: string; bg: string; fg?: string };

const stages: readonly Stage[] = [
  { label: "Ad spend", width: "100%", bg: "#0047ff", fg: "#fff" },
  { label: "Leads", width: "89%", bg: "#2b4cf6", fg: "#fff" },
  { label: "Qualified leads", width: "78%", bg: "#4a55ee", fg: "#fff" },
  { label: "Sales-ready prospects", width: "67%", bg: "#a47cff" },
  { label: "Opportunities", width: "56%", bg: "#bf86ff" },
  { label: "Closed sales", width: "45%", bg: "#96f2f7" },
];

const metrics = [
  "Cost per stage",
  "Conversion rate per stage",
  "Response time",
  "Human intervention",
  "Cost per acquisition",
  "Sales generated",
] as const;

function stageStyle({ width, bg, fg }: Stage): CSSProperties {
  return { "--w": width, "--bg": bg, ...(fg ? { "--fg": fg } : {}) } as CSSProperties;
}

export function Measure() {
  return (
    <section id="measure" className="section">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">One sales funnel. One set of numbers.</h2>
          <p className="lead">Instead of measuring campaigns separately from sales, connect the entire journey.</p>
        </div>
        <div className="measure__body">
          <ol className="funnel" aria-label="Funnel stages from ad spend to closed sales">
            {stages.map((stage) => (
              <li key={stage.label} style={stageStyle(stage)}>
                {stage.label}
              </li>
            ))}
          </ol>
          <div className="metrics">
            <div className="metrics__title">Across the funnel, GINGGA measures:</div>
            <ul className="metrics__grid">
              {metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
            <div className="callout">We optimise marketing against sales outcomes — not lead volume.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
