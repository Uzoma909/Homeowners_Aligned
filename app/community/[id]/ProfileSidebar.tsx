import Link from "next/link";

interface ProfileSidebarProps {
  /** Formatted date the certificate dataset row was downloaded, if known. */
  certificateRetrieved: string | null;
  /** Formatted date the Comptroller record was fetched, if known. */
  comptrollerRetrieved: string | null;
  certificateUrl: string | null;
}

/**
 * Right-hand column of an HOA profile. Explains where the record came from
 * and separates source data from the score this project generates.
 */
export function ProfileSidebar({
  certificateRetrieved,
  comptrollerRetrieved,
  certificateUrl,
}: ProfileSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-20 flex flex-col gap-4" aria-label="About this record">
      {/* Sources */}
      <div className="ha-card rounded-2xl p-5 flex flex-col gap-3">
        <span
          className="self-start text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "var(--color-ha-surface)", color: "var(--color-ha-deep)" }}
        >
          Source data
        </span>
        <h2
          className="text-lg font-semibold"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            letterSpacing: "-0.01em",
          }}
        >
          Where this record comes from
        </h2>
        <ul className="flex flex-col gap-3 text-[13px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
          <li>
            <strong style={{ color: "var(--color-ha-text)" }}>
              Management certificate
            </strong>
            <br />
            Filed with the Texas Real Estate Commission and listed in the
            state&rsquo;s open data portal. Fees, management company, and
            recording details were extracted from the filed PDF.
            {certificateRetrieved && (
              <span className="block mt-1 text-[12px]" style={{ color: "var(--color-ha-gray)" }}>
                Retrieved {certificateRetrieved}
              </span>
            )}
            {certificateUrl && (
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-[12px] font-semibold hover:underline"
                style={{ color: "var(--color-ha-primary)" }}
              >
                {"Open the filed certificate (PDF) →"}
              </a>
            )}
          </li>
          <li>
            <strong style={{ color: "var(--color-ha-text)" }}>
              Texas Comptroller franchise tax record
            </strong>
            <br />
            Entity status, registered agent, registration date, and officers,
            matched to this HOA by name.
            <span className="block mt-1 text-[12px]" style={{ color: "var(--color-ha-gray)" }}>
              {comptrollerRetrieved
                ? `Retrieved ${comptrollerRetrieved}`
                : "No matching Comptroller record was found"}
            </span>
          </li>
        </ul>
      </div>

      {/* Score explanation */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-3 text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-ha-deep), var(--color-ha-primary))",
        }}
      >
        <span
          className="self-start text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          Project-generated
        </span>
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-outfit)", letterSpacing: "-0.01em" }}
        >
          About the score
        </h2>
        <p className="text-[13px] opacity-90 leading-relaxed">
          The projected score is calculated by this project from the records
          above. It measures how much public information is on file, not how
          well the HOA is run. It is experimental and is not an official
          rating.
        </p>
        <Link
          href="/project#scoring"
          className="mt-1 text-center text-[13px] font-semibold py-2.5 rounded-[10px] w-full no-underline"
          style={{ background: "white", color: "var(--color-ha-deep)" }}
        >
          How the score works
        </Link>
      </div>

      {/* Accuracy note */}
      <div className="ha-card rounded-2xl p-5 flex flex-col gap-2">
        <h2
          className="text-[15px] font-semibold"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
        >
          Accuracy
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
          This is a snapshot. Records may be incomplete or out of date, and
          name matching can pair an HOA with the wrong entity. Check the
          original sources before relying on anything here.
        </p>
        <Link
          href="/contact"
          className="text-[13px] font-semibold hover:underline"
          style={{ color: "var(--color-ha-primary)" }}
        >
          {"Report an error or request removal →"}
        </Link>
      </div>
    </aside>
  );
}
