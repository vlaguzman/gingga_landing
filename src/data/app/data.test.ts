import { describe, expect, it } from "vitest";
import { CHATS, CHAT_GROUPS } from "./chats";
import { BOARD_STAGES, CHAN, OUTCOME_STAGES, STAGES, VIA } from "./chips";
import { DEALS, DEFAULT_REPLIES } from "./deals";
import { INITIALLY_CONNECTED, INTEGRATIONS } from "./integrations";
import { LEADS } from "./leads";
import { MOCK_TODAY, NAV, SECTION_HREF, SECTION_LABEL } from "./nav";
import { OUTREACH } from "./outreach";
import { PLAYBOOK_CLAIMS, PLAYBOOK_GROUPS } from "./playbook";
import { ATTENTION, KPIS, WEEK_DAYS } from "./today";

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe("nav", () => {
  it("derives href and label lookups from the nav items", () => {
    for (const n of NAV) {
      expect(SECTION_HREF[n.id]).toBe(n.href);
      expect(SECTION_LABEL[n.id]).toBe(n.label);
    }
    expect(SECTION_HREF.sources).toBe("/integrations");
    expect(SECTION_LABEL.chat).toBe("Chats");
  });

  it("has unique ids and hrefs, and a mock date", () => {
    expect(unique(NAV.map((n) => n.id))).toBe(true);
    expect(unique(NAV.map((n) => n.href))).toBe(true);
    expect(MOCK_TODAY).toBe("Wed, Aug 20");
  });
});

describe("chips", () => {
  it("covers every pipeline stage exactly once between the board and the outcome tabs", () => {
    expect([...BOARD_STAGES, ...OUTCOME_STAGES].sort()).toEqual(Object.keys(STAGES).sort());
  });

  it("describes every stage, source and channel", () => {
    for (const s of Object.values(STAGES)) expect(s.name && s.hint).toBeTruthy();
    for (const v of [...Object.values(VIA), ...Object.values(CHAN)]) expect(v.name && v.tone && v.mark).toBeTruthy();
  });
});

describe("mock records reference each other consistently", () => {
  const dealIds = DEALS.map((d) => d.id);
  const outreachIds = OUTREACH.map((o) => o.id);

  it("has unique ids in every collection", () => {
    expect(unique(dealIds)).toBe(true);
    expect(unique(outreachIds)).toBe(true);
    expect(unique(LEADS.map((l) => l.id))).toBe(true);
    expect(unique(CHATS.map((c) => c.id))).toBe(true);
    expect(unique(PLAYBOOK_CLAIMS.map((c) => c.id))).toBe(true);
    expect(unique(INTEGRATIONS.map((i) => i.id))).toBe(true);
  });

  it("points each draft at exactly one existing lead or deal", () => {
    for (const o of OUTREACH) {
      expect(Boolean(o.leadId) !== Boolean(o.dealId)).toBe(true);
      if (o.leadId) expect(LEADS.map((l) => l.id)).toContain(o.leadId);
      if (o.dealId) expect(dealIds).toContain(o.dealId);
    }
  });

  it("links deal drafts back to a draft that targets the same deal", () => {
    for (const d of DEALS.filter((x) => x.draft)) {
      expect(OUTREACH.find((o) => o.id === d.draft)?.dealId).toBe(d.id);
    }
  });

  it("gives every lead at least one first-touch option on a known channel", () => {
    for (const l of LEADS) {
      expect(l.writes.length).toBeGreaterThan(0);
      for (const w of l.writes) expect(Object.keys(CHAN)).toContain(w.ch);
      expect(Object.keys(VIA)).toContain(l.src.via);
    }
  });

  it("gives every deal a known stage and a seeded conversation or an empty one on purpose", () => {
    for (const d of DEALS) {
      expect(Object.keys(STAGES)).toContain(d.stage);
      expect(d.activity.length).toBeGreaterThan(0);
    }
    expect(DEFAULT_REPLIES.length).toBeGreaterThan(1);
  });

  it("records the outcome fields of closed deals", () => {
    for (const d of DEALS.filter((x) => x.stage === "won")) expect(d.price && d.closedOn).toBeTruthy();
    for (const d of DEALS.filter((x) => x.stage === "lost")) expect(d.lostReason && d.closedOn).toBeTruthy();
    for (const d of DEALS.filter((x) => x.stage === "nurturing")) expect(d.nextTouch && d.nurtureReason).toBeTruthy();
  });

  it("only uses known chat groups and playbook groups", () => {
    for (const c of CHATS) expect(CHAT_GROUPS).toContain(c.group);
    for (const c of PLAYBOOK_CLAIMS) expect(PLAYBOOK_GROUPS).toContain(c.group);
  });

  it("makes every dashboard target open an existing record", () => {
    const sectionIds = NAV.map((n) => n.id);
    const exists = (section: string, id?: string) => {
      if (!id) return true;
      if (section === "leads") return LEADS.some((l) => l.id === id);
      if (section === "outreach") return outreachIds.includes(id);
      if (section === "pipeline") return dealIds.includes(id);
      return false;
    };
    for (const { to } of [...KPIS, ...ATTENTION]) {
      expect(sectionIds).toContain(to[0]);
      expect(exists(to[0], to[1])).toBe(true);
    }
  });

  it("shows seven days in the visits strip", () => {
    expect(WEEK_DAYS).toHaveLength(7);
  });

  it("starts with an initial connection state for every integration", () => {
    expect(Object.keys(INITIALLY_CONNECTED).sort()).toEqual(INTEGRATIONS.map((i) => i.id).sort());
  });
});
