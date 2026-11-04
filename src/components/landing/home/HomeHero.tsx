import { demoHref } from "@/lib/demo";

const ideas = [
  {
    kind: "Client question",
    text: "Before buying another tool, we need to be clear on the problem.",
  },
  {
    kind: "Shared learning",
    text: "The first AI decision isn't which tool to buy.",
  },
  {
    kind: "Idea out loud",
    text: "Why I stopped writing a new topic list every Monday.",
  },
] as const;

export function HomeHero() {
  return (
    <section className="section--dark hero hero--home">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="home-eyebrow">Your conversations already contain content</p>
          <h1>
            <span className="hero__accent">Give a voice</span>{" "}
            <span className="hero__rest">to your ideas and your experience.</span>
          </h1>
          <p className="hero__sub">
            GINGGA connects to your meeting notes, reading and voice notes, finds the ideas worth sharing and turns them
            into LinkedIn drafts in your own voice.
          </p>
          <div className="hero__cta">
            <div className="hero__actions">
              <a className="btn" href={demoHref()}>
                Book a demo
              </a>
              <a className="btn btn--outline" href="#example">
                See an example
              </a>
            </div>
            <p className="hero__service">For professionals and founders who build a business around their expertise.</p>
          </div>
        </div>

        <figure className="home-inbox">
          <figcaption className="home-inbox__label">Ideas found this week</figcaption>
          <ul className="home-inbox__list">
            {ideas.map((idea) => (
              <li key={idea.kind}>
                <span className="home-inbox__kind">{idea.kind}</span>
                <span className="home-inbox__text">{idea.text}</span>
              </li>
            ))}
          </ul>
          <p className="home-inbox__note">Illustrative example. No real data is processed.</p>
        </figure>
      </div>
    </section>
  );
}
