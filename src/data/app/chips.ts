import type { ChannelId, StageId, ViaId } from "./types";

/** `tone` maps to a colour modifier in app.css, so chips reuse the landing tokens. */
export const VIA: Record<ViaId, { name: string; tone: string; mark: string }> = {
  meta: { name: "Meta Lead Ads", tone: "soft", mark: "M" },
  instagram: { name: "Instagram", tone: "violet", mark: "IG" },
  portal: { name: "Property portal", tone: "navy", mark: "P" },
  referral: { name: "Referral", tone: "blue", mark: "R" },
  whatsapp: { name: "WhatsApp", tone: "blue", mark: "W" },
};

export const CHAN: Record<ChannelId, { name: string; tone: string; mark: string }> = {
  wa: { name: "WhatsApp", tone: "blue", mark: "W" },
  call: { name: "Call", tone: "violet", mark: "☎" },
};

export const STAGES: Record<StageId, { name: string; hint: string }> = {
  new: {
    name: "New Lead",
    hint: "Lead captured through a form, campaign, referral or WhatsApp. No contact attempt yet.",
  },
  contacting: {
    name: "Contacting",
    hint: "Sales team or AI assistant is attempting contact. Follow-ups are in progress.",
  },
  qualified: {
    name: "Qualified",
    hint: "Budget, preferred location and purchase intention have been validated.",
  },
  visit: {
    name: "Visit Scheduled",
    hint: "A showroom visit, property viewing or video consultation has been booked.",
  },
  proposal: {
    name: "Proposal Sent",
    hint: "Property details, pricing and payment options have been presented.",
  },
  negotiation: {
    name: "Negotiation",
    hint: "Buyer is evaluating financing, discussing conditions or resolving objections.",
  },
  reserved: {
    name: "Reserved",
    hint: "Buyer has paid the reservation deposit and documentation is being processed.",
  },
  won: { name: "Won", hint: "Purchase deed signed and the sale is closed." },
  lost: { name: "Lost", hint: "Buyer went elsewhere or was disqualified. The lost reason is recorded." },
  nurturing: {
    name: "Nurturing",
    hint: "Not ready now. Kept warm with periodic follow-ups and a next-touch date.",
  },
};

/** The active pipeline, left to right. These are the Board columns. */
export const BOARD_STAGES: StageId[] = ["new", "contacting", "qualified", "visit", "proposal", "negotiation", "reserved"];

/** Outcomes that leave the board; each has its own tab. */
export const OUTCOME_STAGES = ["won", "lost", "nurturing"] as const;
export type OutcomeStageId = (typeof OUTCOME_STAGES)[number];
