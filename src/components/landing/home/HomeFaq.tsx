import { homeCopy, type Lang } from "@/data/home-copy";

export function HomeFaq({ lang }: { lang: Lang }) {
  const { faq } = homeCopy[lang];
  return (
    <section id="faq" className="section home-faq">
      <div className="container home-faq__inner">
        <h2 className="h2">{faq.title}</h2>
        <div className="home-faq__list">
          {faq.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
