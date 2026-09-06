import { Check } from "lucide-react";
import type { LandingPageContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/primitives";
export function Process({
  content,
}: {
  content: LandingPageContent["process"];
}) {
  return (
    <section className="section process" id="process" tabIndex={-1}>
      <div className="container">
        <div className="section-top">
          <SectionHeading content={content} />
        </div>
        <ol className="process-track">
          {content.steps.map((step) => (
            <li key={step.id}>
              <span className="step-number">{step.id}</span>
              <div className="step-dot" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="process-note">
          <Check size={19} aria-hidden="true" />
          <p>{content.note}</p>
        </div>
      </div>
    </section>
  );
}
