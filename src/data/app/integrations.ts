import type { IconName } from "./types";

export interface Integration {
  id: string;
  name: string;
  desc: string;
  kind: "oauth" | "key";
  icon: IconName;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "wa",
    name: "WhatsApp Business",
    desc: "Where buyers write to you and where your messages go out, signed by you",
    kind: "oauth",
    icon: "chat",
  },
  {
    id: "meta",
    name: "Meta Lead Ads",
    desc: "Lead forms from your Facebook and Instagram campaigns land here the moment they are filled",
    kind: "oauth",
    icon: "radar",
  },
  {
    id: "instagram",
    name: "Instagram",
    desc: "Direct messages from reels and posts, answered in the same inbox",
    kind: "oauth",
    icon: "radar",
  },
  {
    id: "portal",
    name: "Property portal",
    desc: "Contact forms from your listings on the property portal, captured as new leads",
    kind: "key",
    icon: "db",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "Books showroom visits and video consultations on the advisors’ calendars",
    kind: "oauth",
    icon: "cal",
  },
  {
    id: "crm",
    name: "CRM / Google Sheets",
    desc: "Keeps your CRM or sales sheet in sync — every stage change logged",
    kind: "key",
    icon: "funnel",
  },
];

export const INITIALLY_CONNECTED: Record<string, boolean> = {
  wa: true,
  meta: true,
  instagram: true,
  gcal: true,
  portal: false,
  crm: false,
};
