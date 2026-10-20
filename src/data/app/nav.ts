import type { IconName, SectionId } from "./types";

export interface NavItem {
  id: SectionId;
  href: string;
  label: string;
  icon: IconName;
  /** Visual divider rendered before this item. */
  dividerBefore?: boolean;
}

export const NAV: NavItem[] = [
  { id: "today", href: "/today-dashboard", label: "Today", icon: "sun" },
  { id: "chat", href: "/chats", label: "Chats", icon: "chat" },
  { id: "leads", href: "/leads", label: "Leads", icon: "radar", dividerBefore: true },
  { id: "outreach", href: "/outreach", label: "Outreach", icon: "mail" },
  { id: "pipeline", href: "/pipeline", label: "Pipeline", icon: "funnel" },
  { id: "playbook", href: "/playbook", label: "Playbook", icon: "book" },
  { id: "sources", href: "/integrations", label: "Integrations", icon: "db", dividerBefore: true },
];

export const SECTION_HREF = Object.fromEntries(NAV.map((n) => [n.id, n.href])) as Record<SectionId, string>;

export const SECTION_LABEL = Object.fromEntries(NAV.map((n) => [n.id, n.label])) as Record<SectionId, string>;

/** Fixed "today" for the mock data, so server and client render the same text. */
export const MOCK_TODAY = "Wed, Aug 20";
