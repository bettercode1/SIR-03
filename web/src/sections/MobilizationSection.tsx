import { BiText } from '../components/BiText'
import { StatCard } from '../components/StatCard'
import { useLanguage } from '../context/LanguageContext'
import { useRollData } from '../context/RollDataContext'
import { pageTips } from '../i18n/copy'

export function MobilizationSection() {
  const { t } = useLanguage()
  const { roll, mobilizationSegments, sentimentSlices } = useRollData()

  const totalNew = mobilizationSegments.reduce((a, b) => a + b.newVotersTotal, 0)
  const totalYoung = mobilizationSegments.reduce((a, b) => a + b.newVoters1825, 0)

  return (
    <section id="case-mobilization" className="merge-section">
      <header className="merge-section__head">
        <h2 className="merge-section__title">{t.mobilizationTitle}</h2>
        <p className="merge-section__sub">{t.mobilizationSubtitle}</p>
      </header>
      <section className="panel panel--soft">
        <BiText text={pageTips.mobilization} compact />
      </section>

      <section className="panel panel--accent">
        <h3 className="merge-h3">What we found in uploaded records</h3>
        <p className="panel__lede">
          Part {roll.partCode} lists {roll.summaryFromPdfCover.total ?? '—'} electors on
          the cover page, while text extraction captured {roll.parsedVoterRows} EPIC+age
          rows ({roll.youngVoters1825} aged 18–25).
        </p>
      </section>

      <section className="grid grid--stats">
        <StatCard
          title="Electors counted (all rows)"
          value={String(totalNew)}
          hint="Extracted rows + scenario forecasts"
        />
        <StatCard
          title="18–25 cohort (all rows)"
          value={String(totalYoung)}
          hint={`Includes ${roll.youngVoters1825} youth from extracted part`}
        />
        <StatCard
          title="Sentiment topics tracked"
          value={String(sentimentSlices.length)}
          hint="Marathi corpus — demo aggregates"
        />
      </section>

      <section className="panel">
        <h3 className="merge-h3">New voter prediction (18–25 focus)</h3>
        <p className="panel__lede">
          Wire your roll-diff pipeline here; the first row is descriptive
          statistics from extracted records, not a model score.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Assembly segment</th>
                <th>Source</th>
                <th>Electors in view</th>
                <th>18–25 share</th>
              </tr>
            </thead>
            <tbody>
              {mobilizationSegments.map((m) => (
                <tr key={m.assemblySegment}>
                  <td>{m.assemblySegment}</td>
                  <td>
                    {m.fromPdfExtract ? (
                      <span className="pill pill--pos">Extracted</span>
                    ) : (
                      <span className="pill pill--muted">Scenario</span>
                    )}
                  </td>
                  <td>{m.newVotersTotal}</td>
                  <td>
                    {Math.round((m.newVoters1825 / Math.max(m.newVotersTotal, 1)) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3 className="dual-heading merge-h3">
          <span lang="en">Personalized voter outreach (English / Marathi)</span>
          <span className="muted"> · </span>
          <span lang="mr">वैयक्तिक मतदार संदेश (इंग्रजी / मराठी)</span>
        </h3>
        <ul className="outreach-list">
          {mobilizationSegments.map((m) => (
            <li key={m.assemblySegment}>
              <h4 className="merge-h4">
                {m.assemblySegment}{' '}
                {m.fromPdfExtract ? (
                  <span className="pill pill--pos">from records</span>
                ) : null}
              </h4>
              <div className="bilingual">
                <div>
                  <span className="pill pill--en">EN</span>
                  <p lang="en">{m.outreachTemplate.en}</p>
                </div>
                <div>
                  <span className="pill pill--mr">MR</span>
                  <p lang="mr">{m.outreachTemplate.mr}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h3 className="merge-h3">Marathi social media sentiment</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Positive</th>
                <th>Negative</th>
                <th>Neutral</th>
                <th>Posts sampled</th>
              </tr>
            </thead>
            <tbody>
              {sentimentSlices.map((s) => (
                <tr key={s.topic}>
                  <td>{s.topic}</td>
                  <td>{s.positivePct}%</td>
                  <td>{s.negativePct}%</td>
                  <td>{s.neutralPct}%</td>
                  <td>{s.samplePosts.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
