import { ArrowUpRight, ArrowUp } from "lucide-react";
import type { CompanyConfig, CTA } from "@/types/content";
import type { interfaceText } from "@/data/navigation";
export function Footer({
  company,
  links,
  labels,
}: {
  company: CompanyConfig;
  links: CTA[];
  labels: typeof interfaceText;
}) {
  const contacts = [
    company.telegram && { label: labels.telegram, href: company.telegram },
    company.phone && {
      label: company.phone,
      href: `tel:${company.phone.replace(/[^+\d]/g, "")}`,
    },
    company.email && { label: company.email, href: `mailto:${company.email}` },
    company.max && { label: labels.max, href: company.max },
  ].filter(Boolean) as CTA[];
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#" className="wordmark">
              <span className="brand-mark" aria-hidden="true" />
              {company.wordmark}
              <span className="brand-dot">.</span>
            </a>
            <p>
              {company.tagline}
              <br />
              {company.footerNote}
            </p>
          </div>
          <nav aria-label={labels.footerNav}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          {contacts.length > 0 && (
            <div className="footer-contacts">
              {contacts.map((contact) => (
                <a key={contact.href} href={contact.href}>
                  {contact.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {company.copyright}
          </p>
          {company.legalName && <p>{company.legalName}</p>}
          <a href="#">
            {labels.backToTop}
            <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
