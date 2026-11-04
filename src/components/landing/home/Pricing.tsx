import { homeCopy, type Lang } from "@/data/home-copy";
import { demoHref } from "@/lib/demo";
import { Icon } from "../Icon";

export function Pricing({ lang }: { lang: Lang }) {
  const { pricing } = homeCopy[lang];
  return (
    <section id="pricing" className="section services">
      <div className="container stack-48">
        <div className="plans__head">
          <h2 className="h2 section-title">{pricing.title}</h2>
          <p className="lead">{pricing.lead}</p>
        </div>

        <div className="plans__grid">
          {pricing.tiers.map((tier) => (
            <article key={tier.name} className={tier.featured ? "plan plan--featured" : "plan"}>
              <div className="plan__top">
                <div className="plan__title-row">
                  <h3>{tier.name}</h3>
                  {tier.featured && <div className="badge">{pricing.popular}</div>}
                </div>
                <p className="home-plan__tag">{tier.tag}</p>
                <p className="plan__desc">{tier.tagline}</p>
              </div>
              <div className="plan__price">
                <div className="plan__amount">
                  <strong>{tier.price}</strong>
                  <span>{pricing.perMonth}</span>
                </div>
              </div>
              <a
                className={tier.featured ? "btn btn--plan btn--cyan" : "btn btn--plan"}
                href={demoHref(undefined, tier.name, lang)}
              >
                {tier.cta}
              </a>
              <div className="plan__includes">
                <div className="plan__includes-title">{tier.includesTitle}</div>
                <ul className="checks">
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <Icon name="check" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="services__note home-pricing__compare">{pricing.compare}</p>
      </div>
    </section>
  );
}
