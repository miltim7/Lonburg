import { MapPin, SearchCheck, ShieldCheck } from "lucide-react";
import type { LandingPageContent } from "@/types/content";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";

const icons = [SearchCheck, ShieldCheck, MapPin];

export function RussiaSelection({
  content,
}: {
  content: LandingPageContent["russiaSelection"];
}) {
  return (
    <section
      className="section russia-selection"
      id="russia-selection"
      tabIndex={-1}
    >
      <div className="container russia-selection-grid">
        <div>
          <SectionHeading content={content} />
          <ButtonLink cta={content.cta} variant="text" />
          <p className="russia-selection-note">{content.note}</p>
        </div>
        <ol className="russia-selection-list">
          {content.items.map((item, index) => {
            const Icon = icons[index] ?? SearchCheck;
            return (
              <li key={item.title}>
                <span aria-hidden="true">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
