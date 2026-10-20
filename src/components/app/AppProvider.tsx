"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { STAGES, VIA } from "@/data/app/chips";
import { DEALS, DEFAULT_REPLIES } from "@/data/app/deals";
import { LEADS } from "@/data/app/leads";
import { NAV, SECTION_HREF } from "@/data/app/nav";
import { OUTREACH } from "@/data/app/outreach";
import { PLAYBOOK_CLAIMS } from "@/data/app/playbook";
import type {
  ChatMessage,
  ChatThread,
  Deal,
  DealMessage,
  Lead,
  LeadWrite,
  Outreach,
  PlaybookClaim,
  PlaybookGroup,
  SectionId,
} from "@/data/app/types";

/**
 * All simulated workspace state lives here, mounted once by the (app) layout:
 * the chat thread, the open records and the mock data the user "edits" survive
 * navigation between routes. Nothing is persisted; a reload resets the demo.
 */

const REPLIES = [
  "Noted — I logged that on the account. Want me to adjust the outreach to match?",
  "Got it. I will factor that into tonight’s lead capture.",
  "Understood — added to the playbook. Every future draft will use it.",
];

type PlaybookTarget = { id: string; group: PlaybookGroup; add?: boolean; claim?: string };

interface AppContextValue {
  section: SectionId;
  user: { name: string; email: string; initials: string };

  msgs: ChatMessage[];
  send: (text: string) => void;
  openThread: (thread: ChatThread) => void;
  pillsFor: () => string[];

  leadSel: string | null;
  outSel: string | null;
  dealSel: string | null;
  setLeadSel: (id: string | null) => void;
  setOutSel: (id: string | null) => void;
  setDealSel: (id: string | null) => void;
  /** Records the open record for a section; the caller navigates (e.g. via a Link). */
  openRecord: (section: SectionId, id?: string) => void;
  /** Opens a record and navigates programmatically. */
  goTo: (section: SectionId, id?: string) => void;
  clearSelection: () => void;

  leads: Lead[];
  leadsLoading: boolean;
  leadUndo: string | null;
  discardLead: (id: string) => void;
  undoDiscard: () => void;

  outreach: Outreach[];
  bodies: Record<string, string>;
  outLoading: string | null;
  editing: boolean;
  setEditing: (v: boolean) => void;
  createOutreach: (lead: Lead, w: LeadWrite, skipUserMsg?: boolean) => void;
  saveEdit: (text: string) => void;
  sendOutreach: (when: string) => void;

  deals: Deal[];
  /** Id of the deal whose contact is currently "typing" in the chat window. */
  typingDealId: string | null;
  sendDealMessage: (dealId: string, text: string) => void;

  playbookClaims: PlaybookClaim[];
  pbLoadingId: string | null;
  correctClaim: (c: PlaybookClaim) => void;
  addToPlaybook: (g: PlaybookGroup) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

function sectionFromPath(pathname: string): SectionId {
  const hit = NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  return hit ? hit.id : "today";
}

function stamp() {
  const now = new Date();
  return `${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

/** The mock "today" is Aug 20; times come from the real clock so new messages look current. */
function mockStamp() {
  return `Aug 20 · ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function transformDraft(body: string, msg: string): { body: string; what: string | null } {
  const m = msg.toLowerCase();
  if (m.includes("short")) {
    const paras = body.split("\n\n");
    return {
      body: paras.length > 2 ? [paras[0], paras[paras.length - 1]].join("\n\n") : body,
      what: "tightened it — kept the hook and the ask, cut the middle",
    };
  }
  if (m.includes("open") || m.includes("hook")) {
    return {
      body: `I saw you asked about the home just now — and I am writing before the best units are reserved.\n\n${body}`,
      what: "opened with the home they asked about, straight to the point",
    };
  }
  return { body, what: null };
}

function pillsForSection(
  section: SectionId,
  sel: { leadSel: string | null; outSel: string | null; dealSel: string | null },
): string[] {
  switch (section) {
    case "today":
      return ["What should I do first?", "Plan my follow-up day"];
    case "leads":
      return sel.leadSel
        ? ["Draft the first message", "Why did you keep this lead?"]
        : ["Which lead is hottest?", "Find more like Valentina Ospina"];
    case "outreach":
      return sel.outSel
        ? ["Make it shorter", "Sharper opening line", "Switch to a call"]
        : ["Which message should go first?", "Who went cold this week?"];
    case "pipeline":
      return sel.dealSel
        ? ["Prep the visit brief", "Draft a follow-up"]
        : ["Who needs a reply today?", "Who went cold?"];
    case "playbook":
      return ["Something you should know…", "What have you learned this month?"];
    case "sources":
      return ["Connect a new lead source", "What came in this week?"];
    default:
      return ["Triage my leads", "Plan my week", "Who replied?"];
  }
}

export type AppUser = { name: string; email: string };

export function AppProvider({ children, user: account }: { children: ReactNode; user: AppUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const section = sectionFromPath(pathname);

  const initials = account.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const user = { ...account, initials };

  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [leadSel, setLeadSel] = useState<string | null>(null);
  const [outSel, setOutSel] = useState<string | null>(null);
  const [dealSel, setDealSel] = useState<string | null>(null);

  const [leads] = useState<Lead[]>(LEADS);
  const [discarded, setDiscarded] = useState<string[]>([]);
  /** Leads whose first touch was approved: they now live in the pipeline. */
  const [converted, setConverted] = useState<string[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadUndo, setLeadUndo] = useState<string | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);

  const [outreach, setOutreach] = useState<Outreach[]>(OUTREACH);
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const [outLoading, setOutLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const [typingDealId, setTypingDealId] = useState<string | null>(null);
  const lastReply = useRef<Record<string, number>>({});

  const [pbOverrides, setPbOverrides] = useState<Record<string, string>>({});
  const [pbAdded, setPbAdded] = useState<PlaybookClaim[]>([]);
  const [pbLoadingId, setPbLoadingId] = useState<string | null>(null);
  const [pbPending, setPbPending] = useState<PlaybookTarget | null>(null);

  /** Every timer goes through `later`, so unmounting the (app) layout cancels pending navigation and updates. */
  const timers = useRef(new Set<number>());
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
    return id;
  };
  const cancel = (id: number | undefined) => {
    if (id === undefined) return;
    window.clearTimeout(id);
    timers.current.delete(id);
  };
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      pending.clear();
    };
  }, []);
  /** Outreach ids being sent right now. */
  const sending = useRef(new Set<string>());
  /** Pending typing and reply timers per deal chat, so rapid messages get a single reply. */
  const replyTimers = useRef<Record<string, number[]>>({});

  const seq = useRef(0);
  const uid = (prefix: string) => `${prefix}-${++seq.current}`;

  const pushMsg = (...m: ChatMessage[]) => setMsgs((c) => [...c, ...m]);
  const finishTool = (id: string, detail?: string) =>
    setMsgs((c) =>
      c.map((x) => (x.role === "tool" && x.id === id ? { ...x, status: "done", detail: detail ?? x.detail } : x)),
    );
  const tool = (id: string, name: string, detail: string): ChatMessage => ({
    role: "tool",
    id,
    name,
    status: "running",
    detail,
  });
  const reply = (text: string): ChatMessage => ({ role: "assistant", text });

  const applySelection = (target: SectionId, id?: string) => {
    if (target === "leads") setLeadSel(id ?? null);
    if (target === "outreach") setOutSel(id ?? null);
    if (target === "pipeline") setDealSel(id ?? null);
  };
  const openRecord = (target: SectionId, id?: string) => applySelection(target, id);
  const goTo = (target: SectionId, id?: string) => {
    applySelection(target, id);
    router.push(SECTION_HREF[target]);
  };
  const clearSelection = () => {
    setLeadSel(null);
    setOutSel(null);
    setDealSel(null);
  };

  /* ---------- outreach ---------- */

  const createOutreach = (lead: Lead, w: LeadWrite, skipUserMsg?: boolean) => {
    const nid = `ow-${lead.id}-${w.ch}`;
    const t0 = uid("tool");
    const t1 = uid("tool");
    const t2 = uid("tool");
    const t3 = uid("tool");
    if (!skipUserMsg) pushMsg({ role: "user", text: `Draft the ${w.fmt.toLowerCase()} for ${lead.name}` });
    if (converted.includes(lead.id) || discarded.includes(lead.id)) {
      later(
        () =>
          pushMsg(
            reply(
              converted.includes(lead.id)
                ? `${lead.name} is already in the pipeline — continue in the WhatsApp chat there.`
                : `${lead.name} was discarded. Undo the discard first if you want a draft.`,
            ),
          ),
        650,
      );
      return;
    }
    later(() => pushMsg(tool(t0, "find_outreach", `lead: ${lead.id}`)), 400);

    const existing = outreach.find((d) => d.leadId === lead.id && d.channel === w.ch);
    if (existing) {
      later(() => {
        finishTool(t0, `lead: ${lead.id}\nfound: 1 draft`);
        pushMsg(tool(t3, "show_artifact", `id: ${existing.id}\nview: workspace · outreach detail`));
        goTo("outreach", existing.id);
      }, 1400);
      later(() => {
        finishTool(t3);
        pushMsg(
          reply(
            "You already have a draft for this lead — it is open in the workspace. A second one would split the same thread.",
          ),
        );
      }, 2200);
      return;
    }

    setOutreach((o) => [
      {
        id: nid,
        channel: w.ch,
        title: `${lead.name} — ${w.fmt.toLowerCase()}`,
        meta: `From: ${lead.src.label}`,
        goal: w.promise,
        to: w.who,
        body: w.body,
        leadId: lead.id,
      },
      ...o,
    ]);
    setOutLoading(nid);
    later(() => {
      finishTool(t0, `lead: ${lead.id}\nfound: none`);
      pushMsg(
        reply(
          `No draft for this lead yet. Writing the ${w.fmt.toLowerCase()} — playbook rules applied: open with the home they asked about, one question only.`,
        ),
        tool(t1, "draft_outreach", w.body),
      );
    }, 1400);
    later(() => {
      finishTool(t1);
      pushMsg(tool(t2, "save_artifact", `id: ${nid}\nartifact_type: outreach · ${w.ch}\nlead: ${lead.id}`));
    }, 2600);
    later(() => {
      finishTool(t2);
      pushMsg(tool(t3, "show_artifact", `id: ${nid}\nview: workspace · outreach detail`));
      goTo("outreach", nid);
    }, 3400);
    later(() => {
      finishTool(t3);
      setOutLoading(null);
      pushMsg(reply("Draft ready — review it in the workspace. Nothing goes out without your approval."));
    }, 4200);
  };

  const saveEdit = (text: string) => {
    const nid = outSel;
    if (!nid) return;
    setEditing(false);
    const tid = uid("tool");
    pushMsg(tool(tid, "save_artifact", `id: ${nid}\ntype: outreach · edited in workspace\nchars: ${text.length}`));
    setOutLoading(nid);
    later(() => {
      setBodies((b) => ({ ...b, [nid]: text }));
      setOutLoading(null);
      finishTool(tid);
    }, 1000);
  };

  /**
   * Approving a draft sends it on WhatsApp (or starts the call). A draft for a lead creates the deal
   * in Contacting; a draft for an existing deal is added to its chat, and New or Nurturing deals
   * move to Contacting.
   */
  const sendOutreach = (when: string) => {
    const nid = outSel;
    if (!nid) return;
    const d = outreach.find((x) => x.id === nid);
    // Re-entry guard: the buttons are disabled while loading, this covers a double click in one tick.
    if (!d || outLoading === nid || sending.current.has(nid)) return;
    sending.current.add(nid);
    const isCall = d.channel === "call";
    const t1 = uid("tool");
    const t2 = uid("tool");
    setEditing(false);
    pushMsg(
      tool(
        t1,
        isCall ? "start_call" : "send_message",
        `to: ${d.to}\n${isCall ? "dialing via VoIP · call will be logged" : `when: ${when}\nsigned: ${user.name}`}`,
      ),
    );
    setOutLoading(nid);
    later(() => {
      finishTool(t1);
      pushMsg(tool(t2, "save_artifact", `type: deal · stage → contacting\nperson: ${d.to}`));
    }, 1100);
    later(() => {
      const stampNow = mockStamp();
      const today = stampNow.split(" · ")[0];
      const message: DealMessage = {
        ch: d.channel,
        dir: "out",
        when: stampNow,
        text: isCall ? "Call placed · outcome to be logged." : bodies[nid] || d.body,
      };
      const note = isCall ? "Call placed" : `WhatsApp approved · ${when}`;
      const meta = isCall ? "Called today" : `Sends ${when}`;
      const last = isCall ? "Call placed today" : `Message approved · goes out ${when}`;
      // A draft tied to a lead reuses that lead's deal if one already exists, so a lead never gets two deals.
      const targetId = d.dealId ?? (d.leadId ? deals.find((x) => x.leadId === d.leadId)?.id : undefined);
      let pid = targetId ?? `dw-${nid}`;

      if (targetId) {
        setDeals((all) =>
          all.map((x) => {
            if (x.id !== targetId) return x;
            const reopened = x.stage === "new" || x.stage === "nurturing";
            return {
              ...x,
              ...(reopened && {
                stage: "contacting" as const,
                nextTouch: undefined,
                nurtureReason: undefined,
                tags: x.tags.filter((t) => t !== "Nurturing" && t !== "Unanswered"),
                next: isCall
                  ? "Log the outcome — I will draft the follow-up from your notes."
                  : "Watch for the reply — if it stays quiet, a follow-up goes out in 1 day.",
              }),
              draft: x.draft === nid ? undefined : x.draft,
              meta,
              last,
              thread: [...x.thread, message],
              activity: [...x.activity, [today, note]],
            };
          }),
        );
      } else {
        const lead = LEADS.find((l) => l.id === d.leadId);
        const profile = lead?.profile ?? {
          name: d.to,
          phone: "Not shared yet",
          email: "Not shared yet",
          city: "Not shared yet",
          property: "To be defined",
          budget: "To be qualified",
          zone: "To be qualified",
          financing: "To be qualified",
          household: "To be qualified",
          timeline: "To be qualified",
        };
        const created: Deal = {
          ...profile,
          id: pid,
          leadId: d.leadId,
          interest: profile.property,
          source: lead ? VIA[lead.src.via].name : "GINGGA outreach",
          tags: [profile.property.split(" · ")[0], "First touch sent"],
          firstContact: stampNow,
          notes: lead ? lead.body.join(" ") : "Created from an approved draft.",
          stage: "contacting",
          channel: d.channel,
          presence: "last seen recently",
          meta,
          last,
          next: isCall
            ? "Log the outcome — I will draft the follow-up from your notes."
            : "If no reply in 1 day, follow-up 2 goes out automatically.",
          thread: [message],
          activity: [
            ...(lead ? ([[lead.src.when === "Today" ? today : lead.src.when, `${VIA[lead.src.via].name} · lead captured`]] as [string, string][]) : []),
            [today, note],
          ],
        };
        setDeals((all) => (all.some((x) => x.id === pid) ? all : [created, ...all]));
      }
      if (d.leadId) {
        const leadId = d.leadId;
        setConverted((c) => (c.includes(leadId) ? c : [...c, leadId]));
        setLeadSel((cur) => (cur === leadId ? null : cur));
      }

      setOutreach((o) => o.filter((x) => x.id !== nid));
      sending.current.delete(nid);
      setOutLoading(null);
      finishTool(t2);
      pushMsg(
        reply(
          isCall
            ? "Calling — the script is on your screen and I am logging the call. The conversation is in Pipeline."
            : `Approved — it goes out ${when.toLowerCase()}, signed by you. The conversation is in Pipeline; I will watch the chat and bring you the reply.`,
        ),
      );
      goTo("pipeline", pid);
    }, 2000);
  };

  /* ---------- leads ---------- */

  const discardLead = (id: string) => {
    const l = leads.find((x) => x.id === id);
    const tid = uid("tool");
    pushMsg(tool(tid, "delete_artifact", `id: ${id}\ntype: lead\ntitle: ${l ? l.title : id}`));
    setLeadsLoading(true);
    later(() => {
      setDiscarded((d) => [...d, id]);
      if (leadSel === id) setLeadSel(null);
      finishTool(tid);
      setLeadsLoading(false);
      setLeadUndo(id);
      cancel(undoTimer.current);
      undoTimer.current = later(() => setLeadUndo(null), 6000);
    }, 900);
  };

  const undoDiscard = () => {
    if (!leadUndo) return;
    const id = leadUndo;
    const tid = uid("tool");
    pushMsg(tool(tid, "save_artifact", `id: ${id}\ntype: lead · restored`));
    setLeadsLoading(true);
    setLeadUndo(null);
    later(() => {
      setDiscarded((d) => d.filter((x) => x !== id));
      finishTool(tid);
      setLeadsLoading(false);
    }, 700);
  };

  /* ---------- playbook ---------- */

  const startPlaybookChat = (title: string, userText: string, assistantText: string) => {
    setMsgs((m) => {
      const first = m.filter((x) => x.role !== "title").length === 0;
      const head: ChatMessage[] = first ? [{ role: "title", text: title, when: stamp() }] : m;
      return [...head, { role: "user", text: userText }];
    });
    later(() => pushMsg(reply(assistantText)), 600);
  };

  const correctClaim = (c: PlaybookClaim) => {
    setPbPending({ id: c.id, group: c.group });
    startPlaybookChat(
      "Playbook correction",
      `Correct this in the playbook: “${c.claim}”`,
      "Tell me how it should read — I will save it and every future draft follows it.",
    );
  };

  const addToPlaybook = (g: PlaybookGroup) => {
    setPbPending({ id: uid("new"), group: g, add: true });
    startPlaybookChat(
      "Playbook update",
      `I want to add something to the playbook — ${g.toLowerCase()}.`,
      "Tell me — in your own words. I will write with it from now on.",
    );
  };

  /* ---------- chat ---------- */

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    pushMsg({ role: "user", text: t });

    if (pbPending) {
      const c = pbPending;
      setPbPending(null);
      const tid = uid("tool");
      later(() => {
        pushMsg(
          tool(
            tid,
            "save_artifact",
            `id: playbook\nartifact_type: sales_playbook\nfield: ${c.group.toLowerCase()} · ${c.add ? "new" : c.id}`,
          ),
        );
        if (c.add) {
          setPbAdded((arr) => [
            ...arr,
            {
              id: c.id,
              group: c.group,
              claim: "",
              prov: "you",
              because: "Because you told us — you added this yourself.",
            },
          ]);
        }
        setPbLoadingId(c.id);
        goTo("playbook");
      }, 500);
      later(() => {
        if (c.add) setPbAdded((arr) => arr.map((x) => (x.id === c.id ? { ...x, claim: t } : x)));
        else setPbOverrides((o) => ({ ...o, [c.id]: t }));
        setPbLoadingId(null);
        finishTool(tid);
        pushMsg(
          reply(
            c.add
              ? "Saved to the playbook — every draft from here on uses it."
              : "Saved — the playbook now says it your way. Every future message and call script follows it.",
          ),
        );
      }, 2100);
      return;
    }

    if (section === "outreach" && outSel) {
      const d = outreach.find((x) => x.id === outSel);
      if (d) {
        const current = bodies[outSel] || d.body;
        if (/call/i.test(t) && d.channel === "wa") {
          later(
            () =>
              pushMsg(
                reply(
                  `I can turn “${d.title}” into a call script — same hook, spoken. Want me to draft it as a separate touch, or replace the message?`,
                ),
              ),
            650,
          );
          return;
        }
        const { body, what } = transformDraft(current, t);
        if (what) {
          const tid = uid("tool");
          const target = outSel;
          later(() => {
            pushMsg(reply(`On it — ${what} in “${d.title}”.`), tool(tid, "draft_outreach", body));
            setOutLoading(target);
          }, 500);
          later(() => {
            setBodies((b) => ({ ...b, [target]: body }));
            setOutLoading(null);
            finishTool(tid);
            pushMsg(reply("Updated — every pass stays tracked, so you can trace what changed and why."));
          }, 1900);
        } else {
          later(
            () =>
              pushMsg(
                reply(
                  `You are looking at “${d.title}”. I can make it shorter, sharpen the opening, or switch the channel — say the word.`,
                ),
              ),
            650,
          );
        }
        return;
      }
    }

    if (section === "leads" && leadSel) {
      const l = leads.find((x) => x.id === leadSel);
      if (l && /why/i.test(t)) {
        later(() => pushMsg(reply(`${l.why} Buyer fit: ${l.fit}.`)), 650);
        return;
      }
      if (l && /message|draft/i.test(t) && l.writes[0]) {
        createOutreach(l, l.writes[0], true);
        return;
      }
    }

    if (section === "pipeline" && dealSel) {
      const dl = deals.find((x) => x.id === dealSel);
      if (dl) {
        later(
          () => pushMsg(reply(`${dl.name} is at “${STAGES[dl.stage].name}”. Next step: ${dl.next}`)),
          650,
        );
        return;
      }
    }

    later(() => setMsgs((m) => [...m, reply(REPLIES[m.length % REPLIES.length])]), 650);
  };

  /** Appends an outgoing WhatsApp message, then fakes a typing indicator and a canned reply. */
  const sendDealMessage = (dealId: string, text: string) => {
    const t = text.trim();
    const deal = deals.find((x) => x.id === dealId);
    if (!t || !deal) return;
    const append = (dir: "in" | "out", text: string) =>
      setDeals((all) =>
        all.map((x) =>
          x.id === dealId ? { ...x, thread: [...x.thread, { ch: "wa", dir, when: mockStamp(), text }] } : x,
        ),
      );
    append("out", t);
    // One pending reply per deal: a new message replaces the previous timers, so rapid sends get a single reply.
    (replyTimers.current[dealId] ?? []).forEach(cancel);
    const pool = deal.replies?.length ? deal.replies : DEFAULT_REPLIES;
    const typingTimer = later(() => setTypingDealId(dealId), 1200);
    const replyTimer = later(() => {
      // Never repeat the previous canned reply for this deal back to back.
      let idx = Math.floor(Math.random() * pool.length);
      if (pool.length > 1 && idx === lastReply.current[dealId]) idx = (idx + 1) % pool.length;
      lastReply.current[dealId] = idx;
      setTypingDealId((cur) => (cur === dealId ? null : cur));
      append("in", pool[idx]);
      delete replyTimers.current[dealId];
    }, 3000);
    replyTimers.current[dealId] = [typingTimer, replyTimer];
  };

  const openThread = (thread: ChatThread) =>
    setMsgs([
      {
        role: "title",
        text: thread.title,
        when: thread.when + (thread.group === "Today" ? "" : ` · ${thread.group}`),
      },
      ...thread.msgs,
    ]);

  const playbookClaims = mergePlaybook(pbAdded, pbOverrides);

  const value: AppContextValue = {
    section,
    user,
    msgs,
    send,
    openThread,
    pillsFor: () => pillsForSection(section, { leadSel, outSel, dealSel }),
    leadSel,
    outSel,
    dealSel,
    setLeadSel,
    setOutSel,
    setDealSel,
    openRecord,
    goTo,
    clearSelection,
    leads: leads.filter((l) => !discarded.includes(l.id) && !converted.includes(l.id)),
    leadsLoading,
    leadUndo,
    discardLead,
    undoDiscard,
    // Drafts of discarded leads are hidden (not deleted), so undoing the discard brings them back.
    outreach: outreach.filter((d) => !d.leadId || !discarded.includes(d.leadId)),
    bodies,
    outLoading,
    editing,
    setEditing,
    createOutreach,
    saveEdit,
    sendOutreach,
    deals,
    typingDealId,
    sendDealMessage,
    playbookClaims,
    pbLoadingId,
    correctClaim,
    addToPlaybook,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Seed claims plus user additions, with chat corrections applied on top. */
function mergePlaybook(added: PlaybookClaim[], overrides: Record<string, string>): PlaybookClaim[] {
  return [...PLAYBOOK_CLAIMS, ...added].map((c) =>
    overrides[c.id] ? { ...c, claim: overrides[c.id], corrected: true } : c,
  );
}
