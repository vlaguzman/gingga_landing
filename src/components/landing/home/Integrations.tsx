import { homeCopy, type Lang } from "@/data/home-copy";

export function Integrations({ lang }: { lang: Lang }) {
  const { integrations } = homeCopy[lang];
  return (
    <section id="integrations" className="section">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">{integrations.title}</h2>
          <p className="lead">{integrations.lead}</p>
        </div>
        <div className="home-sources">
          {integrations.groups.map((group) => (
            <div key={group.title} className="home-sources__group">
              <h3>{group.title}</h3>
              <ul className="home-sources__chips">
                {group.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
