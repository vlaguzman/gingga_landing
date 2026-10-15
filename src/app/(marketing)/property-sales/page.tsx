import type { Metadata } from "next";
import { BenefitCards } from "@/components/landing/BenefitCards";
import { DemoCta } from "@/components/landing/DemoCta";
import { BuyerContext, CallsAndMeetings, WhatsAppDelegation } from "@/components/landing/PropertySections";
import { SectorHero } from "@/components/landing/SectorHero";
import { resolveVideo } from "@/lib/video-assets";

export const metadata: Metadata = {
  title: "Property sales | GINGGA",
  description:
    "Respond to property enquiries, qualify buyers and coordinate calls and viewings. Delegate follow-up and sales tasks to your AI agent.",
};

const benefits = [
  { title: "Engage new enquiries.", text: "Start the conversation while interest is fresh." },
  {
    title: "Understand the buyer.",
    text: "Collect budget, preferred location, property requirements and buying timeline.",
  },
  {
    title: "Keep the next step moving.",
    text: "Follow up on interest and help coordinate calls, meetings and viewings.",
  },
];

export default function PropertySalesPage() {
  return (
    <>
      <SectorHero
        sector="property-sales"
        title="Keep buyers moving while you're busy selling."
        lead="Respond to property enquiries, qualify buyers and coordinate calls and viewings. Delegate follow-up and sales tasks to your AI agent."
        service="Configured around your sales process. Managed by GINGGA."
        video={resolveVideo("property-sales")}
      />
      <BenefitCards heading="Stay responsive, even when you're in a viewing." items={benefits} />
      <CallsAndMeetings />
      <WhatsAppDelegation />
      <BuyerContext />
      <DemoCta
        sector="property-sales"
        title="Spend more time with buyers. Less time chasing updates."
        lead="See how GINGGA could support your enquiries, appointments and follow-up."
      />
    </>
  );
}
