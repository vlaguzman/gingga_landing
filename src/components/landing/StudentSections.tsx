import { ChatExcerpt, ExampleCard } from "./ExampleCard";
import { Icon } from "./Icon";

type DocStatus = "Requested" | "Received" | "Needs review" | "Complete";

const documents: readonly { name: string; status: DocStatus; detail: string }[] = [
  { name: "Passport copy", status: "Complete", detail: "Checklist item satisfied" },
  { name: "Academic transcript", status: "Received", detail: "Awaiting checks" },
  { name: "English test result", status: "Needs review", detail: "Name differs from application form" },
  { name: "Financial statement", status: "Requested", detail: "Reminder scheduled" },
];

const capabilities = [
  "Request required documents.",
  "Track received and outstanding items.",
  "Extract information and flag issues.",
  "Prepare an organised application summary.",
] as const;

export function Documentation() {
  return (
    <section className="section docs">
      <div className="container docs__inner">
        <div className="docs__copy">
          <h2 className="h2">Less paperwork chasing. Clearer application status.</h2>
          <p className="lead">
            GINGGA requests documents, extracts key information and checks submissions against your agreed checklist.
            Missing details and inconsistencies are flagged for adviser review.
          </p>
          <ul className="checklist">
            {capabilities.map((c) => (
              <li key={c}>
                <Icon name="check" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <p className="callout callout--note">
            Your team stays in control of final checks, eligibility decisions and submission.
          </p>
        </div>

        <figure className="lead-card docs__visual">
          <figcaption className="lead-card__label">Example data. Fictional application, not a real client.</figcaption>
          <div className="summary lead-card__body">
            <div className="lead-card__head">
              <div className="summary__title">Application checklist</div>
              <span className="tag">In progress</span>
            </div>
            <ul className="doclist">
              {documents.map((d) => (
                <li key={d.name}>
                  <div>
                    <strong>{d.name}</strong>
                    <span>{d.detail}</span>
                  </div>
                  <span className={`status status--${d.status.toLowerCase().replace(" ", "-")}`}>{d.status}</span>
                </li>
              ))}
            </ul>
            <p className="doclist__legend">
              Complete means the checklist item is satisfied. It is not an admission decision or an authenticity check.
            </p>
          </div>
        </figure>
      </div>
    </section>
  );
}

export function AdviserHandoff() {
  return (
    <section className="section handoff">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">A clearer handoff. A better-prepared adviser.</h2>
          <p className="lead">
            See the prospective student&rsquo;s interests, relevant background, submitted documents and outstanding
            actions in one place.
          </p>
        </div>
        <div className="pair">
          <ChatExcerpt
            title="Prospective student"
            channel="WhatsApp"
            lines={[
              { from: "in", text: "Hi, I'm looking at a master's in business analytics for September." },
              { from: "out", text: "Great. Which subject did you study, and do you have your transcript to hand?" },
              { from: "in", text: "Economics. I can send the transcript now." },
            ]}
          />
          <ExampleCard
            title="Adviser handoff"
            tag="Ready for adviser"
            fields={[
              { label: "Study interests", value: "Master's in business analytics" },
              { label: "Preferred intake", value: "September" },
              { label: "Relevant background", value: "Bachelor's in economics" },
              { label: "Documents received", value: "Transcript, passport copy" },
              { label: "Outstanding information", value: "English test result, financial statement" },
              { label: "Next action", value: "Adviser call to confirm course shortlist" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

const stages = [
  { label: "Enquiry", pending: false },
  { label: "Information collected", pending: false },
  { label: "Adviser handoff", pending: false },
  { label: "Application", pending: true },
  { label: "Enrolment", pending: true },
] as const;

const metrics = ["Response times", "Information completeness", "Adviser handoffs"] as const;

export function StudentMeasure() {
  return (
    <section className="section measure-block">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">Track progress from enquiry to application.</h2>
          <p className="lead">
            Measure response times, information completeness and adviser handoffs. Connect application and enrolment
            outcomes when the data is available.
          </p>
        </div>
        <div className="pipeline-wrap">
          <ol className="pipeline" aria-label="Progress stages from enquiry to enrolment">
            {stages.map((s) => (
              <li key={s.label} className={s.pending ? "is-pending" : undefined}>
                {s.label}
                {s.pending && <small>When data is connected</small>}
              </li>
            ))}
          </ol>
          <ul className="chips chips--light" aria-label="Measured by GINGGA">
            {metrics.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
