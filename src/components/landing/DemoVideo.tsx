"use client";

import { useEffect, useRef, useState } from "react";
import type { ResolvedVideo } from "@/lib/video-assets";

/**
 * User-initiated player: never autoplays, shows controls (fullscreen included), loads nothing until pressed
 * and keeps the source's own aspect ratio. Unmounting (e.g. on tab change) stops playback.
 */
export function DemoVideo({ video }: { video: ResolvedVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    return () => {
      el?.pause();
    };
  }, []);

  const ratio = `${video.width} / ${video.height}`;

  if (!video.available || failed) {
    return (
      <div className="demo-video demo-video--empty" style={{ aspectRatio: ratio }} role="group" aria-label={video.title}>
        <p>
          <strong>{video.title}</strong>
          <span>Demo video unavailable. Book a demo to see this workflow live.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="demo-video" style={{ aspectRatio: ratio }}>
      <video
        ref={ref}
        controls
        playsInline
        preload="none"
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={video.title}
        onError={() => setFailed(true)}
      >
        <source src={video.src} type="video/mp4" />
        {video.vtt && <track kind="subtitles" src={video.vtt} srcLang={video.vttLang} label="English" />}
        Your browser does not support embedded video.
      </video>
    </div>
  );
}
