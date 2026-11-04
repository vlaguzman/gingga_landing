import type { CSSProperties } from "react";

const steps = [
  {
    title: "Connect your sources",
    text: "Link the tools where your conversations, notes and reading already live.",
    bar: "#0047ff",
  },
  {
    title: "Ideas appear",
    text: "GINGGA spots the questions, lessons and perspectives that could become content.",
    bar: "#8e6bfa",
  },
  {
    title: "Add your voice",
    text: "Turn an idea into a LinkedIn draft. Edit it, then publish when you're happy.",
    bar: "#96f2f7",
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container stack-48">
        <h2 className="h2 section-title">You don&rsquo;t have to invent a topic every week.</h2>
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
