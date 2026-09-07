import { getLandingPage } from "@/lib/content";
import { company } from "@/config/company";
import { interfaceText, mainCta, navigation } from "@/data/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Vehicles } from "@/components/sections/vehicles";
import { Process } from "@/components/sections/process";
import { Cost } from "@/components/sections/cost";
import { Directions } from "@/components/sections/directions";
import { Estimate } from "@/components/sections/estimate";
import {
  Timing,
  Contracts,
  Delivery,
  Advantages,
} from "@/components/sections/details";
import { FAQ } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { RequestProvider } from "@/components/ui/request-context";
import { LandingMotion } from "@/components/ui/landing-motion";
import { ContactOptions } from "@/components/ui/contact-options";
export default async function Home() {
  const content = await getLandingPage();
  return (
    <>
      <Header
        company={company}
        links={navigation}
        cta={mainCta}
        labels={interfaceText}
      />
      <RequestProvider>
        <main id="main" tabIndex={-1}>
          <LandingMotion />
          <Hero content={content.hero} />
          <Vehicles
            content={content.vehicles}
            tabLabel={interfaceText.vehicleTabs}
          />
          <Process content={content.process} />
          <Cost content={content.cost} />
          <Estimate
            content={content.estimate}
            contacts={<ContactOptions company={company} />}
          />
          <Timing content={content.timing} />
          <Contracts content={content.contracts} />
          <Delivery content={content.delivery} />
          <Advantages content={content.advantages} />
          <Directions content={content.directions} />
          <FAQ content={content.faq} />
          <FinalCta
            content={content.finalCta}
            telegram={
              company.telegram
                ? { href: company.telegram, label: interfaceText.telegram }
                : null
            }
          />
        </main>
      </RequestProvider>
      <Footer company={company} links={navigation} labels={interfaceText} />
    </>
  );
}
