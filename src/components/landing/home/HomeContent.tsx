import { DemoCta } from "../DemoCta";
import { homeCopy, type Lang } from "@/data/home-copy";
import { ContentExample } from "./ContentExample";
import { HomeFaq } from "./HomeFaq";
import { HomeHero } from "./HomeHero";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { Integrations } from "./Integrations";
import { Roadmap } from "./Roadmap";
import { StartingPoints } from "./StartingPoints";

/** Whole home page for one language. Wrapped in a lang attribute so /es is announced as Spanish. */
export function HomeContent({ lang }: { lang: Lang }) {
  const { cta } = homeCopy[lang];
  return (
    <div lang={lang === "es" ? "es" : undefined}>
      <HomeHero lang={lang} />
      <HomeHowItWorks lang={lang} />
      <ContentExample lang={lang} />
      <Integrations lang={lang} />
      <StartingPoints lang={lang} />
      <HomeFaq lang={lang} />
      <Roadmap lang={lang} />
      <DemoCta title={cta.title} lead={cta.lead} label={cta.label} lang={lang} />
    </div>
  );
}
