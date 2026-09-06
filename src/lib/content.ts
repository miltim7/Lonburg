import { landingPage } from "@/data/landing";
import type { LandingPageContent } from "@/types/content";
// CMS boundary: replace this function with a Payload query + mapping to the same contract.
export async function getLandingPage(): Promise<LandingPageContent> {
  return landingPage;
}
