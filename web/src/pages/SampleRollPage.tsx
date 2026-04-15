import { useState } from 'react'
import { BiText } from '../components/BiText'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'
import { useRollData } from '../context/RollDataContext'
import { pageTips } from '../i18n/copy'

const SAMPLE_URL = '/sample-electoral-roll.pdf'

export function SampleRollPage() {
  const { t } = useLanguage()
  const { roll, coveragePct, isParsing, parseError, parseFile, resetToDefault } =
    useRollData()

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [selectedName, setSelectedName] = useState('')
  const [lastProcessedName, setLastProcessedName] = useState(roll.sourcePdf)

  return (
    <div className="page page--simple">
      <PageHeader title={t.pdfTitle} subtitle={t.pdfSubtitle} />
      <section className="panel panel--soft">
        <BiText text={pageTips.pdf} compact />
      </section>

      <section className="panel panel--accent">
        <h2>Upload new source file</h2>
        <p className="panel__lede">
          English: Choose a file, then click Process file.
          Marathi: फाइल निवडा आणि Process file वर क्लिक करा.
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

          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              resetToDefault()
              setPendingFile(null)
              setSelectedName('')
              setLastProcessedName('sample-electoral-roll.pdf')
            }}
          >
            Reset to default
          </button>
        </div>

        {selectedName ? <p className="muted">Selected: {selectedName}</p> : null}
        <p className="success-text">Last processed: {lastProcessedName}</p>
        {parseError ? <p className="error-text">{parseError}</p> : null}
      </section>

      <section className="panel panel--accent">
        <h2>Extraction summary</h2>
        <ul className="kv-list kv-list--tight">
          <li>
            <span>Source code</span>
            <span>{roll.partCode}</span>
          </li>
          <li>
            <span>Extracted at (UTC)</span>
            <span className="muted">{roll.extractedAt}</span>
          </li>
          <li>
            <span>Cover totals</span>
            <span>
              पुरुष {roll.summaryFromPdfCover.male ?? '—'} · स्त्री{' '}
              {roll.summaryFromPdfCover.female ?? '—'} · एकूण{' '}
              {roll.summaryFromPdfCover.total ?? '—'}
            </span>
          </li>
          <li>
            <span>Machine-parse quality</span>
            <span>
              {roll.parsedVoterRows} rows with EPIC + age ·{' '}
              {coveragePct === null ? '—' : `${coveragePct}%`} of cover total
            </span>
          </li>
        </ul>
        <p className="panel__foot">{roll.extractionNote}</p>
      </section>

      <section className="panel">
        <div className="pdf-actions">
          <a className="btn" href={SAMPLE_URL} download>
            Download default file
          </a>
          <a
            className="btn btn--ghost"
            href={SAMPLE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open default in new tab
          </a>
        </div>
        <div className="pdf-frame">
          <iframe title="Source record viewer" src={SAMPLE_URL} />
        </div>
      </section>
    </div>
  )
}
