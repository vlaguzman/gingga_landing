const summary = [
  { term: "Need", detail: "Training platform" },
  { term: "Team size", detail: "About 40 staff" },
  { term: "Timing", detail: "Next quarter" },
  { term: "Decision", detail: "Finance director" },
] as const;

export function Hero() {
  return (
    <section className="section--dark hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1>Turn more leads into customers.</h1>
          <p className="hero__sub">
            GINGGA builds and operates AI-powered sales systems that qualify leads, automate follow-up and help your
            sales team close more of the demand you already have — with less manual work.
          </p>
          <div className="hero__actions">
            <a className="btn" href="#analyse">
              Find the leaks in my sales funnel
            </a>
            <a className="link-underline" href="#system">
              See how it works
            </a>
          </div>
          <p className="hero__note">Built for companies that win customers through conversations.</p>
        </div>

        <div className="chat" role="group" aria-label="Example: an inbound lead handled by GINGGA">
          <div className="chat__head">
            <div className="chat__title">New lead</div>
            <div className="chat__channel">via WhatsApp</div>
          </div>
          <div className="bubble bubble--in">Hi! Can I book a demo? We need a training platform for about 40 staff.</div>
          <div className="bubble bubble--out">
            Happy to set that up. When are you hoping to roll it out, and who else is part of the decision?
          </div>
          <div className="bubble bubble--in">Next quarter. I’m leading it — our finance director signs off.</div>
          <div className="summary">
            <div className="summary__title">Lead summary</div>
            <dl className="summary__grid" style={{ margin: 0 }}>
              {summary.map(({ term, detail }) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            <div className="summary__status">
              <div className="tag">Sales-ready</div>
              <span>Demo booked, handed to sales with full context</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
