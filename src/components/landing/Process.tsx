import type { CSSProperties } from "react";

const steps = [
  { title: "Diagnose", text: "Map the current sales journey, conversion rates, costs and bottlenecks.", bar: "#0047ff" },
  { title: "Build", text: "Connect CRM, qualification logic, conversations, automation and measurement.", bar: "#4a55ee" },
  { title: "Launch", text: "Start operating with real prospects.", bar: "#8e6bfa" },
  { title: "Optimise", text: "Improve conversations, follow-up, qualification and handoff using actual funnel data.", bar: "#bf86ff" },
  { title: "Scale", text: "Increase volume once the system demonstrates where growth is working.", bar: "#96f2f7" },
] as const;

export function Process() {
  return (
    <section className="section">
      <div className="container stack-48">
        <h2 className="h2">Start with your current funnel.</h2>
        <ol className="steps">
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
