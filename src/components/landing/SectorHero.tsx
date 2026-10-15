import { demoHref, SECTORS, type SectorId } from "@/lib/demo";
import type { ResolvedVideo } from "@/lib/video-assets";
import { DemoVideo } from "./DemoVideo";

type Props = {
  sector: SectorId;
  title: string;
  lead: string;
  service: string;
  video: ResolvedVideo;
};

export function SectorHero({ sector, title, lead, service, video }: Props) {
  return (
    <section className="section--dark hero hero--sector">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1>{title}</h1>
          <p className="hero__sub">{lead}</p>
          <div className="hero__actions">
            <a className="btn" href={demoHref(sector)}>
              {SECTORS[sector].demoLabel}
            </a>
          </div>
          <p className="hero__note">{service}</p>
        </div>
        <div className="hero__media">
          <DemoVideo video={video} />
          <p className="demo-label">{video.label}</p>
        </div>
      </div>
    </section>
  );
}
