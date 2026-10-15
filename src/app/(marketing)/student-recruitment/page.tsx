import type { Metadata } from "next";
import { BenefitCards } from "@/components/landing/BenefitCards";
import { DemoCta } from "@/components/landing/DemoCta";
import { SectorHero } from "@/components/landing/SectorHero";
import { AdviserHandoff, Documentation, StudentMeasure } from "@/components/landing/StudentSections";
import { resolveVideo } from "@/lib/video-assets";

export const metadata: Metadata = {
  title: "Student recruitment | GINGGA",
  description:
    "Respond to prospective students, request and review documents and follow up on missing information, so your advisers can focus on moving applications forward.",
};

const benefits = [
  {
    title: "Answer the everyday questions.",
    text: "Respond using your approved course and application information.",
  },
  {
    title: "Collect what's missing.",
    text: "Request the required details and documents, then follow up on outstanding items.",
  },
  {
    title: "Give advisers a clear next step.",
    text: "Bring conversations, documents and pending actions together before handoff.",
  },
];

export default function StudentRecruitmentPage() {
  return (
    <>
      <SectorHero
        sector="student-recruitment"
        title="Less chasing. More student applications moving forward."
        lead="Respond to prospective students, request and review documents, and follow up on missing information, so your advisers can focus on moving applications forward."
        service="Configured around your recruitment process. Managed by GINGGA."
        video={resolveVideo("student-recruitment")}
      />
      <BenefitCards heading="Keep the application moving, even between conversations." items={benefits} />
      <Documentation />
      <AdviserHandoff />
      <StudentMeasure />
      <DemoCta
        sector="student-recruitment"
        title="Give your advisers more time to advise."
        lead="Let's explore how GINGGA could support your enquiries, document collection and follow-up."
      />
    </>
  );
}
