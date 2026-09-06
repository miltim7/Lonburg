import Image from "next/image";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import type { HeroContent } from "@/types/content";
import { ButtonLink } from "@/components/ui/primitives";
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-image">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          fill
          sizes="100vw"
          preload
          quality={90}
          style={{ objectPosition: content.image.position }}
        />
      </div>
      <div className="hero-shade" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            {content.eyebrow}
          </p>
          <h1 id="hero-title">
            {content.title}
            <br />
            <span>{content.accent}</span>
          </h1>
          <p className="hero-description">{content.description}</p>
          <div className="hero-actions">
            <ButtonLink cta={content.primaryCta} />
            <a className="hero-secondary" href={content.secondaryCta.href}>
              {content.secondaryCta.label}
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-route">
          {content.route.map((item, i) => (
            <span key={item}>
              {i > 0 && <ArrowRight size={17} aria-hidden="true" />}
              {item}
            </span>
          ))}
        </div>
        <div className="hero-bottom">
          <div className="hero-facts">
            {content.facts.map((fact) => (
              <span key={fact}>
                <Check size={14} aria-hidden="true" />
                {fact}
              </span>
            ))}
          </div>
          <a className="scroll-link" href="#vehicles">
            {content.scrollLabel}
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <span className="hero-caption">{content.caption}</span>
      </div>
    </section>
  );
}
