export type Benefit = { title: string; text: string };

export function BenefitCards({ heading, items }: { heading: string; items: readonly Benefit[] }) {
  return (
    <section className="section">
      <div className="container stack-48">
        <h2 className="h2 section-title">{heading}</h2>
        <ul className="cards">
          {items.map((item) => (
            <li key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
