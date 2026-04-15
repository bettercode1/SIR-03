import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import rawRoll from '../data/rollExtract.json'
import {
  buildDerivedRows,
  sentimentSlices,
  swingRisks,
} from '../data/mockData'
import { parseRollSourceFile } from '../lib/parseRollSource'
import type { RollPdfExtract } from '../types'

type RollDataValue = {
  roll: RollPdfExtract
  coveragePct: number | null
  boothDeltas: ReturnType<typeof buildDerivedRows>['boothDeltas']
  deletionClusters: ReturnType<typeof buildDerivedRows>['deletionClusters']
  mobilizationSegments: ReturnType<typeof buildDerivedRows>['mobilizationSegments']
  schemeOverlay: ReturnType<typeof buildDerivedRows>['schemeOverlay']
  swingRisks: typeof swingRisks
  sentimentSlices: typeof sentimentSlices
  isParsing: boolean
  parseError: string | null
  parseFile: (file: File) => Promise<boolean>
  resetToDefault: () => void
}

const defaultRoll = rawRoll as RollPdfExtract

const RollDataContext = createContext<RollDataValue | null>(null)

export function RollDataProvider({ children }: { children: ReactNode }) {
  const [roll, setRoll] = useState<RollPdfExtract>(defaultRoll)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  const parseFile = useCallback(async (file: File): Promise<boolean> => {
    setIsParsing(true)
    setParseError(null)
    try {
      const parsed = await parseRollSourceFile(file)
      setRoll(parsed)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse file'
      setParseError(message)
      return false
    } finally {
      setIsParsing(false)
    }
  }, [])

  const resetToDefault = useCallback(() => {
    setRoll(defaultRoll)
    setParseError(null)
  }, [])

  const coveragePct = useMemo(() => {
    const total = roll.summaryFromPdfCover.total
    if (!total || total <= 0) return null
    return Math.round((roll.parsedVoterRows / total) * 1000) / 10
  }, [roll])

  const derived = useMemo(() => buildDerivedRows(roll), [roll])

  const value = useMemo<RollDataValue>(
    () => ({
      roll,
      coveragePct,
      boothDeltas: derived.boothDeltas,
      deletionClusters: derived.deletionClusters,
      mobilizationSegments: derived.mobilizationSegments,
      schemeOverlay: derived.schemeOverlay,
      swingRisks,
      sentimentSlices,
      isParsing,
      parseError,
      parseFile,
      resetToDefault,
    }),
    [roll, coveragePct, derived, isParsing, parseError, parseFile, resetToDefault],
  )

  return (
    <RollDataContext.Provider value={value}>
      {children}
    </RollDataContext.Provider>
  )
}

export function useRollData() {
  const ctx = useContext(RollDataContext)
  if (!ctx) {
    throw new Error('useRollData must be used inside RollDataProvider')
  }
  return ctx
}
