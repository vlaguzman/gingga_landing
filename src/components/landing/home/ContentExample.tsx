import { homeCopy, type Lang } from "@/data/home-copy";
import { Icon } from "../Icon";

export function ContentExample({ lang }: { lang: Lang }) {
  const { example } = homeCopy[lang];
  return (
    <section id="example" className="section--dark home-example">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">{example.title}</h2>
          <p className="lead">{example.lead}</p>
        </div>

        <div className="home-example__flow">
          <figure className="home-example__card">
            <figcaption className="home-example__label">{example.callLabel}</figcaption>
            <blockquote>{example.quote}</blockquote>
            <p className="home-example__tag">{example.tag}</p>
          </figure>

          <div className="home-example__arrow" aria-hidden="true">
            <Icon name="arrow" />
          </div>

          <figure className="home-example__card home-example__card--draft">
            <figcaption className="home-example__label">{example.draftLabel}</figcaption>
            <h3>{example.draftTitle}</h3>
            <p>{example.draftText}</p>
          </figure>
        </div>
        <p className="home-example__note">{example.note}</p>
      </div>
    </section>
  );
}
