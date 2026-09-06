"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { CompanyConfig, CTA } from "@/types/content";
import type { interfaceText } from "@/data/navigation";
export function Header({
  company,
  links,
  cta,
  labels,
}: {
  company: CompanyConfig;
  links: CTA[];
  cta: CTA;
  labels: typeof interfaceText;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const mobile = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobile.current?.querySelector("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const elements = [
          toggle.current,
          ...Array.from(
            mobile.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1100) setOpen(false);
    };
    const main = document.getElementById("main");
    const footer = document.getElementById("footer");
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  function closeToAnchor(href: string) {
    setOpen(false);
    window.setTimeout(() => {
      const target = document.getElementById(href.slice(1));
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }, 0);
  }
  return (
    <header
      className={`header ${scrolled ? "header--scrolled" : ""} ${open ? "header--open" : ""}`}
    >
      <div className="container header-inner">
        <a
          href="#"
          className="wordmark"
          aria-label={`${company.name} — ${labels.home}`}
          tabIndex={open ? -1 : undefined}
        >
          <span className="brand-mark" aria-hidden="true" />
          {company.wordmark}
          <span className="brand-dot">.</span>
        </a>
        <nav className="desktop-nav" aria-label={labels.navigation}>
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href={cta.href}>
          {cta.label}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          ref={toggle}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? labels.closeMenu : labels.openMenu}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div className="mobile-menu" id="mobile-menu" ref={mobile} hidden={!open}>
        <nav aria-label={labels.navigation}>
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => closeToAnchor(link.href)}
            >
              <span>0{i + 1}</span>
              {link.label}
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          ))}
          <a
            className="mobile-primary"
            href={cta.href}
            onClick={() => closeToAnchor(cta.href)}
          >
            {cta.label}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </nav>
        <p>{company.tagline}</p>
      </div>
    </header>
  );
}
