import type { IconName, SectionId } from "./types";

/** Navigation target: a section, optionally with a record to open inside it. */
export type Target = [section: SectionId, id?: string];

export interface Kpi {
  n: string;
  k: string;
  s: string;
  to: Target;
}

export interface Attention {
  icon: IconName;
  h: string;
  p: string;
  to: Target;
}

export type VisitDayState = "published" | "scheduled" | "open" | "off";

export const WEEK_DAYS: { d: string; st: VisitDayState }[] = [
  { d: "M", st: "off" },
  { d: "T", st: "off" },
  { d: "W", st: "open" },
  { d: "T", st: "scheduled" },
  { d: "F", st: "scheduled" },
  { d: "S", st: "off" },
  { d: "S", st: "off" },
];

export const KPIS: Kpi[] = [
  {
    n: "9",
    k: "New leads overnight",
    s: "3 came from Meta, Instagram and the portal with a clear project in mind — message the fresh three first",
    to: ["leads"],
  },
  {
    n: "2",
    k: "Visits this week",
    s: "Santiago Osorio Thu 10:00 at the model house · Paola Henao Fri 4:30 PM by video",
    to: ["pipeline", "d6"],
  },
  {
    n: "2",
    k: "Proposals out",
    s: "Julián Pineda and Mónica Quintero are reviewing — one has not replied in 3 days",
    to: ["pipeline", "d8"],
  },
  {
    n: "1",
    k: "Reservations",
    s: "Héctor Bermúdez paid the deposit for House 14 — documents are still pending",
    to: ["pipeline", "d11"],
  },
];

export const ATTENTION: Attention[] = [
  {
    icon: "radar",
    h: "Valentina Ospina asked about Torres del Parque minutes after seeing the ad",
    p: "Leads answered in under 5 minutes book visits three times more often. The first message is drafted.",
    to: ["leads", "l1"],
  },
  {
    icon: "mail",
    h: "Santiago’s visit confirmation needs your approval",
    p: "He comes to Casas del Bosque tomorrow at 10:00 with his wife. A reminder cuts no-shows.",
    to: ["outreach", "o3"],
  },
  {
    icon: "funnel",
    h: "Ricardo Acosta is worried the bank will not approve the full amount",
    p: "He asked what happens if the mortgage covers only 70%. Share the pre-approval checklist before he cools off.",
    to: ["pipeline", "d10"],
  },
  {
    icon: "phone",
    h: "Julián Pineda has not answered the proposal in 3 days",
    p: "He opened it and said he would review it with his partner. A friendly follow-up is ready.",
    to: ["outreach", "o4"],
  },
];
