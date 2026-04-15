import type {
  BoothDelta,
  DeletionCluster,
  MobilizationSegment,
  RollPdfExtract,
  SchemeOverlay,
  SentimentSlice,
  SwingRisk,
} from '../types'

export const scenarioBoothDeltas: BoothDelta[] = [
  {
    boothId: 'B-212',
    boothName: 'Village Square — Ward 12',
    constituency: 'Shirur',
    segment: 'Rural belt',
    preSir: 942,
    postSir: 901,
    netChange: -41,
    youngAdded1825: 6,
    urbanRural: 'rural',
  },
  {
    boothId: 'B-088',
    boothName: 'Industrial estate booth',
    constituency: 'Hadapsar',
    segment: 'East Pune',
    preSir: 1566,
    postSir: 1628,
    netChange: 62,
    youngAdded1825: 48,
    urbanRural: 'semi-urban',
  },
  {
    boothId: 'B-301',
    boothName: 'Gram Panchayat office',
    constituency: 'Baramati',
    segment: 'Peripheral',
    preSir: 1105,
    postSir: 1098,
    netChange: -7,
    youngAdded1825: 11,
    urbanRural: 'rural',
  },
]

export const swingRisks: SwingRisk[] = [
  {
    constituency: 'Shirur',
    seatMarginPct: 1.8,
    netRollChange: -312,
    riskScore: 0.78,
    label: 'high',
  },
  {
    constituency: 'Hadapsar',
    seatMarginPct: 3.4,
    netRollChange: 186,
    riskScore: 0.41,
    label: 'medium',
  },
  {
    constituency: 'Kasba Peth',
    seatMarginPct: 6.1,
    netRollChange: 54,
    riskScore: 0.22,
    label: 'low',
  },
]

export const scenarioSchemeOverlay: SchemeOverlay[] = [
  { scheme: 'PM Awas Yojana', boothId: 'B-088', beneficiaryCount: 41 },
  { scheme: 'PM-KISAN', boothId: 'B-212', beneficiaryCount: 128 },
  { scheme: 'Ujjwala', boothId: 'B-301', beneficiaryCount: 63 },
]

export const scenarioDeletionClusters: DeletionCluster[] = [
  {
    mandal: 'Shirur',
    boothId: 'B-212',
    deletions: 41,
    baselineAvg: 9,
    zScore: 3.4,
    alertLevel: 'critical',
    issueLabel: 'Simulated deletion spike vs mandal baseline',
  },
  {
    mandal: 'Baramati',
    boothId: 'B-301',
    deletions: 18,
    baselineAvg: 11,
    zScore: 1.2,
    alertLevel: 'watch',
    issueLabel: 'Simulated draft-roll watch band',
  },
  {
    mandal: 'Hadapsar',
    boothId: 'B-088',
    deletions: 12,
    baselineAvg: 14,
    zScore: -0.4,
    alertLevel: 'watch',
    issueLabel: 'Simulated draft-roll watch band',
  },
]

export const scenarioMobilizationSegments: MobilizationSegment[] = [
  {
    assemblySegment: 'Hadapsar — East (scenario)',
    newVotersTotal: 186,
    newVoters1825: 112,
    outreachTemplate: {
      en: 'Hello — your voter registration has been updated. Ask your booth worker for polling station and time.',
      mr: 'नमस्कार — तुमचे मतदार नोंदणी अद्ययावत झाले आहे. मतदान केंद्र व वेळ बूथ कार्यकर्त्याकडून विचारा.',
    },
  },
  {
    assemblySegment: 'Kasba Peth — Core (scenario)',
    newVotersTotal: 74,
    newVoters1825: 51,
    outreachTemplate: {
      en: 'Hello — your name is on the new voter list. You can download a digital booth slip when your office enables it.',
      mr: 'नमस्कार — नवीन मतदार यादीत तुमचे नाव नोंदवले आहे. कार्यालयानुसार डिजिटल बूथ स्लिप उपलब्ध होईल.',
    },
  },
]

export const sentimentSlices: SentimentSlice[] = [
  {
    topic: 'SIR — सामान्य',
    positivePct: 38,
    negativePct: 44,
    neutralPct: 18,
    samplePosts: 12400,
  },
  {
    topic: 'नाम हटाव / आपत्ती',
    positivePct: 22,
    negativePct: 61,
    neutralPct: 17,
    samplePosts: 8200,
  },
  {
    topic: 'युवा मतदाता',
    positivePct: 51,
    negativePct: 29,
    neutralPct: 20,
    samplePosts: 5600,
  },
]

export function buildDerivedRows(roll: RollPdfExtract) {
  const sourceBoothRow: BoothDelta = {
    boothId: roll.partCode,
    boothName: roll.areaLabelEn,
    constituency: `Maharashtra — विधानसभा ${roll.assemblyNumber ?? '—'}`,
    segment: 'Uploaded source extract',
    preSir: null,
    postSir: roll.summaryFromPdfCover.total ?? roll.parsedVoterRows,
    netChange: null,
    youngAdded1825: null,
    youngCohort1825: roll.youngVoters1825,
    urbanRural: roll.urbanRuralHint,
    notes: roll.extractionNote,
  }

  const sourceDeletionRow: DeletionCluster = {
    mandal: `Source check — ${roll.partCode}`,
    boothId: roll.partCode,
    deletions: roll.duplicateEpicCount,
    baselineAvg: 2,
    zScore: 6.2,
    alertLevel: roll.duplicateEpicCount > 0 ? 'elevated' : 'watch',
    issueLabel:
      'Duplicate EPIC occurrences in uploaded source record (data integrity review, not deletion count).',
  }

  const sourceMobilizationRow: MobilizationSegment = {
    assemblySegment: `AC ${roll.assemblyNumber ?? '—'} — Part ${roll.partNumber ?? '—'} (${roll.areaLabelMr})`,
    newVotersTotal: roll.parsedVoterRows,
    newVoters1825: roll.youngVoters1825,
    fromPdfExtract: true,
    outreachTemplate: {
      en: `Hello — this voter list is extracted from part ${roll.partNumber ?? '—'}. Please confirm polling station with local booth team.`,
      mr: `नमस्कार — ही मतदार यादी भाग ${roll.partNumber ?? '—'} मधून एक्स्ट्रॅक्ट केली आहे. मतदान केंद्राची खात्री स्थानिक बूथ टीमकडून करा.`,
    },
  }

  const sourceSchemeRow: SchemeOverlay = {
    scheme: 'PM Awas / PM-KISAN / Ujjwala (crosswalk pending)',
    boothId: roll.partCode,
    beneficiaryCount: null,
  }

  return {
    boothDeltas: [sourceBoothRow, ...scenarioBoothDeltas],
    deletionClusters: [sourceDeletionRow, ...scenarioDeletionClusters],
    mobilizationSegments: [sourceMobilizationRow, ...scenarioMobilizationSegments],
    schemeOverlay: [sourceSchemeRow, ...scenarioSchemeOverlay],
  }
}
