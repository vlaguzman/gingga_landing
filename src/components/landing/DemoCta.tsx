import Image from "next/image";
import { demoHref, SECTORS, type SectorId } from "@/lib/demo";

type Props = {
  sector?: SectorId;
  title: string;
  lead: string;
  label?: string;
};

export function DemoCta({ sector, title, lead, label }: Props) {
  return (
    <section id="book-a-demo" className="section--dark cta">
      <div className="container cta__inner">
        <div className="cta__copy">
          <h2>{title}</h2>
          <p className="cta__lead">{lead}</p>
          <div>
            <a className="btn" href={demoHref(sector)}>
              {label ?? (sector ? SECTORS[sector].demoLabel : "Book a demo")}
            </a>
          </div>
        </div>
        <div className="cta__mark" aria-hidden="true">
          <Image src="/assets/mark.png" alt="" width={605} height={425} />
        </div>
      </div>
    </section>
  );
}
