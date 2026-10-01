import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Image src="/assets/logo.png" alt="GINGGA" width={1797} height={307} />
          <div className="powered">
            Powered by <b>Mastil</b>
          </div>
          <div className="tagline">Let’s learn. Let’s iterate. Let’s grow.</div>
        </div>
        <address className="site-footer__contact">
          <b>Vladimir Guzmán Mendoza</b>
          <span>Head of Sales</span>
          <a href="tel:+447551273933">+44 7551 273933</a>
        </address>
      </div>
    </footer>
  );
}
