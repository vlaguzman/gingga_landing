const questions = [
  {
    q: "Do I need a business already running?",
    a: "No. You can start from your professional experience while you explore a business of your own.",
  },
  {
    q: "What can I do at the start?",
    a: "Create LinkedIn content from your conversations, notes and reading. WhatsApp, Instagram and managed conversations are next steps, not part of today's product.",
  },
  {
    q: "Does publishing content validate my idea?",
    a: "Publishing can open conversations. To validate an offer, you still need to check that it solves a need someone is willing to pay for.",
  },
] as const;

export function HomeFaq() {
  return (
    <section id="faq" className="section home-faq">
      <div className="container home-faq__inner">
        <h2 className="h2">Before you start</h2>
        <div className="home-faq__list">
          {questions.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
