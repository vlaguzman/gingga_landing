import type { CSSProperties } from "react";
import { homeCopy, type Lang } from "@/data/home-copy";

const BARS = ["#0047ff", "#8e6bfa", "#96f2f7"] as const;

export function HomeHowItWorks({ lang }: { lang: Lang }) {
  const { how } = homeCopy[lang];
  return (
    <section id="how-it-works" className="section">
      <div className="container stack-48">
        <h2 className="h2 section-title">{how.title}</h2>
        <ol className="steps steps--three">
          {how.steps.map((step, i) => (
            <li key={step.title} style={{ "--bar": BARS[i] } as CSSProperties}>
              <div className="steps__bar" aria-hidden="true"></div>
              <div className="steps__num">
                {how.stepLabel} {i + 1}
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
