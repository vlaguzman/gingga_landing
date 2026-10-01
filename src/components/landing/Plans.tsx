import { Icon } from "./Icon";

type Plan = {
  name: string;
  badge?: string;
  description: string;
  amount: string;
  unit?: string;
  fee: { highlight?: string; text: string };
  note: string;
  noteAccent?: boolean;
  cta: { label: string; href: string; cyan?: boolean };
  includesTitle: string;
  features: readonly string[];
  featured?: boolean;
};

const plans: readonly Plan[] = [
  {
    name: "Conversion Intelligence",
    description: "You generate the leads. We turn more of them into sales-ready prospects.",
    amount: "£1,850",
    unit: "/ month",
    fee: { highlight: "+ fee", text: " per sales-ready lead" },
    note: "Advertising and marketing execution not included.",
    cta: { label: "Improve sales conversion", href: "#analyse" },
    includesTitle: "Includes:",
    features: [
      "AI qualification",
      "Conversion logic",
      "Automated follow-up",
      "Managed human-in-the-loop",
      "CRM integration",
      "Funnel measurement and reporting",
      "Experimentation",
      "Continuous conversion optimisation",
      "AI token usage included",
    ],
  },
  {
    name: "Growth & Conversion",
    badge: "Recommended",
    featured: true,
    description: "We run acquisition and conversion as one sales engine.",
    amount: "£3,950",
    unit: "/ month",
    fee: { highlight: "+ fee", text: " per sales-ready lead" },
    note: "Advertising spend funded separately.",
    cta: { label: "Build my sales engine", href: "#analyse", cyan: true },
    includesTitle: "Everything in Conversion Intelligence, plus:",
    features: [
      "Growth strategy",
      "Campaign strategy",
      "Paid media management",
      "Acquisition optimisation",
      "Weekly campaign iteration",
      "Creative concepts",
      "Creative strategy and content creation",
      "Scripts",
      "Content coordination",
    ],
  },
  {
    name: "Growth & Scale",
    description: "A dedicated team for higher volume and faster testing.",
    amount: "Let’s talk",
    fee: { text: "Custom pricing for businesses ready to scale" },
    note: "Advertising spend can be included in your plan.",
    noteAccent: true,
    cta: { label: "Talk to us about scale", href: "https://wa.me/447551273933" },
    includesTitle: "Everything in Growth & Conversion, plus:",
    features: [
      "Dedicated growth execution team",
      "Full content production",
      "Higher campaign volume",
      "Continuous creative testing",
      "Advanced funnel optimisation",
      "Faster experimentation cycles",
      "Strategic growth management",
    ],
  },
];

export function Plans() {
  return (
    <section id="plans" className="section plans">
      <div className="container stack-48">
        <div className="plans__head">
          <h2 className="h2">Start with conversion. Add acquisition when you need it.</h2>
          <p className="lead">Three plans, from running your conversion layer to operating your whole sales engine.</p>
        </div>

        <div className="plans__grid">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <p className="plans__footnote">
          A sales-ready lead is a qualified prospect handed to your team with full context. AI token usage is included in every plan.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { name, badge, description, amount, unit, fee, note, noteAccent, cta, includesTitle, features, featured } = plan;
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
      <div className="plan__price">
        <div className="plan__amount">
          <strong>{amount}</strong>
          {unit && <span>{unit}</span>}
        </div>
        <div className="plan__fee">
          {fee.highlight && <b>{fee.highlight}</b>}
          {fee.text}
        </div>
      </div>
      <div className={noteAccent ? "plan__note plan__note--accent" : "plan__note"}>{note}</div>
      <a className={cta.cyan ? "btn btn--plan btn--cyan" : "btn btn--plan"} href={cta.href}>
        {cta.label}
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
