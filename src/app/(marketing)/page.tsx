import type { Metadata } from "next";
import { HomeContent } from "@/components/landing/home/HomeContent";

export const metadata: Metadata = {
  title: "GINGGA | Give a voice to your ideas and your experience",
  description:
    "GINGGA connects to your meeting notes, reading and voice notes, finds the ideas worth sharing and turns them into LinkedIn drafts in your own voice.",
  alternates: { canonical: "/", languages: { en: "/", es: "/es" } },
};

export default function HomePage() {
  return <HomeContent lang="en" />;
}
