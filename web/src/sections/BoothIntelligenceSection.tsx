import { useMemo, useState } from 'react'
import { BiText } from '../components/BiText'
import { StatCard } from '../components/StatCard'
import { useLanguage } from '../context/LanguageContext'
import { useRollData } from '../context/RollDataContext'
import { pageTips } from '../i18n/copy'
import type { UrbanRural } from '../types'

function dash(n: number | null | undefined) {
  if (n === null || n === undefined) return '—'
  return String(n)
}

function netPill(net: number | null) {
  if (net === null) {
    return <span className="pill pill--muted">—</span>
  }
  return (
    <span className={net >= 0 ? 'pill pill--pos' : 'pill pill--neg'}>
      {net >= 0 ? '+' : ''}
      {net}
    </span>
  )
}

export function BoothIntelligenceSection() {
  const { t } = useLanguage()
  const { roll, coveragePct, boothDeltas, schemeOverlay, swingRisks } = useRollData()
  const [segment, setSegment] = useState<string>('all')

  const segments = useMemo(() => {
    const s = new Set(boothDeltas.map((b) => b.segment))
    return ['all', ...Array.from(s)]
  }, [boothDeltas])

  const filtered = useMemo(() => {
    if (segment === 'all') return boothDeltas
    return boothDeltas.filter((b) => b.segment === segment)
  }, [segment, boothDeltas])

  const urbanRuralBreakdown = useMemo(() => {
    const tally: Record<UrbanRural, { added: number; booths: number }> = {
      urban: { added: 0, booths: 0 },
      rural: { added: 0, booths: 0 },
      'semi-urban': { added: 0, booths: 0 },
    }
    for (const b of filtered) {
      if (b.netChange === null || b.netChange <= 0) continue
      tally[b.urbanRural].booths += 1
      tally[b.urbanRural].added += b.netChange
    }
    return tally
  }, [filtered])

  const youngAdds = filtered.reduce(
    (a, b) => a + (b.youngAdded1825 ?? 0),
    0,
  )
  const youngCohort = filtered.reduce(
    (a, b) => a + (b.youngCohort1825 ?? 0),
    0,
  )

  const netValues = filtered
    .map((b) => b.netChange)
    .filter((n): n is number => n !== null)

  const maxBucket = Math.max(...Object.values(roll.ageBuckets), 1)

  return (
    <section id="case-booth" className="merge-section">
      <header className="merge-section__head">
        <h2 className="merge-section__title">{t.boothTitle}</h2>
        <p className="merge-section__sub">{t.boothSubtitle}</p>
      </header>
      <section className="panel panel--soft">
        <BiText text={pageTips.booth} compact />
      </section>

      <section className="panel panel--accent">
        <h3 className="merge-h3">Live extract — {roll.partCode}</h3>
        <p className="panel__lede">{roll.areaLabelMr}</p>
        <ul className="kv-list kv-list--tight">
          <li>
            <span>पुरुष / स्त्री / एकूण (निघालेली नोंद)</span>
            <span>
              {dash(roll.summaryFromPdfCover.male)} /{' '}
              {dash(roll.summaryFromPdfCover.female)} /{' '}
              {dash(roll.summaryFromPdfCover.total)}
            </span>
          </li>
          <li>
            <span>Parsed rows (EPIC + वय)</span>
            <span>
              {roll.parsedVoterRows} · Unique EPIC {roll.uniqueEpics} ·
              Duplicate EPICs {roll.duplicateEpicCount}
            </span>
          </li>
          <li>
            <span>Text coverage vs total</span>
            <span>{coveragePct === null ? '—' : `${coveragePct}%`}</span>
          </li>
          <li>
            <span>Age range (parsed)</span>
            <span>
              {roll.ageStats.min}–{roll.ageStats.max} (avg {roll.ageStats.avg})
            </span>
          </li>
        </ul>
        <div className="age-histo" aria-label="Age buckets from extracted records">
          {(Object.entries(roll.ageBuckets) as [string, number][]).map(
            ([label, count]) => (
              <div key={label} className="age-histo__row">
                <span>{label}</span>
                <div className="age-histo__bar">
                  <div
                    style={{ width: `${(count / maxBucket) * 100}%` }}
                    title={`${count} electors`}
                  />
                </div>
                <span className="age-histo__n">{count}</span>
              </div>
            ),
          )}
        </div>
        <p className="panel__foot">{roll.extractionNote}</p>
      </section>

      <section className="toolbar">
        <label className="field">
          <span>Assembly / planning segment</span>
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            aria-label="Filter by segment"
          >
            {segments.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All segments' : s}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="grid grid--stats">
        <StatCard
          title="Booths in view"
          value={String(filtered.length)}
          hint="Includes extracted part + scenarios"
        />
        <StatCard
          title="Youth cohort (18–25, roll)"
          value={String(youngCohort)}
          hint="Counted from extracted age values"
        />
        <StatCard
          title="Youth Δ (SIR, scenario rows)"
          value={String(youngAdds)}
          hint="Requires pre-roll pairing for extracted row"
        />
        <StatCard
          title="Largest net gain (scenario)"
          value={netValues.length ? String(Math.max(...netValues)) : '—'}
          hint="Extracted row hides net until baseline is loaded"
        />
      </section>

      <section className="panel">
        <h3 className="merge-h3">Booth / part delta table</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booth / part</th>
                <th>Constituency</th>
                <th>Segment</th>
                <th>Pre-SIR</th>
                <th>Post-SIR</th>
                <th>Net</th>
                <th>18–25 cohort</th>
                <th>18–25 Δ</th>
                <th>Geo class</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.boothId}>
                  <td>
                    <span className="muted">{b.boothId}</span>
                    <br />
                    {b.boothName}
                    {b.notes ? (
                      <>
                        <br />
                        <span className="muted tiny">{b.notes}</span>
                      </>
                    ) : null}
                  </td>
                  <td>{b.constituency}</td>
                  <td>{b.segment}</td>
                  <td>{dash(b.preSir)}</td>
                  <td>{dash(b.postSir)}</td>
                  <td>{netPill(b.netChange)}</td>
                  <td>{dash(b.youngCohort1825)}</td>
                  <td>{dash(b.youngAdded1825)}</td>
                  <td>{b.urbanRural}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid--two">
        <div className="panel">
          <h3 className="merge-h3">Urban / rural / semi-urban — net positive adds</h3>
          <p className="panel__lede">
            Only scenario rows with positive net deltas contribute here. Add a
            baseline source record next to this part to unlock deltas.
          </p>
          <ul className="kv-list">
            {(
              Object.entries(urbanRuralBreakdown) as [
                UrbanRural,
                { added: number; booths: number },
              ][]
            ).map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <span>
                  +{v.added} across {v.booths} booth(s)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3 className="merge-h3">Swing risk (ML-style score)</h3>
          <p className="panel__lede">
            Higher score when tight historical margins meet large roll deltas.
          </p>
          <ul className="risk-list">
            {swingRisks.map((s) => (
              <li key={s.constituency}>
                <div>
                  <strong>{s.constituency}</strong>
                  <span className="muted">
                    Margin {s.seatMarginPct}% · Roll Δ{' '}
                    {s.netRollChange >= 0 ? '+' : ''}
                    {s.netRollChange}
                  </span>
                </div>
                <span className={`badge badge--${s.label}`}>
                  {(s.riskScore * 100).toFixed(0)} / 100 — {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <h3 className="merge-h3">Scheme beneficiary overlay</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scheme</th>
                <th>Booth</th>
                <th>Beneficiaries</th>
              </tr>
            </thead>
            <tbody>
              {schemeOverlay.map((row) => (
                <tr key={`${row.scheme}-${row.boothId}`}>
                  <td>{row.scheme}</td>
                  <td>{row.boothId}</td>
                  <td>
                    {row.beneficiaryCount === null
                      ? '—'
                      : row.beneficiaryCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
