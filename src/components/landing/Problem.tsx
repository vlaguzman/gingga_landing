import { Icon } from "./Icon";

const leaks = [
  "Slow response",
  "Inconsistent follow-up",
  "Unqualified leads",
  "Missing information",
  "Fragmented data",
  "Sales teams overloaded with repetitive work",
] as const;

export function Problem() {
  return (
    <section className="section">
      <div className="container stack-48 problem">
        <div className="split" style={{ gap: "32px 72px" }}>
          <h2 className="h2">
            You may not need more leads.{" "}
            <span className="soft">You may need to convert more of the ones you already have.</span>
          </h2>
          <div className="lead split__aside">
            <p>Your campaigns are generating leads. Your sales team is speaking with prospects. Your CRM is collecting data.</p>
            <p>
              <strong>But between the first enquiry and the sale, too many prospects disappear.</strong>
            </p>
          </div>
        </div>

        <ul className="leaks">
          {leaks.map((leak) => (
            <li key={leak}>
              <Icon name="drop" />
              <span>{leak}</span>
            </li>
          ))}
        </ul>

        <div className="punchline">
          <div className="punchline__bar" aria-hidden="true"></div>
          <p>Every leak in the funnel is a sale you already paid to acquire.</p>
        </div>
      </div>
    </section>
  );
}
