const points = [
  {
    title: "Explore an offer",
    text: "Start from the problem you want to solve. Share your perspective and open conversations with the people who live it. Their answers help you shape a proposal you can then test.",
  },
  {
    title: "Show your expertise",
    text: "Turn what you already know into a steady, recognisable presence, without starting each post from a blank page.",
  },
  {
    title: "Give your business a voice",
    text: "Keep the way your business talks consistent, drawing on the real questions your customers ask.",
  },
] as const;

export function StartingPoints() {
  return (
    <section className="section home-points">
      <div className="container stack-48">
        <h2 className="h2 section-title">One voice of your own. Different places to start.</h2>
        <ul className="cards">
          {points.map((point) => (
            <li key={point.title} className="feature-card">
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
