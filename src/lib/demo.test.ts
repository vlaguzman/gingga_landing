import { describe, expect, it } from "vitest";
import {
  CRM_SECTIONS,
  demoHref,
  homeLangFromPathname,
  homePath,
  homeSections,
  isCrmPath,
  SECTORS,
  sectorFromPathname,
} from "./demo";

function decodedText(href: string): string {
  return new URL(href).searchParams.get("text") ?? "";
}

describe("demoHref", () => {
  it("builds a wa.me link with only the greeting when no context is given", () => {
    const url = new URL(demoHref());
    expect(url.origin + url.pathname).toBe("https://wa.me/447551273933");
    expect(decodedText(demoHref())).toBe("Hello GINGGA, I'd like to book a demo.");
  });

  it("adds the sector label", () => {
    expect(decodedText(demoHref("property-sales"))).toBe(
      "Hello GINGGA, I'd like to book a demo.\nSector: Property sales",
    );
  });

  it("adds the topic when there is no sector", () => {
    expect(decodedText(demoHref(undefined, "Convert"))).toBe(
      "Hello GINGGA, I'd like to book a demo.\nService of interest: Convert",
    );
  });

  it("adds sector and topic in order", () => {
    expect(decodedText(demoHref("student-recruitment", "Scale")).split("\n")).toEqual([
      "Hello GINGGA, I'd like to book a demo.",
      "Sector: Student recruitment",
      "Service of interest: Scale",
    ]);
  });

  it("url-encodes the message", () => {
    const href = demoHref("property-sales");
    expect(href).not.toMatch(/\s/);
    expect(href).toContain("%0A");
  });
});

describe("sectorFromPathname", () => {
  it("returns undefined for null or unknown paths", () => {
    expect(sectorFromPathname(null)).toBeUndefined();
    expect(sectorFromPathname("")).toBeUndefined();
    expect(sectorFromPathname("/")).toBeUndefined();
    expect(sectorFromPathname("/student-recruitment/extra")).toBeUndefined();
  });

  it("maps each sector path to its id", () => {
    expect(sectorFromPathname("/student-recruitment")).toBe("student-recruitment");
    expect(sectorFromPathname("/property-sales")).toBe("property-sales");
  });
});

describe("constants", () => {
  it("roots home section links at the home page of each language", () => {
    for (const href of Object.values(homeSections("en"))) expect(href).toMatch(/^\/#/);
    for (const href of Object.values(homeSections("es"))) expect(href).toMatch(/^\/es#/);
  });

  it("keeps CRM section links rooted at the CRM solution page", () => {
    for (const href of Object.values(CRM_SECTIONS)) expect(href).toMatch(/^\/crm-solution#/);
  });

  it("gives every sector a path starting with a slash", () => {
    for (const s of Object.values(SECTORS)) expect(s.path).toMatch(/^\//);
  });
});

describe("isCrmPath", () => {
  it("is true for the CRM solution page and the sector pages", () => {
    expect(isCrmPath("/crm-solution")).toBe(true);
    expect(isCrmPath("/student-recruitment")).toBe(true);
    expect(isCrmPath("/property-sales")).toBe(true);
  });

  it("is false for the home page, null and unknown paths", () => {
    expect(isCrmPath("/")).toBe(false);
    expect(isCrmPath(null)).toBe(false);
    expect(isCrmPath("/login")).toBe(false);
  });
});

describe("home language helpers", () => {
  it("maps languages to paths and back", () => {
    expect(homePath("en")).toBe("/");
    expect(homePath("es")).toBe("/es");
    expect(homeLangFromPathname("/")).toBe("en");
    expect(homeLangFromPathname("/es")).toBe("es");
    expect(homeLangFromPathname("/crm-solution")).toBeUndefined();
    expect(homeLangFromPathname(null)).toBeUndefined();
  });

  it("writes the booking message in Spanish when asked", () => {
    expect(decodedText(demoHref(undefined, undefined, "es"))).toContain("quiero reservar una demo");
    expect(decodedText(demoHref(undefined, "Convert", "es"))).toContain("Servicio de interés: Convert");
  });
});
