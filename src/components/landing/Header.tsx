"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CRM_SECTIONS,
  demoHref,
  homeLangFromPathname,
  homePath,
  homeSections,
  isCrmPath,
  SECTORS,
  sectorFromPathname,
  type SectorId,
} from "@/lib/demo";
import { homeCopy } from "@/data/home-copy";
import { Icon } from "./Icon";

export function Header() {
  const pathname = usePathname();
  const sector = sectorFromPathname(pathname);
  const crm = isCrmPath(pathname);
  const lang = homeLangFromPathname(pathname) ?? "en";
  const copy = homeCopy[lang].nav;
  const sections = homeSections(lang);
  const other = lang === "es" ? "en" : "es";
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="site-header__logo" href={homePath(lang)} aria-label="GINGGA home">
          <Image src="/assets/logo.png" alt="GINGGA" width={1797} height={307} priority />
        </Link>
        {crm ? (
          <nav className="site-nav" aria-label="Main">
            <Link href={CRM_SECTIONS.howItWorks}>How it works</Link>
            <div
              className="site-nav__menu"
              ref={wrapRef}
              onKeyDown={(e) => {
                if (e.key === "Escape" && open) {
                  setOpen(false);
                  buttonRef.current?.focus();
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
              }}
            >
              <button
                ref={buttonRef}
                type="button"
                className="site-nav__toggle"
                aria-expanded={open}
                aria-controls="use-cases-menu"
                onClick={() => setOpen((v) => !v)}
              >
                Use cases
                <Icon name="chevron" />
              </button>
              <ul id="use-cases-menu" className="site-nav__panel" hidden={!open}>
                {(Object.keys(SECTORS) as SectorId[]).map((id) => (
                  <li key={id}>
                    <Link
                      href={SECTORS[id].path}
                      aria-current={sector === id ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {SECTORS[id].label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href={CRM_SECTIONS.services}>Services</Link>
          </nav>
        ) : (
          <nav className="site-nav" aria-label="Main">
            <Link href={sections.howItWorks}>{copy.howItWorks}</Link>
            <Link href={sections.pricing}>{copy.pricing}</Link>
            <Link
              className="site-nav__lang"
              href={homePath(other)}
              hrefLang={other}
              lang={other}
              aria-label={copy.switchLabel}
            >
              {copy.switchTo}
            </Link>
          </nav>
        )}
        <a className="btn btn--sm" href={demoHref(sector, undefined, lang)}>
          {crm ? "Book a demo" : copy.bookDemo}
        </a>
      </div>
    </header>
  );
}
