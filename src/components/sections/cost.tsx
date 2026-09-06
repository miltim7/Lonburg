import type { LandingPageContent } from "@/types/content";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";
export function Cost({ content }: { content: LandingPageContent["cost"] }) {
  return (
    <section className="section cost dark-section" id="cost" tabIndex={-1}>
      <div className="container cost-grid">
        <div className="cost-intro">
          <SectionHeading content={content} />
          <ButtonLink cta={content.cta} variant="outline" />
          <div className="cost-aside">
            <p>{content.optionalNote}</p>
          </div>
        </div>
        <div className="cost-document">
          <div className="document-heading">
            <span className="mini-mark" aria-hidden="true" />
            <p>{content.documentLabel}</p>
          </div>
          <ol className="cost-items">
            {content.items.map((item, i) => (
              <li key={item.title}>
                <span className="cost-index">{i > 0 ? "+" : ""}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="cost-registration">
            <div className="cost-registration-heading">
              <h3>{content.registrationTitle}</h3>
              <p>{content.registrationNote}</p>
            </div>
            <ul className="cost-items">
              {content.registrationItems.map((item) => (
                <li key={item.title}>
                  <span className="cost-index" aria-hidden="true">
                    +
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="cost-total">
            <span aria-hidden="true">=</span>
            <div>
              <h3>{content.total}</h3>
              <p>{content.totalNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
