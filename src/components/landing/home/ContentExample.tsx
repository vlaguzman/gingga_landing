import { Icon } from "../Icon";

export function ContentExample() {
  return (
    <section id="example" className="section--dark home-example">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">Said in a meeting. Ready as your next post.</h2>
          <p className="lead">A client question becomes the starting point for a draft that sounds like you.</p>
        </div>

        <div className="home-example__flow">
          <figure className="home-example__card">
            <figcaption className="home-example__label">Client call · Fathom</figcaption>
            <blockquote>
              Three clients asked me this week which AI tool to buy. None of them had defined the task they wanted to
              improve.
            </blockquote>
            <p className="home-example__tag">Idea detected: a perspective worth sharing</p>
          </figure>

          <div className="home-example__arrow" aria-hidden="true">
            <Icon name="arrow" />
          </div>

          <figure className="home-example__card home-example__card--draft">
            <figcaption className="home-example__label">LinkedIn draft · in your voice</figcaption>
            <h3>The first decision about AI shouldn&rsquo;t be which tool to buy.</h3>
            <p>
              This week I got the same question three times. My answer started with another one: what task do you want
              to improve? Before comparing tools, describe the problem. That&rsquo;s where a useful decision starts.
            </p>
          </figure>
        </div>
        <p className="home-example__note">Illustrative example. No real data is processed.</p>
      </div>
    </section>
  );
}
