import Image from "next/image";

const beforeNodes = ["Marketing", "CRM", "Sales team", "Revenue"] as const;

const afterSteps = [
  "Acquisition",
  "Conversation",
  "Qualification",
  "Follow-up",
  "Sales readiness",
  "Sales handoff",
] as const;

export function Connect() {
  return (
    <section className="section connect">
      <div className="container stack-48">
        <div className="split split--end">
          <h2 className="h2">GINGGA connects marketing and sales.</h2>
          <p className="lead">
            Most companies already have the individual pieces in place. What is usually missing is the operating layer
            connecting them. GINGGA builds that layer.
          </p>
        </div>

        <div>
          <div className="flow-label">Before</div>
          <div className="flow-scroll">
            <div className="flow-before">
              {beforeNodes.map((node, i) => (
                <FlowNode key={node} label={node} withLink={i < beforeNodes.length - 1} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flow-label flow-label--strong">With GINGGA</div>
          <div className="flow-after">
            <div className="flow-after__row">
              <Image src="/assets/mark.png" alt="GINGGA" width={605} height={425} />
              <ul className="flow-after__steps">
                {afterSteps.map((step, i) => (
                  <li key={step} className={i === afterSteps.length - 1 ? "is-final" : undefined}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowNode({ label, withLink }: { label: string; withLink: boolean }) {
  return (
    <>
      <div className="node">{label}</div>
      {withLink && (
        <div className="broken-link" aria-hidden="true">
          <i></i>
          <i></i>
        </div>
      )}
    </>
  );
}
