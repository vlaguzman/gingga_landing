import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { IconSprite } from "@/components/landing/IconSprite";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <IconSprite />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
