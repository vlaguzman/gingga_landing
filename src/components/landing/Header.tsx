import Image from "next/image";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__logo" href="#top" aria-label="GINGGA home">
          <Image src="/assets/logo.png" alt="GINGGA" width={1797} height={307} priority />
        </a>
        <nav className="site-nav" aria-label="Main">
          <a href="#system">How it works</a>
          <a href="#plans">Plans</a>
          <a href="#measure">Measurement</a>
        </nav>
        <a className="btn btn--sm" href="#analyse">
          Analyse my funnel
        </a>
      </div>
    </header>
  );
}
