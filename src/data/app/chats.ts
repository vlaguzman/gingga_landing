import type { ChatThread } from "./types";

export const CHAT_GROUPS = ["Today", "This week", "Previous weeks"] as const;

export const CHATS: ChatThread[] = [
  {
    id: "c1",
    title: "Overnight lead capture",
    when: "6:00 AM",
    group: "Today",
    snippet: "9 new leads — 3 are worth a first message today.",
    msgs: [
      { role: "assistant", text: "Morning run done. I checked Meta Lead Ads, Instagram, the property portal and WhatsApp overnight." },
      {
        role: "tool",
        id: "c1t1",
        name: "capture_leads",
        status: "done",
        detail: "sources: Meta Lead Ads · Instagram · Property portal · WhatsApp\nfound: 9 new contacts\npassed buyer-fit filter: 3",
      },
      {
        role: "tool",
        id: "c1t2",
        name: "save_artifact",
        status: "done",
        detail: "type: lead ×3\nl1: Valentina Ospina (Meta Lead Ads)\nl2: Camilo Restrepo (Instagram)\nl3: Daniela Torres (Property portal)",
      },
      {
        role: "assistant",
        text: "Three worth your time: Valentina Ospina wants a 2-bedroom in Laureles, Camilo Restrepo asked about houses in Casas del Bosque, and Daniela Torres may qualify for the subsidy. They are in your Leads inbox, first messages pre-drafted.",
      },
    ],
  },
  {
    id: "c2",
    title: "First message to Valentina",
    when: "8:41 AM",
    group: "Today",
    snippet: "Drafted the WhatsApp greeting from the Meta form.",
    msgs: [
      { role: "user", text: "Draft the first message to Valentina Ospina" },
      {
        role: "tool",
        id: "c2t1",
        name: "draft_outreach",
        status: "done",
        detail: "lead: l1 · channel: WhatsApp\nplaybook: open with the home they asked about · one question only",
      },
      {
        role: "tool",
        id: "c2t2",
        name: "save_artifact",
        status: "done",
        detail: "id: o1\nartifact_type: outreach · WhatsApp",
      },
      {
        role: "assistant",
        text: "Drafted — it opens with the 2-bedroom she asked about and asks one question about her budget, per your playbook. It is in Outreach waiting for your approval.",
      },
    ],
  },
  {
    id: "c3",
    title: "Visit booked with Santiago Osorio",
    when: "Yesterday",
    group: "This week",
    snippet: "Thursday 10:00 at the Casas del Bosque model house.",
    msgs: [
      { role: "user", text: "Santiago said yes — book the visit" },
      {
        role: "tool",
        id: "c3t1",
        name: "book_meeting",
        status: "done",
        detail: "calendar: Casas del Bosque sales office\nslot: Thu · 10:00 AM\ninvitees: Santiago Osorio (+1)",
      },
      {
        role: "tool",
        id: "c3t2",
        name: "save_artifact",
        status: "done",
        detail: "id: d6\ntype: deal · stage → visit scheduled\nbrief: family of four · budget COP 780–900M · commute and schools",
      },
      {
        role: "assistant",
        text: "Booked — Thursday 10:00 at the model house. I added a brief for the advisor: family of four, budget range, and their two concerns, commute and schools. Santiago moved to Visit Scheduled.",
      },
    ],
  },
  {
    id: "c4",
    title: "Connecting WhatsApp and Meta",
    when: "Aug 3",
    group: "Previous weeks",
    snippet: "Connected WhatsApp Business, Meta Lead Ads and Instagram.",
    msgs: [
      { role: "user", text: "Connect my lead sources" },
      {
        role: "assistant",
        text: "WhatsApp Business, Meta Lead Ads and Instagram are connected, plus Google Calendar for visits. I will capture leads every night at 2:00 AM and have the triage ready when you sit down.",
      },
    ],
  },
];
