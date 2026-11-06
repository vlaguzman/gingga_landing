import type { Metadata } from "next";
import { HomeContent } from "@/components/landing/home/HomeContent";

export const metadata: Metadata = {
  title: "GINGGA | Dale a tu negocio un rostro en el que confiar",
  description:
    "GINGGA convierte las reuniones, notas y lecturas de tu equipo en publicaciones para LinkedIn en tus perfiles personales, con la voz de cada persona, para que tus clientes conozcan y confíen en las personas detrás de tu negocio.",
  alternates: { canonical: "/es", languages: { en: "/", es: "/es" } },
};

export default function HomeEsPage() {
  return <HomeContent lang="es" />;
}
