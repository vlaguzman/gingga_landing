import { homeCopy, type Lang } from "@/data/home-copy";
import { demoHref } from "@/lib/demo";

export function HomeHero({ lang }: { lang: Lang }) {
  const { hero } = homeCopy[lang];
  return (
    <section className="section--dark hero hero--home">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="home-eyebrow">{hero.eyebrow}</p>
          <h1>
            <span className="hero__accent">{hero.accent}</span> <span className="hero__rest">{hero.rest}</span>
          </h1>
          <p className="hero__sub">{hero.sub}</p>
          <div className="hero__cta">
            <div className="hero__actions">
              <a className="btn" href={demoHref(undefined, undefined, lang)}>
                {hero.cta}
              </a>
              <a className="btn btn--outline" href="#example">
                {hero.secondary}
              </a>
            </div>
            <p className="hero__service">{hero.audience}</p>
          </div>
        </div>

        <figure className="home-inbox">
          <figcaption className="home-inbox__label">{hero.inboxLabel}</figcaption>
          <ul className="home-inbox__list">
            {hero.ideas.map((idea) => (
              <li key={idea.kind}>
                <span className="home-inbox__kind">{idea.kind}</span>
                <span className="home-inbox__text">{idea.text}</span>
              </li>
            ))}
          </ul>
          <p className="home-inbox__note">{hero.note}</p>
        </figure>
      </div>
    </section>
  );
}
