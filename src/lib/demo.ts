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
export function demoHref(sector?: SectorId, topic?: string, lang: "en" | "es" = "en"): string {
  const es = lang === "es";
  const lines = [es ? "Hola GINGGA, quiero reservar una demo." : "Hello GINGGA, I'd like to book a demo."];
  if (sector) lines.push(`Sector: ${SECTORS[sector].label}`);
  if (topic) lines.push(`${es ? "Servicio de interés" : "Service of interest"}: ${topic}`);
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

/** Home page path for a language. */
export function homePath(lang: "en" | "es"): string {
  return lang === "es" ? "/es" : "/";
}

/** Home section links for a language, valid from any route. */
export function homeSections(lang: "en" | "es") {
  const base = homePath(lang) === "/" ? "/" : "/es";
  return {
    howItWorks: `${base}#how-it-works`,
    example: `${base}#example`,
    integrations: `${base}#integrations`,
    pricing: `${base}#pricing`,
    vision: `${base}#vision`,
  };
}

/** Language of a home-page path, or undefined when the path is not a home page. */
export function homeLangFromPathname(pathname: string | null): "en" | "es" | undefined {
  if (pathname === "/") return "en";
  if (pathname === "/es") return "es";
  return undefined;
}

/** True for the CRM solution page and the sector pages that belong to it. */
export function isCrmPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === CRM_PATH || sectorFromPathname(pathname) !== undefined;
}
