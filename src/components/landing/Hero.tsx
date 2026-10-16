import { demoHref } from "@/lib/demo";
import { HeroVideo } from "./HeroVideo";
import { Icon } from "./Icon";

export function Hero() {
  return (
    <section className="section--dark hero hero--home">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1>
            <span className="hero__accent">More sales.</span> <span className="hero__rest">From the leads you already have.</span>
          </h1>
          <p className="hero__sub">AI agents that respond, qualify and follow up, so you can focus on closing.</p>
          <div className="hero__cta">
            <div className="hero__actions">
              <a className="btn" href={demoHref()}>
                Book a demo
              </a>
              <a className="btn btn--outline" href="#demo">
                <Icon name="play" />
                See it in action
              </a>
            </div>
            <p className="hero__service">Set up and managed for you.</p>
          </div>
        </div>
        <HeroVideo />
      </div>
    </section>
  );
}
