import type { PlaybookClaim, PlaybookGroup } from "./types";

export const PLAYBOOK_GROUPS: PlaybookGroup[] = ["Who we target", "What works", "Objections", "Process"];

export const PLAYBOOK_CLAIMS: PlaybookClaim[] = [
  {
    id: "i1",
    group: "Who we target",
    claim: "Best fit: buyers with a mortgage pre-approval or a subsidy letter — they decide in weeks, not months.",
    prov: "learned",
    because: "Of the 9 reservations so far, 7 had a pre-approval or subsidy letter before the first visit. Buyers without one often stall at the financing question.",
  },
  {
    id: "i2",
    group: "Who we target",
    claim: "Priority projects this quarter: Altos de Niza and Torres del Parque — the ones with units ready to reserve.",
    prov: "you",
    because: "Because you told us — the sales manager set these projects when the new units opened. Leads for other projects are kept but ranked lower.",
  },
  {
    id: "m1",
    group: "What works",
    claim: "Reply within 5 minutes. Leads answered that fast book a visit three times more often.",
    prov: "learned",
    because: "Across 412 WhatsApp conversations, 41% of leads answered in under 5 minutes booked a visit, against 13% of those answered after an hour.",
  },
  {
    id: "m2",
    group: "What works",
    claim: "Open with the home they asked about and ask one question. Never open with a brochure link.",
    prov: "learned",
    because: "First messages naming the unit type and asking about budget got a 52% reply rate. Messages that opened with a PDF got 19%.",
  },
  {
    id: "o1",
    group: "Objections",
    claim: "“The price is too high” → ask about the monthly budget first, then show the cuota inicial in instalments, never lead with a discount.",
    prov: "learned",
    because: "This objection appeared in 23 conversations. The 14 answered with the instalment plan produced 6 proposals; the ones answered with a discount produced 1.",
  },
  {
    id: "o2",
    group: "Objections",
    claim: "Never promise subsidy or mortgage approval — say “you may qualify” and offer a call with the bank partner.",
    prov: "you",
    because: "Because you told us — approvals depend on the bank and the subsidy entity, and promising them creates complaints later.",
  },
  {
    id: "p1",
    group: "Process",
    claim: "Book a visit, showroom or video call within 48 hours of the first reply. Qualify budget, zone and financing before booking.",
    prov: "you",
    because: "Because you told us — advisors only take visits with a validated budget range, so the assistant asks the three qualification questions first.",
  },
  {
    id: "p2",
    group: "Process",
    claim: "Follow-up cadence: day 0, day 1, day 3 and day 7, then nurturing every three weeks.",
    prov: "learned",
    because: "38% of visits were booked on the day-1 and day-3 follow-ups. After day 7 the reply rate drops below 5%, so those leads move to Nurturing.",
  },
];
