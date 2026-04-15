import type { Bi } from '../i18n/copy'

/** Always shows English and Marathi together — for readers new to apps */
export function BiText({ text, compact }: { text: Bi; compact?: boolean }) {
  return (
    <div className={compact ? 'bi-text bi-text--compact' : 'bi-text'}>
      <p className="bi-text__en" lang="en">
        {text.en}
      </p>
      <p className="bi-text__mr" lang="mr">
        {text.mr}
      </p>
    </div>
  )
}
