import type { ReactNode } from "react";
import { Icon } from "./Icon";

type Step = {
  title: string;
  text: string;
  variant?: "connect" | "handoff" | "learn";
};

const steps: readonly Step[] = [
  { title: "Attract", text: "Generate leads through your existing acquisition channels — or let GINGGA operate campaigns for you." },
  { title: "Respond", text: "Engage every lead instantly instead of waiting for manual follow-up." },
  { title: "Understand", text: "Identify need, budget, timing, intent and relevant context." },
  { title: "Qualify", text: "Separate high-intent prospects from leads that need more nurturing." },
  { title: "Nurture", text: "Automate personalised follow-up and keep prospects moving." },
  { title: "Prepare", text: "Collect the information your team needs before a salesperson steps in." },
  { title: "Connect", text: "Sync conversations, qualification data and status into the CRM.", variant: "connect" },
  { title: "Hand off", text: "Send your sales team prospects who are ready for a meaningful conversation.", variant: "handoff" },
  { title: "Learn", text: "Feed sales outcomes back into the system.", variant: "learn" },
];

const legend = [
  { label: "GINGGA operates", color: "var(--blue-soft)" },
  { label: "Handoff to your sales team", color: "var(--cyan)" },
  { label: "Outcomes feed back into the system", color: "var(--violet)" },
] as const;

const loop = ["Measure", "Learn", "Improve", "Scale"] as const;

export function System() {
  return (
    <section id="system" className="section section--dark">
      <div className="container system__inner">
        <div className="system__intro">
          <h2 className="h2">From first enquiry to sales-ready prospect.</h2>
          <p className="lead">
            One continuous sales system. GINGGA operates every stage up to the handoff, then learns from what happens after it.
          </p>
          <ul className="legend">
            {legend.map(({ label, color }) => (
              <li key={label}>
                <i style={{ background: color }}></i>
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <div className="loop">
            {loop.map((label, i) => (
              <LoopItem key={label} label={label} isFirst={i === 0} isFinal={i === loop.length - 1} />
            ))}
          </div>
        </div>

        <ol className="timeline">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li key={step.title} className={step.variant ? `is-${step.variant}` : undefined}>
                <div className="timeline__rail" aria-hidden="true">
                  <div className="timeline__dot"></div>
                  {!isLast && <div className="timeline__line"></div>}
                </div>
                <div className="timeline__body">
                  <div className="timeline__num">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function LoopItem({ label, isFirst, isFinal }: { label: ReactNode; isFirst: boolean; isFinal: boolean }) {
  return (
    <>
      {!isFirst && <Icon name="arrow" />}
      <div className={isFinal ? "pill pill--final" : "pill"}>{label}</div>
    </>
  );
}
