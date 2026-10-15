"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { SECTORS, type SectorId } from "@/lib/demo";
import { nextTabIndex } from "@/lib/tabs";
import type { ResolvedVideo } from "@/lib/video-assets";
import { DemoVideo } from "./DemoVideo";
import { Icon } from "./Icon";

const ORDER: readonly SectorId[] = ["student-recruitment", "property-sales"];

type Props = {
  videos: Record<SectorId, ResolvedVideo>;
};

export function DemoSelector({ videos }: Props) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const next = nextTabIndex(e.key, index, ORDER.length);
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="demo" className="demo">
      <div className="container demo__inner">
        <div className="demo__head">
          <h2 className="h2">See what happens after a lead comes in.</h2>
          <p className="lead">Explore how GINGGA turns conversations into clear next steps.</p>
        </div>

        <div id="use-cases" className="demo__tabs" role="tablist" aria-label="Choose a workflow demo">
          {ORDER.map((id, i) => (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`demo-tab-${id}`}
              aria-selected={active === i}
              aria-controls={`demo-panel-${id}`}
              tabIndex={active === i ? 0 : -1}
              className="demo__tab"
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {SECTORS[id].label}
            </button>
          ))}
        </div>

        {ORDER.map((id, i) => {
          const video = videos[id];
          const selected = active === i;
          return (
            <div
              key={id}
              role="tabpanel"
              id={`demo-panel-${id}`}
              aria-labelledby={`demo-tab-${id}`}
              hidden={!selected}
              className="demo__panel"
            >
              {selected && (
                <>
                  <div className="demo__stage">
                    <span className="demo-badge">Workflow demo</span>
                    <DemoVideo key={video.src} video={video} />
                  </div>
                  <div className="demo__caption">
                    <p>{video.caption}</p>
                    <Link className="link-underline" href={SECTORS[id].path}>
                      {video.linkLabel}
                      <Icon name="arrow" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
