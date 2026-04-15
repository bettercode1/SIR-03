interface StatCardProps {
  title: string
  value: string
  hint?: string
}

export function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="stat-card__title">{title}</p>
      <p className="stat-card__value">{value}</p>
      {hint ? <p className="stat-card__hint">{hint}</p> : null}
    </article>
  )
}
