import { demoHref } from "@/lib/demo";

export function Hero() {
  return (
    <section className="section--dark hero hero--compact">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1>More sales from the leads you already have.</h1>
          <p className="hero__sub">AI agents that respond, qualify and follow up, so you can focus on closing.</p>
          <div className="hero__actions">
            <a className="btn" href={demoHref()}>
              Book a demo
            </a>
            <a className="link-underline" href="#demo">
              See it in action
            </a>
          </div>
          <p className="hero__note">Set up, managed and continuously improved by GINGGA.</p>
        </div>
      </div>
    </section>
  );
}
