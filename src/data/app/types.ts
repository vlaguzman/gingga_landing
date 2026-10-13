export type ViaId = "meta" | "instagram" | "portal" | "referral" | "whatsapp";
export type ChannelId = "wa" | "call";
export type StageId =
  | "new"
  | "contacting"
  | "qualified"
  | "visit"
  | "proposal"
  | "negotiation"
  | "reserved"
  | "won"
  | "lost"
  | "nurturing";

/** Who the buyer is and what they are looking for; shared by leads and deals. */
export interface PersonProfile {
  name: string;
  phone: string;
  email: string;
  /** Where they live today. */
  city: string;
  /** Project and unit of interest. */
  property: string;
  budget: string;
  /** Preferred zone or neighbourhood. */
  zone: string;
  /** Cash, mortgage, subsidy or a mix. */
  financing: string;
  household: string;
  timeline: string;
}

export interface LeadWrite {
  ch: ChannelId;
  fmt: string;
  who: string;
  promise: string;
  /** Draft text created when the user picks this first-touch option. */
  body: string;
}

export interface Lead {
  id: string;
  name: string;
  title: string;
  src: { via: ViaId; label: string; when: string };
  body: string[];
  contact: string;
  why: string;
  fit: string;
  profile: PersonProfile;
  writes: LeadWrite[];
  fresh: boolean;
}

export interface Outreach {
  id: string;
  channel: ChannelId;
  title: string;
  meta: string;
  goal: string;
  to: string;
  body: string;
  /** Draft for a lead that is not in the pipeline yet; approving creates the deal. */
  leadId?: string;
  /** Draft for a deal already in the pipeline; approving adds the message to its chat. */
  dealId?: string;
}

export interface DealMessage {
  ch: ChannelId;
  dir: "in" | "out";
  when: string;
  text: string;
}

export interface Deal extends PersonProfile {
  id: string;
  /** Lead this deal was created from, so a lead never gets two deals. */
  leadId?: string;
  /** What they asked about, in a few words. */
  interest: string;
  /** Where the lead came from, e.g. "Meta Lead Ads". */
  source: string;
  tags: string[];
  /** First contact, display text (mock data, not a Date). */
  firstContact: string;
  notes: string;
  stage: StageId;
  channel: ChannelId;
  /** Presence line under the name in the chat header. */
  presence: string;
  meta: string;
  when?: string;
  last?: string;
  next: string;
  draft?: string;
  thread: DealMessage[];
  /** Canned auto-replies for the chat simulation. */
  replies?: string[];
  activity: [string, string][];
  /** Won: sale price. */
  price?: string;
  /** Won or lost: closing date. */
  closedOn?: string;
  lostReason?: string;
  nextTouch?: string;
  nurtureReason?: string;
}

export type PlaybookGroup = "Who we target" | "What works" | "Objections" | "Process";

export interface PlaybookClaim {
  id: string;
  group: PlaybookGroup;
  claim: string;
  prov: "learned" | "you";
  because: string;
  corrected?: boolean;
}

export type ChatMessage =
  | { role: "title"; text: string; when: string }
  | { role: "user" | "assistant"; text: string }
  | { role: "tool"; id: string; name: string; status: "running" | "done"; detail: string };

export interface ChatThread {
  id: string;
  title: string;
  when: string;
  group: "Today" | "This week" | "Previous weeks";
  snippet: string;
  msgs: ChatMessage[];
}

export type SectionId = "today" | "chat" | "leads" | "outreach" | "pipeline" | "playbook" | "sources";

export type IconName =
  | "sun"
  | "chat"
  | "radar"
  | "mail"
  | "funnel"
  | "book"
  | "db"
  | "pen"
  | "phone"
  | "arrow"
  | "chevR"
  | "burger"
  | "panel"
  | "gear"
  | "exit"
  | "up"
  | "spark"
  | "cal"
  | "check"
  | "copy";
