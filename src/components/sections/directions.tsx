import Image from "next/image";
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
                {item.images && (
                  <div className="machinery-gallery">
                    {item.images.map((image, imageIndex) => (
                      <figure key={image.src}>
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 767px) calc((100vw - 96px) / 2), (max-width: 1320px) calc((50vw - 96px) / 2), 284px"
                          loading="lazy"
                          quality={78}
                          style={{ objectPosition: image.position }}
                        />
                        <figcaption>
                          {String(imageIndex + 1).padStart(2, "0")}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
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
