export type UrbanRural = 'urban' | 'rural' | 'semi-urban'

export interface BoothDelta {
  boothId: string
  boothName: string
  constituency: string
  segment: string
  /** Null when only the post-revision source record is loaded */
  preSir: number | null
  postSir: number
  /** Null until a baseline roll is paired */
  netChange: number | null
  /** Null until pre/post diff is computed */
  youngAdded1825: number | null
  /** Ages 18–25 counted inside this roll snapshot (from extracted text) */
  youngCohort1825?: number
  urbanRural: UrbanRural
  notes?: string
}

export interface SwingRisk {
  constituency: string
  seatMarginPct: number
  netRollChange: number
  riskScore: number
  label: 'low' | 'medium' | 'high'
}

export interface SchemeOverlay {
  scheme: string
  boothId: string
  beneficiaryCount: number | null
}

export interface DeletionCluster {
  mandal: string
  boothId: string
  deletions: number
  baselineAvg: number
  zScore: number
  alertLevel: 'watch' | 'elevated' | 'critical'
  /** Human-readable reason shown in the console */
  issueLabel?: string
}

export interface MobilizationSegment {
  assemblySegment: string
  newVotersTotal: number
  newVoters1825: number
  outreachTemplate: { en: string; mr: string }
  /** When true, counts come from OCR/text extraction, not a forecast model */
  fromPdfExtract?: boolean
}

export interface SentimentSlice {
  topic: string
  positivePct: number
  negativePct: number
  neutralPct: number
  samplePosts: number
}

export interface RollPdfExtract {
  sourcePdf: string
  extractedAt: string
  partCode: string
  assemblyNumber: number | null
  partNumber: string | null
  areaLabelMr: string
  areaLabelEn: string
  urbanRuralHint: UrbanRural
  summaryFromPdfCover: { male: number | null; female: number | null; total: number | null }
  parsedVoterRows: number
  uniqueEpics: number
  duplicateEpicNumbers: string[]
  duplicateEpicCount: number
  ageStats: { min: number; max: number; avg: number }
  ageBuckets: Record<'18-25' | '26-35' | '36-50' | '51-65' | '66+', number>
  youngVoters1825: number
  extractionNote: string
}
