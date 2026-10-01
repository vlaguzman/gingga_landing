import { Compare } from "@/components/landing/Compare";
import { Connect } from "@/components/landing/Connect";
import { Cta } from "@/components/landing/Cta";
import { AiHumans } from "@/components/landing/AiHumans";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { IconSprite } from "@/components/landing/IconSprite";
import { Measure } from "@/components/landing/Measure";
import { Plans } from "@/components/landing/Plans";
import { Problem } from "@/components/landing/Problem";
import { Process } from "@/components/landing/Process";
import { System } from "@/components/landing/System";

export default function LandingPage() {
  return (
    <>
      <IconSprite />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Connect />
        <System />
        <Compare />
        <Plans />
        <Measure />
        <AiHumans />
        <Process />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
