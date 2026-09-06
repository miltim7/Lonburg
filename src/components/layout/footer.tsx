import { ArrowUp } from "lucide-react";
import { ContactOptions } from "@/components/ui/contact-options";
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
          <ContactOptions company={company} compact />
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
