import type { CSSProperties } from "react";

const steps = [
  { title: "Map", text: "We define your qualification criteria, common questions and handoff points.", bar: "#0047ff" },
  { title: "Launch", text: "We connect your lead sources and set up the agreed workflows.", bar: "#8e6bfa" },
  {
    title: "Improve",
    text: "We review real conversations and funnel progress to improve responses and follow-up.",
    bar: "#96f2f7",
  },
] as const;

export function ManagedService() {
  return (
    <section id="how-it-works" className="section managed">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">Your sales process. Less work to keep it running.</h2>
          <p className="lead">
            GINGGA configures the conversations, connects the workflow and improves the system as you use it.
          </p>
        </div>
        <ol className="steps steps--three">
          {steps.map((step, i) => (
            <li key={step.title} style={{ "--bar": step.bar } as CSSProperties}>
              <div className="steps__bar" aria-hidden="true"></div>
              <div className="steps__num">Step {i + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
