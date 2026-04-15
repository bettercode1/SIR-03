import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { DuplicateEntry, RollPdfExtract } from '../types'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

function nowIso(): string {
  return new Date().toISOString()
}

function parsePartCode(fullText: string): { partCode: string; assembly: number | null; part: string | null } {
  const match = fullText.match(/[A-Z]{2}\/\d{3}\/\d{4}/)
  if (!match) {
    return { partCode: 'unknown', assembly: null, part: null }
  }

  const [prefix, ac, part] = match[0].split('/')
  if (!prefix || !ac || !part) {
    return { partCode: 'unknown', assembly: null, part: null }
  }

  return { partCode: match[0], assembly: Number(ac), part }
}

function parseCoverTotals(firstPageText: string): { male: number | null; female: number | null; total: number | null } {
  const m = firstPageText.match(/\n\s*(\d{3})\s*\n\s*(\d{3})\s*\n\s*(\d{3})\s*\n/)
  if (!m) {
    return { male: null, female: null, total: null }
  }
  return {
    male: Number(m[1]),
    female: Number(m[2]),
    total: Number(m[3]),
  }
}

function parseAgeEpicPairs(fullText: string): Array<{ age: number; epic: string }> {
  const matches = [...fullText.matchAll(/(?<!\d)(\d{1,3})\s*\n\s*(0\d{6})\b/g)]
  return matches.map((m) => ({ age: Number(m[1]), epic: m[2] }))
}

function buildAgeBuckets(ages: number[]): Record<'18-25' | '26-35' | '36-50' | '51-65' | '66+', number> {
  const buckets = { '18-25': 0, '26-35': 0, '36-50': 0, '51-65': 0, '66+': 0 }

  for (const age of ages) {
    if (age <= 25) buckets['18-25'] += 1
    else if (age <= 35) buckets['26-35'] += 1
    else if (age <= 50) buckets['36-50'] += 1
    else if (age <= 65) buckets['51-65'] += 1
    else buckets['66+'] += 1
  }

  return buckets
}

function isLikelyNameLine(line: string): boolean {
  if (!line) return false
  if (/^0\d{6}$/.test(line)) return false
  if (/^\d+$/.test(line)) return false
  if (/^[A-Z]{2}\/\d{3}\/\d{4}$/.test(line)) return false
  if (line.length < 2) return false
  return true
}

function pickNearestName(lines: string[], epicLineIdx: number): string {
  for (let i = epicLineIdx - 1; i >= Math.max(0, epicLineIdx - 4); i -= 1) {
    const candidate = lines[i]?.trim() ?? ''
    if (isLikelyNameLine(candidate)) {
      return candidate
    }
  }
  return 'Name not extracted'
}

function parseDuplicateEntries(fullText: string, duplicateEpics: string[]): DuplicateEntry[] {
  if (!duplicateEpics.length) return []

  const duplicateSet = new Set(duplicateEpics)
  const lines = fullText
    .split(/\r?\n/)
    .map((line) => line.trim())

  const rawEntries: DuplicateEntry[] = []
  lines.forEach((line, idx) => {
    if (!duplicateSet.has(line)) return
    rawEntries.push({ epic: line, name: pickNearestName(lines, idx) })
  })

  const seen = new Set<string>()
  const uniqueEntries: DuplicateEntry[] = []
  for (const entry of rawEntries) {
    const key = `${entry.epic}-${entry.name}`
    if (seen.has(key)) continue
    seen.add(key)
    uniqueEntries.push(entry)
  }

  return uniqueEntries
}

export async function parseRollSourceFile(file: File): Promise<RollPdfExtract> {
  const data = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data })
  const pdf = await loadingTask.promise

  const pageTexts: string[] = []
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join('\n')
    pageTexts.push(text)
  }

  const fullText = pageTexts.join('\n')
  const firstPageText = pageTexts[0] ?? ''

  const { partCode, assembly, part } = parsePartCode(fullText)
  const totals = parseCoverTotals(firstPageText)

  const pairs = parseAgeEpicPairs(fullText)
  const ages = pairs.map((pair) => pair.age)
  const uniqueEpics = new Set(pairs.map((pair) => pair.epic))

  const epicCounts = new Map<string, number>()
  for (const { epic } of pairs) {
    epicCounts.set(epic, (epicCounts.get(epic) ?? 0) + 1)
  }
  const duplicateEpicNumbers = [...epicCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([epic]) => epic)
    .sort()

  const duplicateEntries = parseDuplicateEntries(fullText, duplicateEpicNumbers)
  const safeAges = ages.length ? ages : [0]
  const ageBuckets = buildAgeBuckets(ages)

  return {
    sourcePdf: file.name,
    extractedAt: nowIso(),
    partCode,
    assemblyNumber: assembly,
    partNumber: part,
    areaLabelMr: 'अपलोड केलेली स्रोत नोंद',
    areaLabelEn: `Uploaded source (${file.name})`,
    urbanRuralHint: 'semi-urban',
    summaryFromPdfCover: totals,
    parsedVoterRows: pairs.length,
    uniqueEpics: uniqueEpics.size,
    duplicateEpicNumbers,
    duplicateEpicCount: duplicateEpicNumbers.length,
    duplicateEntries,
    ageStats: {
      min: Math.min(...safeAges),
      max: Math.max(...safeAges),
      avg: Number((safeAges.reduce((a, b) => a + b, 0) / safeAges.length).toFixed(2)),
    },
    ageBuckets,
    youngVoters1825: ageBuckets['18-25'],
    extractionNote:
      'Data extracted in browser from uploaded source file. For better Marathi names/address extraction, use Devanagari OCR pipeline on backend.',
  }
}
