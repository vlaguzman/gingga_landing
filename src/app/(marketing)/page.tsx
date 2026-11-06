import type { Metadata } from "next";
import { HomeContent } from "@/components/landing/home/HomeContent";

export const metadata: Metadata = {
  title: "GINGGA | Give your business a face people trust",
  description:
    "GINGGA turns your team's meetings, notes and reading into LinkedIn posts for your personal profiles, in each person's own voice, so customers get to know and trust the people behind your business.",
  alternates: { canonical: "/", languages: { en: "/", es: "/es" } },
};

export default function HomePage() {
  return <HomeContent lang="en" />;
}
