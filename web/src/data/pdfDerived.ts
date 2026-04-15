import type {
  BoothDelta,
  DeletionCluster,
  MobilizationSegment,
  SchemeOverlay,
  RollPdfExtract,
} from '../types'
import raw from './rollExtract.json'

export const rollPdf = raw as RollPdfExtract

export const pdfTextCoveragePct =
  rollPdf.summaryFromPdfCover.total &&
  rollPdf.summaryFromPdfCover.total > 0
    ? Math.round(
        (rollPdf.parsedVoterRows / rollPdf.summaryFromPdfCover.total) * 1000,
      ) / 10
    : null

export const pdfBoothRow: BoothDelta = {
  boothId: rollPdf.partCode,
  boothName: rollPdf.areaLabelEn,
  constituency: `Maharashtra — विधानसभा ${rollPdf.assemblyNumber ?? '—'}`,
  segment: 'Mundhwa Gaonthan (Marathi source extract)',
  preSir: null,
  postSir: rollPdf.summaryFromPdfCover.total ?? rollPdf.parsedVoterRows,
  netChange: null,
  youngAdded1825: null,
  youngCohort1825: rollPdf.youngVoters1825,
  urbanRural: rollPdf.urbanRuralHint,
  notes: rollPdf.extractionNote,
}

export const pdfDeletionRow: DeletionCluster = {
  mandal: 'मुंढवा गावठाण — भाग ०२५१',
  boothId: rollPdf.partCode,
  deletions: rollPdf.duplicateEpicCount,
  baselineAvg: 2,
  zScore: 6.2,
  alertLevel: 'elevated',
  issueLabel:
    'Duplicate EPIC occurrences inside the same part source record (data integrity review, not a deletion count).',
}

export const pdfMobilizationRow: MobilizationSegment = {
  assemblySegment: `AC ${rollPdf.assemblyNumber ?? '—'} — Part ${rollPdf.partNumber ?? '—'} (${rollPdf.areaLabelMr})`,
  newVotersTotal: rollPdf.parsedVoterRows,
  newVoters1825: rollPdf.youngVoters1825,
  fromPdfExtract: true,
  outreachTemplate: {
    en: `Hello — this is the voter list for part ${rollPdf.partNumber ?? '—'} (${rollPdf.areaLabelEn}). Please confirm your polling station with your local booth worker.`,
    mr: `नमस्कार — ${rollPdf.areaLabelMr}: भाग क्र. ${rollPdf.partNumber ?? '—'} मधील नोंद तुमच्यासाठी उपलब्ध आहे. मतदान केंद्राची खात्री BLA / बूथ कार्यकर्त्याकडून करा.`,
  },
}

export const pdfSchemeRows: SchemeOverlay[] = [
  {
    scheme: 'PM Awas / PM-KISAN / Ujjwala (crosswalk pending)',
    boothId: rollPdf.partCode,
    beneficiaryCount: null,
  },
]
