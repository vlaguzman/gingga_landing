import { homeCopy, type Lang } from "@/data/home-copy";

export function StartingPoints({ lang }: { lang: Lang }) {
  const { points } = homeCopy[lang];
  return (
    <section className="section home-points">
      <div className="container stack-48">
        <h2 className="h2 section-title">{points.title}</h2>
        <ul className="cards">
          {points.items.map((point) => (
            <li key={point.title} className="feature-card">
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
