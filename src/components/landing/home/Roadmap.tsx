import Link from "next/link";
import { homeCopy, type Lang } from "@/data/home-copy";
import { CRM_PATH } from "@/lib/demo";
import { Icon } from "../Icon";

export function Roadmap({ lang }: { lang: Lang }) {
  const { vision } = homeCopy[lang];
  return (
    <section id="vision" className="section home-vision">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">{vision.title}</h2>
          <p className="lead">{vision.lead}</p>
        </div>

        <div className="home-vision__grid">
          <div className="home-vision__now">
            <span className="badge">{vision.todayLabel}</span>
            <ul className="home-vision__today">
              {vision.today.map((item) => (
                <li key={item.title}>
                  <Icon name="check" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="home-vision__next">
            <span className="home-vision__soon">{vision.nextLabel}</span>
            <ol className="home-vision__loop">
              {vision.next.map((item, i) => (
                <li key={item.title}>
                  <span className="home-vision__num">{i + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.crm && (
                      <p>
                        <Link href={CRM_PATH}>{vision.crmLink}</Link>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
