import { homeCopy, type Lang } from "@/data/home-copy";
import { demoHref } from "@/lib/demo";

export function AgencyStrip({ lang }: { lang: Lang }) {
  const { agencies } = homeCopy[lang];
  return (
    <section id="agencies" className="section home-agencies">
      <div className="container home-agencies__inner">
        <div className="home-agencies__copy">
          <h2>{agencies.title}</h2>
          <p>{agencies.text}</p>
        </div>
        <a className="btn btn--plan" href={demoHref(undefined, agencies.topic, lang)}>
          {agencies.cta}
        </a>
      </div>
    </section>
  );
}
