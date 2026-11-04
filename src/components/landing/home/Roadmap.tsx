import Link from "next/link";
import { CRM_PATH } from "@/lib/demo";

const loop = [
  {
    title: "Define your voice",
    text: "Who you are, what you know and who you want to help.",
  },
  {
    title: "Create and share",
    text: "Turn your ideas into content that represents you.",
  },
  {
    title: "Talk and connect",
    text: "Hear the questions, needs and objections.",
  },
  {
    title: "Learn and adjust",
    text: "Bring what you learn into your next message and offer.",
  },
] as const;

export function Roadmap() {
  return (
    <section id="vision" className="section home-vision">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">Your voice is the start. The vision goes further.</h2>
          <p className="lead">
            We want to connect content, conversations and learning in one system. Instagram, WhatsApp and managed
            conversations are part of that direction.
          </p>
        </div>

        <div className="home-vision__grid">
          <div className="home-vision__now">
            <span className="badge">Available today</span>
            <h3>LinkedIn content from your own conversations.</h3>
          </div>
          <div className="home-vision__next">
            <span className="home-vision__soon">Where we&rsquo;re heading</span>
            <ol className="home-vision__loop">
              {loop.map((step, i) => (
                <li key={step.title}>
                  <span className="home-vision__num">{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="home-vision__crm">
          Already handling leads and enquiries? <Link href={CRM_PATH}>See the GINGGA CRM solution</Link>.
        </p>
      </div>
    </section>
  );
}
