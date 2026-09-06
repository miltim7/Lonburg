import { Plus } from "lucide-react";
import type { LandingPageContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/primitives";
export function FAQ({ content }: { content: LandingPageContent["faq"] }) {
  return (
    <section className="section faq" id="faq" tabIndex={-1}>
      <div className="container faq-grid">
        <SectionHeading content={content} />
        <div className="faq-list">
          {content.items.map((item, i) => (
            <details name="faq" key={item.id}>
              <summary>
                <span className="faq-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{item.question}</h3>
                <Plus size={20} aria-hidden="true" />
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
