export interface CTA {
  label: string;
  href: string;
}
export interface Media {
  src: string;
  alt: string;
  position?: string;
  blurDataURL?: string;
}
export interface SectionIntro {
  eyebrow: string;
  title: string;
  description?: string;
}
export interface TextItem {
  title: string;
  description: string;
}
export interface ProcessStep extends TextItem {
  id: string;
}
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
export interface CompanyConfig {
  name: string;
  wordmark: string;
  tagline: string;
  phone: string | null;
  email: string | null;
  telegram: string | null;
  max: string | null;
  legalName: string | null;
  footerNote: string;
  copyright: string;
}
export interface SEOConfig {
  title: string;
  description: string;
  siteUrl: string | null;
  locale: string;
}
export interface HeroContent {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: CTA;
  secondaryCta: CTA;
  facts: string[];
  route: string[];
  image: Media;
  caption: string;
  scrollLabel: string;
}
export interface VehicleCategory extends TextItem {
  id: string;
  index: string;
  subtitle: string;
  image: Media;
  cta: CTA;
}
export type EstimateFieldName =
  | "model"
  | "condition"
  | "year"
  | "power"
  | "engineVolume"
  | "city"
  | "name"
  | "contact"
  | "registration"
  | "comment";
export type EstimateValues = Record<EstimateFieldName, string> & {
  vehicleType?: string;
};
export interface EstimateField {
  name: EstimateFieldName;
  label: string;
  placeholder: string;
  required: boolean;
  maxLength: number;
  autoComplete?: string;
  multiline?: boolean;
  secondary?: boolean;
}
export interface EstimateContent extends SectionIntro {
  fields: EstimateField[];
  cta: string;
  pending: string;
  unavailable: string;
  submitted: string;
  failed: string;
  privacy: string;
  note: string;
  validation: { required: string; contact: string; tooLong: string };
  steps: string[];
  optionalLabel: string;
  extraFieldsLabel: string;
  categoryLabel: string;
  clearCategory: string;
}
export interface LandingPageContent {
  hero: HeroContent;
  vehicles: SectionIntro & { categories: VehicleCategory[]; note: string };
  process: SectionIntro & { steps: ProcessStep[]; note: string };
  cost: SectionIntro & {
    items: TextItem[];
    registrationItems: TextItem[];
    registrationTitle: string;
    registrationNote: string;
    total: string;
    totalNote: string;
    optionalNote: string;
    cta: CTA;
    documentLabel: string;
    recycling: {
      title: string;
      description: string;
      factors: TextItem[];
      note: string;
    };
  };
  estimate: EstimateContent;
  timing: SectionIntro & {
    value: string;
    unit: string;
    note: string;
    details: TextItem[];
  };
  contracts: SectionIntro & {
    client: string;
    agreements: TextItem[];
    note: string;
  };
  delivery: SectionIntro & { route: TextItem[]; note: string };
  advantages: SectionIntro & {
    items: TextItem[];
    image: Media;
    caption: string;
  };
  faq: SectionIntro & { items: FAQItem[] };
  directions: SectionIntro & {
    items: (TextItem & { id: string; cta: CTA })[];
    note: string;
  };
  finalCta: SectionIntro & { cta: CTA; image: Media };
}
