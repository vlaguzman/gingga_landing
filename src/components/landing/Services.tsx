import { demoHref } from "@/lib/demo";
import { Icon } from "./Icon";

type Tier = {
  name: string;
  description: string;
  price?: { amount: string; prefix?: string; unit?: string };
  cta: string;
  includesTitle: string;
  features: readonly string[];
  badge?: string;
  featured?: boolean;
};

const tiers: readonly Tier[] = [
  {
    name: "Convert",
    description: "Handle incoming enquiries.",
    price: { amount: "£470", prefix: "from", unit: "/ month" },
    cta: "Discuss Convert",
    includesTitle: "Includes:",
    features: ["AI responses", "Initial qualification", "Handoff with context"],
  },
  {
    name: "Optimise",
    description: "Keep opportunities moving.",
    price: { amount: "£780", prefix: "from", unit: "/ month" },
    cta: "Discuss Optimise",
    includesTitle: "Everything in Convert, plus:",
    features: [
      "Automated follow-up",
      "WhatsApp assistant for updates and delegated tasks",
      "Ongoing optimisation",
    ],
    badge: "Recommended",
    featured: true,
  },
  {
    name: "Scale",
    description: "Bring acquisition and conversion together.",
    price: { amount: "Let’s talk" },
    cta: "Discuss Scale",
    includesTitle: "Everything in Optimise, plus:",
    features: ["Marketing and content execution tailored to your growth plan"],
  },
];

export function Services() {
  return (
    <section id="services" className="section services">
      <div className="container stack-48">
        <div className="plans__head">
          <h2 className="h2 section-title">Choose the support your sales process needs.</h2>
        </div>

        <div className="plans__grid">
          {tiers.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>

        <p className="services__note">
          Automated follow-up and delegated tasks are available in Optimise and Scale. Integrations and scope are agreed
          before launch.
        </p>
      </div>
    </section>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const { name, badge, description, price, cta, includesTitle, features, featured } = tier;
  return (
    <article className={featured ? "plan plan--featured" : "plan"}>
      <div className="plan__top">
        {badge ? (
          <div className="plan__title-row">
            <h3>{name}</h3>
            <div className="badge">{badge}</div>
          </div>
        ) : (
          <h3>{name}</h3>
        )}
        <p className="plan__desc">{description}</p>
      </div>
      {price && (
        <div className="plan__price">
          {price.prefix && <span className="plan__from">{price.prefix}</span>}
          <div className="plan__amount">
            <strong>{price.amount}</strong>
            {price.unit && <span>{price.unit}</span>}
          </div>
        </div>
      )}
      <a className={featured ? "btn btn--plan btn--cyan" : "btn btn--plan"} href={demoHref(undefined, name)}>
        {cta}
      </a>
      <div className="plan__includes">
        <div className="plan__includes-title">{includesTitle}</div>
        <ul className="checks">
          {features.map((feature) => (
            <li key={feature}>
              <Icon name="check" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
