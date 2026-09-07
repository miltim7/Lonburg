import { Construction, Cpu } from "lucide-react";
import type { LandingPageContent } from "@/types/content";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";

export function Directions({
  content,
}: {
  content: LandingPageContent["directions"];
}) {
  return (
    <section className="section directions" id="directions" tabIndex={-1}>
      <div className="container">
        <SectionHeading content={content} />
        <div className="directions-grid">
          {content.items.map((item, index) => {
            const Icon = item.id === "machinery" ? Construction : Cpu;
            return (
              <article className="direction-card" key={item.id}>
                <div className="direction-symbol" aria-hidden="true">
                  <Icon size={36} strokeWidth={1.25} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ButtonLink cta={item.cta} variant="text" />
              </article>
            );
          })}
        </div>
        <p className="directions-note">{content.note}</p>
      </div>
    </section>
  );
}
