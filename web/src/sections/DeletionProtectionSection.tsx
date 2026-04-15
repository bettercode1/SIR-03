import { useEffect, useState } from 'react'
import { BiText } from '../components/BiText'
import { StatCard } from '../components/StatCard'
import { useLanguage } from '../context/LanguageContext'
import { useRollData } from '../context/RollDataContext'
import { pageTips } from '../i18n/copy'

const reasonTemplates = [
  {
    id: 'clerical',
    label: 'Clerical deletion',
    text: 'Name present in family ration card and previous published roll; deletion appears clerical.',
  },
  {
    id: 'resident',
    label: 'Resident proof available',
    text: 'Voter is resident at same address and can provide address proof and prior voter record.',
  },
  {
    id: 'family',
    label: 'Family still listed',
    text: 'Other family members remain in the same part list; removal appears inconsistent and needs correction.',
  },
]

export function DeletionProtectionSection() {
  const { t } = useLanguage()
  const { roll, deletionClusters } = useRollData()

  const [voterName, setVoterName] = useState('')
  const [relation, setRelation] = useState('son/daughter of')
  const [partNo, setPartNo] = useState(roll.partNumber ?? '')
  const [serialNo, setSerialNo] = useState('')
  const [boothAddress, setBoothAddress] = useState(
    `ERO / Assembly ${roll.assemblyNumber ?? '—'} — ${roll.areaLabelEn}`,
  )
  const [reason, setReason] = useState(reasonTemplates[0].text)

  useEffect(() => {
    setPartNo(roll.partNumber ?? '')
    setBoothAddress(`ERO / Assembly ${roll.assemblyNumber ?? '—'} — ${roll.areaLabelEn}`)
  }, [roll])

  const elevated = deletionClusters.filter((c) => c.alertLevel !== 'watch').length
  const critical = deletionClusters.filter((c) => c.alertLevel === 'critical').length

  return (
    <section id="case-deletion" className="merge-section">
      <header className="merge-section__head">
        <h2 className="merge-section__title">{t.deletionTitle}</h2>
        <p className="merge-section__sub">{t.deletionSubtitle}</p>
      </header>

      <section className="panel panel--soft">
        <BiText text={pageTips.deletion} compact />
      </section>

      <section className="grid grid--three">
        <article className="mini-card">
          <p className="mini-card__label">High-risk checks</p>
          <p className="mini-card__value">{critical}</p>
          <p className="mini-card__hint">critical clusters</p>
        </article>
        <article className="mini-card">
          <p className="mini-card__label">Need review</p>
          <p className="mini-card__value">{elevated}</p>
          <p className="mini-card__hint">elevated + critical</p>
        </article>
        <article className="mini-card">
          <p className="mini-card__label">Duplicate IDs</p>
          <p className="mini-card__value">{roll.duplicateEpicCount}</p>
          <p className="mini-card__hint">same number appears twice</p>
        </article>
      </section>

      <section className="panel panel--accent">
        <h3 className="dual-heading merge-h3">
          <span lang="en">List check — same number twice</span>
          <span className="muted"> · </span>
          <span lang="mr">यादी तपास — एकच क्रमांक दोनदा</span>
        </h3>
        <p className="panel__lede">
          <span lang="en">
            {roll.duplicateEpicCount} voter numbers appear more than once in {roll.partCode}. This means “check carefully”, not “these people were deleted”.
          </span>
        </p>
        <p className="panel__lede" lang="mr">
          {roll.partCode} मध्ये {roll.duplicateEpicCount} मतदार क्रमांक दोनदा आहेत. याचा अर्थ “काळजीपूर्वक तपासा”; “हे मतदार काढले” असा नाही.
        </p>

        <div className="chip-scroll" aria-label="Duplicate EPIC numbers">
          {roll.duplicateEpicNumbers.map((epic) => (
            <span key={epic} className="chip">
              {epic}
            </span>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="merge-h3">What to do next</h3>
        <ol className="steps-list">
          <li>Check duplicate IDs against booth register and family records.</li>
          <li>Send high-risk rows to BLA team using the action button below.</li>
          <li>Prepare objection details and submit with proof documents.</li>
        </ol>
      </section>

      <section className="grid grid--stats">
        <StatCard
          title="Signals monitored"
          value={String(deletionClusters.length)}
          hint="Extracted duplicate row + scenario spikes"
        />
        <StatCard
          title="Elevated + critical"
          value={String(elevated)}
          hint="Would trigger BLA push"
        />
        <StatCard
          title="Highest z-score"
          value={deletionClusters.reduce((m, c) => Math.max(m, c.zScore), 0).toFixed(1)}
          hint="Scenario baselines only"
        />
      </section>

      <section className="panel">
        <h3 className="merge-h3">Draft-roll anomaly monitor</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mandal / part</th>
                <th>ID</th>
                <th>Count</th>
                <th>Baseline avg</th>
                <th>Z-score</th>
                <th>Alert</th>
                <th>Issue</th>
                <th>BLA action</th>
              </tr>
            </thead>
            <tbody>
              {deletionClusters.map((c) => (
                <tr key={`${c.mandal}-${c.boothId}-${c.issueLabel ?? ''}`}>
                  <td>{c.mandal}</td>
                  <td>{c.boothId}</td>
                  <td>{c.deletions}</td>
                  <td>{c.baselineAvg}</td>
                  <td>{c.zScore.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge--${c.alertLevel}`}>
                      {c.alertLevel}
                    </span>
                  </td>
                  <td className="muted small-cell">{c.issueLabel ?? '—'}</td>
                  <td>
                    <button type="button" className="btn btn--ghost">
                      Notify BLA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3 className="merge-h3">Mass objection filing tool</h3>
        <p className="panel__lede">
          Fill only basic details. Copy these values to your official objection form.
        </p>

        <div className="quick-reasons" role="group" aria-label="Quick reason templates">
          {reasonTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={
                reason === template.text
                  ? 'quick-reason quick-reason--active'
                  : 'quick-reason'
              }
              onClick={() => setReason(template.text)}
            >
              {template.label}
            </button>
          ))}
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Voter name</span>
            <input value={voterName} onChange={(e) => setVoterName(e.target.value)} autoComplete="name" />
          </label>
          <label className="field">
            <span>Relation</span>
            <input value={relation} onChange={(e) => setRelation(e.target.value)} />
          </label>
          <label className="field">
            <span>Part number</span>
            <input value={partNo} onChange={(e) => setPartNo(e.target.value)} />
          </label>
          <label className="field">
            <span>Serial / EPIC number</span>
            <input
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              placeholder="e.g. 0001144"
            />
          </label>
          <label className="field field--full">
            <span>ERO / constituency</span>
            <input value={boothAddress} onChange={(e) => setBoothAddress(e.target.value)} />
          </label>
          <label className="field field--full">
            <span>Grounds</span>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
        </div>
      </section>
    </section>
  )
}
