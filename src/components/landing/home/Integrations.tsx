const groups = [
  {
    title: "Meetings and conversation notes",
    tools: ["Fathom", "Fireflies", "Granola", "Microsoft Teams", "Read AI"],
  },
  {
    title: "Reading and dictated ideas",
    tools: ["Readwise", "Wispr Flow"],
  },
] as const;

export function Integrations() {
  return (
    <section id="integrations" className="section">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">The ideas are already in your day.</h2>
          <p className="lead">
            GINGGA connects the tools where you keep conversations, notes and reading, and finds starting points you
            would otherwise forget: an explanation you keep repeating, a good question, something you just learned.
          </p>
        </div>
        <div className="home-sources">
          {groups.map((group) => (
            <div key={group.title} className="home-sources__group">
              <h3>{group.title}</h3>
              <ul className="home-sources__chips">
                {group.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
