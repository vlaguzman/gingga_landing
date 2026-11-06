import Image from "next/image";
import { homeCopy, type Lang } from "@/data/home-copy";

type Logo = { src: string; width: number; height: number; wordmark?: boolean };

/** Official brand assets in public/assets/logos. Wordmarks already contain the name, so the text is visually hidden. */
const LOGOS: Record<string, Logo> = {
  Fathom: { src: "/assets/logos/fathom.svg", width: 166, height: 25, wordmark: true },
  Fireflies: { src: "/assets/logos/fireflies.svg", width: 24, height: 24 },
  Granola: { src: "/assets/logos/granola.png", width: 550, height: 550 },
  "Microsoft Teams": { src: "/assets/logos/microsoft-teams.svg", width: 24, height: 24 },
  "Read AI": { src: "/assets/logos/read-ai.svg", width: 1917, height: 580, wordmark: true },
  Readwise: { src: "/assets/logos/readwise.webp", width: 80, height: 80 },
  "Wispr Flow": { src: "/assets/logos/wispr-flow.svg", width: 446, height: 125, wordmark: true },
};

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
                {group.tools.map((tool) => {
                  const logo = LOGOS[tool];
                  return (
                    <li key={tool} className={logo?.wordmark ? "home-sources__chip--wordmark" : undefined}>
                      {logo && (
                        <Image
                          className="home-sources__logo"
                          src={logo.src}
                          alt=""
                          width={logo.width}
                          height={logo.height}
                        />
                      )}
                      <span className={logo?.wordmark ? "home-sources__name--hidden" : undefined}>{tool}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="home-sources__note">{integrations.note}</p>
      </div>
    </section>
  );
}
