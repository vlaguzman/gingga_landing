export type SectorId = "student-recruitment" | "property-sales";

export const SECTORS: Record<SectorId, { label: string; path: string; demoLabel: string }> = {
  "student-recruitment": {
    label: "Student recruitment",
    path: "/student-recruitment",
    demoLabel: "Book a student recruitment demo",
  },
  "property-sales": {
    label: "Property sales",
    path: "/property-sales",
    demoLabel: "Book a property sales demo",
  },
};

/**
 * The only booking channel that exists today is the WhatsApp number already used by the site.
 * Replace BOOKING_BASE (and the message builder below) when a real booking endpoint is available.
 */
const BOOKING_BASE = "https://wa.me/447551273933";

/** Single source of truth for every "Book a demo" / "Discuss ..." link. */
export function demoHref(sector?: SectorId, topic?: string): string {
  const lines = ["Hello GINGGA, I'd like to book a demo."];
  if (sector) lines.push(`Sector: ${SECTORS[sector].label}`);
  if (topic) lines.push(`Service of interest: ${topic}`);
  return `${BOOKING_BASE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function sectorFromPathname(pathname: string | null): SectorId | undefined {
  if (!pathname) return undefined;
  return (Object.keys(SECTORS) as SectorId[]).find((id) => pathname === SECTORS[id].path);
}

/** Path of the sales/CRM solution landing (the previous home page). */
export const CRM_PATH = "/crm-solution";

/** CRM solution section links, valid from any route. */
export const CRM_SECTIONS = {
  howItWorks: `${CRM_PATH}#how-it-works`,
  services: `${CRM_PATH}#services`,
  demo: `${CRM_PATH}#demo`,
} as const;

/** Home page (content voice) section links, valid from any route. */
export const HOME_SECTIONS = {
  howItWorks: "/#how-it-works",
  example: "/#example",
  integrations: "/#integrations",
  vision: "/#vision",
} as const;

/** True for the CRM solution page and the sector pages that belong to it. */
export function isCrmPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === CRM_PATH || sectorFromPathname(pathname) !== undefined;
}
