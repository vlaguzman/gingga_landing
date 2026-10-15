import { ExampleCard } from "./ExampleCard";
import type { Benefit } from "./BenefitCards";

const calls: readonly Benefit[] = [
  { title: "Coordinate", text: "Agree availability and book through a connected calendar when configured." },
  { title: "Prepare", text: "Review requirements, previous questions and pending actions before you speak." },
  { title: "Follow through", text: "Delegate the next follow-up and create tasks after the conversation." },
];

export function CallsAndMeetings() {
  return (
    <section className="section docs">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">From messages to calls, meetings and viewings.</h2>
          <p className="lead">
            Collect availability, coordinate appointments and keep the buyer&rsquo;s context ready for your next
            conversation.
          </p>
        </div>
        <div className="pair pair--top">
          <ul className="cards cards--stack">
            {calls.map((c) => (
              <li key={c.title} className="card">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
          <ExampleCard
            title="Viewing request"
            tag="Awaiting buyer"
            fields={[
              { label: "Buyer", value: "Emma" },
              { label: "Proposed times", value: "Saturday 10:00 or 14:00" },
              { label: "Status", value: "Waiting for Emma to confirm" },
              { label: "Next action", value: "Add to calendar once confirmed" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

const instructions = [
  "Which buyers are still waiting for a response?",
  "Follow up with Carlos and ask whether Saturday works for a viewing.",
  "Send me a summary before my call with Emma.",
  "Create a task to call James tomorrow.",
] as const;

export function WhatsAppDelegation() {
  return (
    <section className="section--dark delegate">
      <div className="container delegate__inner">
        <div className="delegate__copy">
          <h2 className="h2">An AI agent you can delegate to.</h2>
          <p className="lead">
            Ask for updates and assign sales tasks through WhatsApp, without having to open your CRM for every action.
          </p>
          <div>
            <p className="delegate__eyebrow">Example instructions</p>
            <ul className="instructions">
              {instructions.map((i) => (
                <li key={i}>&ldquo;{i}&rdquo;</li>
              ))}
            </ul>
          </div>
          <p className="hero__note">
            Available in Optimise and Scale, with agreed permissions and confirmations for actions that require your
            approval. Actions depend on configured integrations.
          </p>
        </div>

        <figure className="chat chat--wa">
          <figcaption className="lead-card__label lead-card__label--dark">Example conversation</figcaption>
          <div className="chat__head">
            <div className="chat__title">Your GINGGA agent</div>
            <div className="chat__channel">WhatsApp</div>
          </div>
          <div className="bubble bubble--out">Follow up with Carlos and ask whether Saturday works for a viewing.</div>
          <div className="bubble bubble--in">
            <p>Here is what I plan to send to Carlos:</p>
            <p className="bubble__quote">&ldquo;Hi Carlos, would Saturday work for a viewing of the property?&rdquo;</p>
          </div>
          <div className="proposal">
            <span className="tag">Awaiting your confirmation</span>
            <p>Nothing has been sent yet. Reply &ldquo;Confirm&rdquo; to send it, or tell me what to change.</p>
          </div>
        </figure>
      </div>
    </section>
  );
}

export function BuyerContext() {
  return (
    <section className="section handoff">
      <div className="container docs__inner">
        <div className="docs__copy">
          <h2 className="h2">Start the call with the context already in place.</h2>
          <p className="lead">
            Know what the buyer wants, what you&rsquo;ve already discussed and what needs your attention.
          </p>
        </div>
        <ExampleCard
          title="Buyer context"
          tag="Call booked"
          fields={[
            { label: "Budget", value: "Range stated in chat, to confirm on the call" },
            { label: "Preferred location", value: "Close to the city centre" },
            { label: "Property requirements", value: "Two bedrooms, outdoor space" },
            { label: "Buying timeline", value: "Within three months" },
            { label: "Conversation summary", value: "Asked about parking and the service charge" },
            { label: "Next action", value: "Confirm answers on the call" },
          ]}
        />
      </div>
    </section>
  );
}
