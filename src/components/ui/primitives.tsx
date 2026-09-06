import { ArrowUpRight } from "lucide-react";
import type { CTA, SectionIntro } from "@/types/content";
export function ButtonLink({
  cta,
  variant = "primary",
  className = "",
}: {
  cta: CTA;
  variant?: "primary" | "outline" | "text";
  className?: string;
}) {
  return (
    <a className={`button button--${variant} ${className}`} href={cta.href}>
      {cta.label}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
export function SectionHeading({
  content,
  className = "",
}: {
  content: SectionIntro;
  className?: string;
}) {
  return (
    <div className={`section-heading ${className}`}>
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.title}</h2>
      {content.description && (
        <p className="section-description">{content.description}</p>
      )}
    </div>
  );
}
