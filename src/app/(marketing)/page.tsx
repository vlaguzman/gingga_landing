import type { Metadata } from "next";
import { DemoCta } from "@/components/landing/DemoCta";
import { ContentExample } from "@/components/landing/home/ContentExample";
import { HomeFaq } from "@/components/landing/home/HomeFaq";
import { HomeHero } from "@/components/landing/home/HomeHero";
import { HomeHowItWorks } from "@/components/landing/home/HomeHowItWorks";
import { Integrations } from "@/components/landing/home/Integrations";
import { Roadmap } from "@/components/landing/home/Roadmap";
import { StartingPoints } from "@/components/landing/home/StartingPoints";

export const metadata: Metadata = {
  title: "GINGGA | Give a voice to your ideas and your experience",
  description:
    "GINGGA connects to your meeting notes, reading and voice notes, finds the ideas worth sharing and turns them into LinkedIn drafts in your own voice.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeHowItWorks />
      <ContentExample />
      <Integrations />
      <StartingPoints />
      <HomeFaq />
      <Roadmap />
      <DemoCta
        title="Your experience deserves more than your notes app."
        lead="Connect your sources and find content ideas in what you already talk about, read and learn."
      />
    </>
  );
}
