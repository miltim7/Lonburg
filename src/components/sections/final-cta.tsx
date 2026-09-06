import Image from "next/image";
import type { LandingPageContent } from "@/types/content";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";
export function FinalCta({
  content,
  telegram,
}: {
  content: LandingPageContent["finalCta"];
  telegram: { href: string; label: string } | null;
}) {
  return (
    <section className="final-cta dark-section">
      <Image
        src={content.image.src}
        alt={content.image.alt}
        fill
        sizes="100vw"
        style={{ objectPosition: content.image.position }}
      />
      <div className="final-shade" />
      <div className="container final-inner">
        <SectionHeading content={content} />
        <div className="final-actions">
          <ButtonLink cta={content.cta} />
          {telegram && <ButtonLink cta={telegram} variant="text" />}
        </div>
      </div>
    </section>
  );
}
