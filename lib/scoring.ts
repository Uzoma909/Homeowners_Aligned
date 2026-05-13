/**
 * Homeowners Aligned — Public Projected Score Engine v3
 *
 * SCORING PHILOSOPHY:
 * - Pillar bars show ALL checkpoints (public + user) — honest display
 *   e.g. Financial shows 3/5 when 3 public items are done but 2 user items remain
 * - The PROJECTED headline score calculates only from public data
 *   so good HOAs aren't punished for items that can't be filled yet
 * - Cap at 75 — full score requires community engagement
 * - Non-ACTIVE entity status applies a 12-point penalty
 * - Resident Sentiment excluded from projection until user data exists
 */

export interface ScoringInput {
  // Financial Health
  hasFees: boolean;
  hasCcrInstruments: boolean;
  hasAssociationWebsite: boolean;

  // Governance & Transparency
  hasOfficers: boolean;
  officerCount: number;
  entityStatusActive: boolean;
  hasManagement: boolean;
  hasRegisteredAgent: boolean;
  hasFormationDate: boolean;
  managementContactComplete: boolean;

  // Legal History
  hasCertificate: boolean;
  hasSubdivision: boolean;
  hasCcrRecording: boolean;

  // Resident Sentiment (future / user-contributed)
  reviewCount: number;
  hasForumActivity: boolean;
}

export interface PillarCheckpoint {
  label: string;
  done: boolean;
  source: "public" | "user";
}

export interface PillarResult {
  key: string;
  label: string;
  /** Display score based on ALL checkpoints (public + user) */
  score: number;
  maxScore: number;
  /** Display percent based on ALL checkpoints */
  percent: number;
  /** Score contribution from public checkpoints only (for projected calc) */
  publicScore: number;
  publicMaxScore: number;
  checkpoints: PillarCheckpoint[];
  hasData: boolean;
}

export interface ScoringResult {
  projectedScore: number | null;
  pillars: PillarResult[];
  availablePillars: number;
  totalPillars: number;
  isFullScore: boolean;
  completedCheckpoints: number;
  totalCheckpoints: number;
  publicCheckpointsCompleted: number;
  publicCheckpointsTotal: number;
  insufficientData: boolean;
}

export function calculateProjectedScore(input: ScoringInput): ScoringResult {
  // ── Financial Health ──
  const financialCheckpoints: PillarCheckpoint[] = [
    { label: "Transfer fees on file", done: input.hasFees, source: "public" },
    { label: "CC&R instrument numbers recorded", done: input.hasCcrInstruments, source: "public" },
    { label: "Association or management website found", done: input.hasAssociationWebsite, source: "public" },
    { label: "Budget uploaded", done: false, source: "user" },
    { label: "Reserve study on file", done: false, source: "user" },
  ];

  // ── Governance & Transparency ──
  const governanceCheckpoints: PillarCheckpoint[] = [
    {
      label: input.hasOfficers
        ? `Board members found (${input.officerCount})`
        : "Board members missing",
      done: input.hasOfficers,
      source: "public",
    },
    {
      label: input.entityStatusActive ? "Entity status: ACTIVE" : "Entity status not active",
      done: input.entityStatusActive,
      source: "public",
    },
    { label: "Management company on file", done: input.hasManagement, source: "public" },
    { label: "Registered agent on file", done: input.hasRegisteredAgent, source: "public" },
    { label: "Formation date known", done: input.hasFormationDate, source: "public" },
    {
      label: input.managementContactComplete
        ? "Full management contact info"
        : "Management contact incomplete",
      done: input.managementContactComplete,
      source: "public",
    },
    { label: "Meeting minutes published", done: false, source: "user" },
  ];

  // ── Legal History ──
  const legalCheckpoints: PillarCheckpoint[] = [
    { label: "Management certificate on file", done: input.hasCertificate, source: "public" },
    { label: "Subdivision identified", done: input.hasSubdivision, source: "public" },
    { label: "CC&R recording data exists", done: input.hasCcrRecording, source: "public" },
    { label: "Court records searched", done: false, source: "user" },
  ];

  // ── Resident Sentiment ──
  const sentimentCheckpoints: PillarCheckpoint[] = [
    {
      label: input.reviewCount > 0
        ? `${input.reviewCount} verified review${input.reviewCount > 1 ? "s" : ""}`
        : "No verified reviews yet",
      done: input.reviewCount > 0,
      source: "user",
    },
    { label: "5+ verified reviews", done: input.reviewCount >= 5, source: "user" },
    { label: "Community forum activity", done: input.hasForumActivity, source: "user" },
  ];

  function buildPillar(
    key: string,
    label: string,
    checkpoints: PillarCheckpoint[]
  ): PillarResult {
    const maxScore = 25;

    // Display score — ALL checkpoints count (honest bars)
    const allDone = checkpoints.filter((c) => c.done).length;
    const allTotal = checkpoints.length;
    const score = Math.round((allDone / allTotal) * maxScore);
    const percent = Math.round((allDone / allTotal) * 100);

    // Public score — only public checkpoints (for projected headline)
    const publicCps = checkpoints.filter((c) => c.source === "public");
    const publicDone = publicCps.filter((c) => c.done).length;
    const publicTotal = publicCps.length;
    const publicScore = publicTotal > 0
      ? Math.round((publicDone / publicTotal) * maxScore)
      : 0;
    const publicMaxScore = publicTotal > 0 ? maxScore : 0;

    const hasData = checkpoints.some((c) => c.done);

    return {
      key,
      label,
      score,
      maxScore,
      percent,
      publicScore,
      publicMaxScore,
      checkpoints,
      hasData,
    };
  }

  const pillars: PillarResult[] = [
    buildPillar("financial", "Financial Health", financialCheckpoints),
    buildPillar("governance", "Governance & Transparency", governanceCheckpoints),
    buildPillar("legal", "Legal History", legalCheckpoints),
    buildPillar("sentiment", "Resident Sentiment", sentimentCheckpoints),
  ];

  // Projected score uses only pillars with public checkpoints that have data
  const publicPillars = pillars.filter(
    (p) => p.publicMaxScore > 0 && p.hasData
  );
  const availablePillars = publicPillars.length;
  const totalPillars = pillars.length;

  let projectedScore: number | null = null;
  if (availablePillars > 0) {
    const earnedPoints = publicPillars.reduce((sum, p) => sum + p.publicScore, 0);
    const maxPoints = availablePillars * 25;
    projectedScore = Math.round((earnedPoints / maxPoints) * 100);

    // Cap at 75 — full score requires community engagement
    if (projectedScore > 75) {
      projectedScore = 75;
    }
  }

  // Entity status penalty
  if (projectedScore != null && !input.entityStatusActive) {
    projectedScore = Math.max(0, projectedScore - 12);
  }

  const allCheckpoints = pillars.flatMap((p) => p.checkpoints);
  const publicAll = allCheckpoints.filter((c) => c.source === "public");
  const publicCompleted = publicAll.filter((c) => c.done).length;

  // Minimum data threshold — fewer than 5 public data points
  // is not enough to produce a fair score
  const MINIMUM_DATA_THRESHOLD = 5;
  const insufficientData = publicCompleted < MINIMUM_DATA_THRESHOLD;

  if (insufficientData) {
    projectedScore = null;
  }

  return {
    projectedScore,
    pillars,
    availablePillars,
    totalPillars,
    isFullScore: false,
    completedCheckpoints: allCheckpoints.filter((c) => c.done).length,
    totalCheckpoints: allCheckpoints.length,
    publicCheckpointsCompleted: publicCompleted,
    publicCheckpointsTotal: publicAll.length,
    insufficientData,
  };
}