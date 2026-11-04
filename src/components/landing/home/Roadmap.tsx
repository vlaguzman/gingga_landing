import Link from "next/link";
import { homeCopy, type Lang } from "@/data/home-copy";
import { CRM_PATH } from "@/lib/demo";

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
            <span className="badge">{vision.today}</span>
            <h3>{vision.todayTitle}</h3>
          </div>
          <div className="home-vision__next">
            <span className="home-vision__soon">{vision.soon}</span>
            <ol className="home-vision__loop">
              {vision.loop.map((step, i) => (
                <li key={step.title}>
                  <span className="home-vision__num">{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="home-vision__crm">
          {vision.crmPrefix} <Link href={CRM_PATH}>{vision.crmLink}</Link>.
        </p>
      </div>
    </section>
  );
}
