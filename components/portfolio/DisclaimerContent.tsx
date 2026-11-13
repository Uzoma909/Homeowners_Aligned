/**
 * The project disclaimer text. Rendered by the intro screen (IntroGate)
 * and by the standalone /disclaimer page, so the wording stays identical.
 */

export function DisclaimerIntro() {
  return (
    <>
      <p>
        Homeowners Aligned is a software engineering and data analytics project
        demonstrating how publicly available homeowners association records can
        be collected, processed, organized, and presented through an
        interactive web application.
      </p>
      <p>
        The platform showcases automated data collection, document parsing,
        structured data management, and experimental transparency scoring.
      </p>
    </>
  );
}

export function DisclaimerNotice({
  headingId,
  headingLevel = 2,
}: {
  headingId?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <div
      className="rounded-2xl p-5 md:p-6 text-left"
      style={{
        background: "var(--color-ha-surface)",
        border: "1px solid var(--color-ha-border-strong)",
      }}
    >
      <Heading
        id={headingId}
        className="text-[13px] font-semibold uppercase mb-3"
        style={{
          color: "var(--color-ha-deep)",
          letterSpacing: "0.08em",
        }}
      >
        Important Notice
      </Heading>
      <div
        className="flex flex-col gap-3 text-[14px] leading-relaxed"
        style={{ color: "var(--color-ha-text-soft)" }}
      >
        <p>
          This website is a technical portfolio demonstration, not an active
          commercial service.
        </p>
        <p>
          Information is sourced from publicly available records and may be
          incomplete, outdated, or inaccurate. Transparency scores are
          experimental indicators based on the project&rsquo;s methodology and
          should not be interpreted as official evaluations, legal conclusions,
          or professional recommendations.
        </p>
        <p>
          Homeowners Aligned is not affiliated with any homeowners association
          or government agency.
        </p>
      </div>
    </div>
  );
}
