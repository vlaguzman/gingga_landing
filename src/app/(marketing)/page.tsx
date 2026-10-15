import type { Metadata } from "next";
import { BenefitCards } from "@/components/landing/BenefitCards";
import { DemoCta } from "@/components/landing/DemoCta";
import { DemoSelector } from "@/components/landing/DemoSelector";
import { Hero } from "@/components/landing/Hero";
import { ManagedService } from "@/components/landing/ManagedService";
import { Services } from "@/components/landing/Services";
import { resolveVideo } from "@/lib/video-assets";

export const metadata: Metadata = {
  title: "GINGGA | More sales from the leads you already have",
  description:
    "AI agents that respond, qualify and follow up, so you can focus on closing. Set up, managed and continuously improved by GINGGA.",
};

const benefits = [
  {
    title: "Respond while interest is fresh.",
    text: "Start the conversation when a lead gets in touch, even when you're busy.",
  },
  {
    title: "Make follow-up consistent.",
    text: "Keep track of unanswered questions, missing information and the next step.",
  },
  {
    title: "Step in with context.",
    text: "See what each prospect needs and what has already been discussed.",
  },
];

export default function HomePage() {
  const videos = {
    "student-recruitment": resolveVideo("student-recruitment"),
    "property-sales": resolveVideo("property-sales"),
  };
  return (
    <>
      <Hero />
      <DemoSelector videos={videos} />
      <BenefitCards heading="Keep more opportunities moving." items={benefits} />
      <ManagedService />
      <Services />
      <DemoCta
        title="What happens to your leads after the first enquiry?"
        lead="Show us your current process. We'll show you where GINGGA could help."
      />
    </>
  );
}
