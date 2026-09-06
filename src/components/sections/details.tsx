import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { LandingPageContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/primitives";
export function Timing({ content }: { content: LandingPageContent["timing"] }) {
  return (
    <section className="section timing" id="timing" tabIndex={-1}>
      <div className="container">
        <div className="timing-top">
          <SectionHeading content={content} />
          <div className="time-value">
            <strong>{content.value}</strong>
            <span>{content.unit}</span>
          </div>
        </div>
        <div className="timing-bottom">
          <p className="timing-note">{content.note}</p>
          {content.details.map((item) => (
            <div key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Contracts({
  content,
}: {
  content: LandingPageContent["contracts"];
}) {
  return (
    <section className="section contracts" id="contracts" tabIndex={-1}>
      <div className="container contracts-grid">
        <SectionHeading content={content} />
        <div className="contracts-visual">
          <div className="contract-client">
            <strong>{content.client}</strong>
          </div>
          <div className="contract-branches">
            {content.agreements.map((item, i) => (
              <div className="contract-party" key={item.title}>
                <span className="contract-line" aria-hidden="true" />
                <span className="contract-number">0{i + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="contract-note">{content.note}</p>
        </div>
      </div>
    </section>
  );
}
export function Delivery({
  content,
}: {
  content: LandingPageContent["delivery"];
}) {
  return (
    <section
      className="section delivery dark-section"
      id="delivery"
      tabIndex={-1}
    >
      <div className="container">
        <div className="delivery-top">
          <SectionHeading content={content} />
        </div>
        <ol className="delivery-route">
          {content.route.map((item, i) => (
            <li key={item.title}>
              <div className="route-marker">
                <span />
                <i aria-hidden="true" />
                {i < content.route.length - 1 && (
                  <ArrowRight size={20} aria-hidden="true" />
                )}
              </div>
              <span className="route-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
        <p className="route-note">{content.note}</p>
      </div>
    </section>
  );
}
export function Advantages({
  content,
}: {
  content: LandingPageContent["advantages"];
}) {
  return (
    <section className="section advantages" id="approach" tabIndex={-1}>
      <div className="container advantages-grid">
        <div className="advantages-editorial">
          <SectionHeading content={content} />
          <figure className="interior-figure">
            <div className="interior-image">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(max-width: 767px) 100vw, 45vw"
                style={{ objectPosition: content.image.position }}
              />
            </div>
            <figcaption>{content.caption}</figcaption>
          </figure>
        </div>
        <ol className="advantages-list">
          {content.items.map((item, i) => (
            <li key={item.title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
