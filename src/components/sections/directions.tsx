import Image from "next/image";
import { Construction, Cpu } from "lucide-react";
import type { LandingPageContent } from "@/types/content";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";

export function Directions({
  content,
}: {
  content: LandingPageContent["directions"];
}) {
  const gallery = content.items.find((item) => item.images?.length);

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
        {gallery?.images && (
          <div className="machinery-gallery-panel">
            <div className="machinery-gallery-heading">
              <span>Фото техники</span>
              <h3>{gallery.title}</h3>
            </div>
            <div className="machinery-gallery">
              {gallery.images.map((image, imageIndex) => (
                <figure key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1099px) calc((100vw - 72px) / 2), (max-width: 1464px) calc((100vw - 192px) / 4), 300px"
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
          </div>
        )}
        <p className="directions-note">{content.note}</p>
      </div>
    </section>
  );
}
