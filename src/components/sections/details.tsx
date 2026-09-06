import Image from "next/image";
import type { LandingPageContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/primitives";
import { DeliveryJourney } from "./delivery-journey";
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
        <DeliveryJourney route={content.route} />
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
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1099px) calc(45.8vw - 18px), (max-width: 1279px) calc(45.8vw - 28px), (max-width: 1464px) calc(45.8vw - 45px), 615px"
                loading="lazy"
                quality={75}
                placeholder="blur"
                blurDataURL={content.image.blurDataURL}
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
