"use client";

import { useEffect, useRef } from "react";

const SRC = "/assets/hero-chat.mp4";
const POSTER = "/assets/hero-chat-poster.jpg";

/**
 * Short illustrative loop for the hero. Plays once, muted, when it scrolls into view and holds its last frame.
 * The poster is the final frame, so reduced-motion users (and anyone without JS) see the completed state.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        el.play().catch(() => {});
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.pause();
    };
  }, []);

  return (
    <figure className="hero-visual">
      <div className="hero-visual__glow" aria-hidden="true" />
      <div className="hero-visual__frame">
        <video
          ref={ref}
          muted
          playsInline
          preload="auto"
          poster={POSTER}
          width={864}
          height={1080}
          aria-label="Illustrative example: a WhatsApp enquiry fills in a lead's details and moves it to Ready for follow-up on the pipeline"
        >
          <source src={SRC} type="video/mp4" />
        </video>
      </div>
      <figcaption className="hero-visual__caption">Illustrative example</figcaption>
    </figure>
  );
}
