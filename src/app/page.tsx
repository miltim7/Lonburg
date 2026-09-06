import { getLandingPage } from "@/lib/content";
import { company } from "@/config/company";
import { interfaceText, mainCta, navigation } from "@/data/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Vehicles } from "@/components/sections/vehicles";
import { Process } from "@/components/sections/process";
import { Cost } from "@/components/sections/cost";
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
          <Hero content={content.hero} />
          <Vehicles
            content={content.vehicles}
            tabLabel={interfaceText.vehicleTabs}
          />
          <Process content={content.process} />
          <Cost content={content.cost} />
          <Estimate content={content.estimate} />
          <Timing content={content.timing} />
          <Contracts content={content.contracts} />
          <Delivery content={content.delivery} />
          <Advantages content={content.advantages} />
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
