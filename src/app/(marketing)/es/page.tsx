import type { Metadata } from "next";
import { HomeContent } from "@/components/landing/home/HomeContent";

export const metadata: Metadata = {
  title: "GINGGA | Dale una voz a tus ideas y tu experiencia",
  description:
    "GINGGA se conecta con tus notas de reuniones, lecturas y notas de voz, encuentra las ideas que vale la pena compartir y las convierte en borradores para LinkedIn con tu propia voz.",
  alternates: { canonical: "/es", languages: { en: "/", es: "/es" } },
};

export default function HomeEsPage() {
  return <HomeContent lang="es" />;
}
