const questions = [
  "Product fit",
  "Pricing",
  "Availability",
  "Requirements",
  "Timelines",
  "How it works",
  "Next steps",
] as const;

const roles = [
  { label: "AI", text: "When speed and repetition matter.", ai: true },
  { label: "Humans", text: "When judgement and trust matter.", ai: false },
] as const;

export function AiHumans() {
  return (
    <section className="section ai-humans">
      <div className="container ai-humans__inner">
        <div className="ai-humans__copy">
          <h2 className="h2">
            AI handles the repetitive work.{" "}
            <span className="soft">Your sales team handles the conversations that matter.</span>
          </h2>
          <p>Prospects often ask the same early-stage questions:</p>
          <ul className="chips" aria-label="Common early-stage questions">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <p>
            GINGGA can manage those interactions, collect context and keep prospects engaged until your team’s expertise
            creates more value.
          </p>
        </div>
        <div className="roles">
          {roles.map(({ label, text, ai }) => (
            <div key={label} className={ai ? "role role--ai" : "role"}>
              <div className="role__label">{label}</div>
              <div className="role__text">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
