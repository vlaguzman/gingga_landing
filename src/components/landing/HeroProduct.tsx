"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/** Milliseconds after the visual becomes visible at which each step is revealed. Total ~8s. */
const STEP_TIMES = [500, 1900, 3300, 4700, 5500, 6300, 7300] as const;
const FINAL_STEP = STEP_TIMES.length;

const FIELDS = [
  { label: "Looking for", value: "Two-bedroom home" },
  { label: "Timeline", value: "Within 3 months" },
  { label: "Preferred channel", value: "WhatsApp" },
] as const;

export function HeroProduct() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(FINAL_STEP);
      return;
    }

    let timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timers = STEP_TIMES.map((ms, i) => window.setTimeout(() => setStep(i + 1), ms));
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const on = (n: number) => (step >= n ? " is-on" : "");

  return (
    <figure className="hero-visual" ref={ref} aria-label="Illustrative example of a lead conversation and summary">
      <div className="hero-visual__glow" aria-hidden="true" />
      <div className="chat hero-visual__chat">
        <div className="chat__head">
          <span className="chat__title">New enquiry</span>
          <span className="chat__channel">WhatsApp</span>
        </div>
        <div className={"bubble bubble--in reveal" + on(1)}>Hi, I saw your listing. Can you tell me more and what happens next?</div>
        <div className={"bubble bubble--out reveal" + on(2)}>Happy to help! What are you looking for, and when would you like to move?</div>
        <div className={"bubble bubble--in reveal" + on(3)}>A two-bedroom home, ideally within 3 months.</div>
      </div>

      <div className={"hero-visual__link" + on(4)} aria-hidden="true" />

      <div className="summary hero-visual__summary">
        <div className="summary__title">Lead summary</div>
        <dl className="summary__grid">
          {FIELDS.map((field, i) => (
            <div key={field.label} className={"reveal" + on(4 + i)}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
        <div className="summary__status">
          <span className={"tag reveal" + on(7)}>
            <Icon name="check" /> Ready for follow-up
          </span>
          <span className={"reveal" + on(7)}>Handed to your team with context</span>
        </div>
      </div>
      <figcaption className="hero-visual__caption">Illustrative example</figcaption>
    </figure>
  );
}
