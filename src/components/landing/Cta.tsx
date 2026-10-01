import Image from "next/image";

export function Cta() {
  return (
    <section id="analyse" className="section--dark cta">
      <div className="container cta__inner">
        <div className="cta__copy">
          <h2>How many future customers are already inside your funnel?</h2>
          <p className="cta__lead">
            You may already be generating enough demand. The opportunity may be improving what happens after the lead arrives.
          </p>
          <div>
            <a className="btn" href="https://wa.me/447551273933">
              Analyse my sales funnel
            </a>
          </div>
          <p className="cta__fine">
            We’ll look at your current journey from first enquiry to closed sale and identify where prospects are getting
            lost, where sales time is being wasted and where automation can create leverage.
          </p>
        </div>
        <div className="cta__mark" aria-hidden="true">
          <Image src="/assets/mark.png" alt="" width={605} height={425} />
        </div>
      </div>
    </section>
  );
}
