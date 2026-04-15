import { useState } from 'react'
import { StatCard } from '../components/StatCard'
import { useLanguage } from '../context/LanguageContext'
import { useRollData } from '../context/RollDataContext'
import { BoothIntelligenceSection } from '../sections/BoothIntelligenceSection'
import { DeletionProtectionSection } from '../sections/DeletionProtectionSection'
import { MobilizationSection } from '../sections/MobilizationSection'

export function MergedWorkflowPage() {
  const { t } = useLanguage()
  const { roll, deletionClusters, isParsing, parseError, parseFile } = useRollData()

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [selectedName, setSelectedName] = useState('')
  const [lastProcessedName, setLastProcessedName] = useState(roll.sourcePdf)

  const criticalAlerts = deletionClusters.filter(
    (c) => c.alertLevel === 'critical',
  ).length

  return (
    <div className="page page--simple page--merged">
      <section className="panel panel--accent">
        <h2>Update dashboard data</h2>
        <p className="panel__lede">
          Choose file → Process file. Dashboard stats change only after processing.
        </p>
        <div className="upload-row">
          <label className="upload-picker">
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setPendingFile(file)
                setSelectedName(file?.name ?? '')
              }}
            />
            <span>Choose file</span>
          </label>

          <button
            type="button"
            className="btn"
            disabled={!pendingFile || isParsing}
            onClick={async () => {
              if (!pendingFile) return
              const ok = await parseFile(pendingFile)
              if (ok) {
                setLastProcessedName(pendingFile.name)
                setPendingFile(null)
              }
            }}
          >
            {isParsing ? 'Processing...' : 'Process file'}
          </button>
        </div>
        {selectedName ? <p className="muted">Selected: {selectedName}</p> : null}
        <p className="success-text">Last processed: {lastProcessedName}</p>
        {parseError ? <p className="error-text">{parseError}</p> : null}
      </section>

      <section className="grid grid--stats merge-top-stats" aria-label="Summary">
        <StatCard
          title={t.statTotal}
          value={
            roll.summaryFromPdfCover.total === null
              ? '—'
              : String(roll.summaryFromPdfCover.total)
          }
          hint={`${t.statTotalHint}: ${roll.summaryFromPdfCover.male ?? '—'} / ${roll.summaryFromPdfCover.female ?? '—'}`}
        />
        <StatCard
          title={t.statDup}
          value={String(roll.duplicateEpicCount)}
          hint={t.statDupHint}
        />
        <StatCard
          title={t.statYouth}
          value={String(roll.youngVoters1825)}
          hint={t.statYouthHint}
        />
        <StatCard
          title={t.statScenario}
          value={String(criticalAlerts)}
          hint={t.statScenarioHint}
        />
      </section>

      <BoothIntelligenceSection />
      <DeletionProtectionSection />
      <MobilizationSection />
    </div>
  )
}
