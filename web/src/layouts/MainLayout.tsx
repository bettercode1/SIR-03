import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export function MainLayout() {
  const { lang, setLang, t } = useLanguage()
  const location = useLocation()
  const hashPrefix = location.pathname === '/' ? '' : '/'

  const jumpLinks = [
    { hash: 'case-booth', label: t.jumpBooth },
    { hash: 'case-deletion', label: t.jumpDeletion },
    { hash: 'case-mobilization', label: t.jumpMobilization },
  ]

  const nav = [
    { to: '/', label: t.navWork, end: true },
    { to: '/sample-roll', label: t.navPdf, end: false },
  ]

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Primary">
        <div className="sidebar__brand">
          <span className="sidebar__mark" aria-hidden />
          <div>
            <strong>{t.appName}</strong>
            <span className="sidebar__tag">{t.appTag}</span>
          </div>
        </div>

        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === 'en' ? 'lang-toggle__btn is-on' : 'lang-toggle__btn'}
            onClick={() => setLang('en')}
          >
            {t.langEn}
          </button>
          <button
            type="button"
            className={lang === 'mr' ? 'lang-toggle__btn is-on' : 'lang-toggle__btn'}
            onClick={() => setLang('mr')}
          >
            {t.langMr}
          </button>
        </div>

        <nav className="sidebar__nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'navlink navlink--active' : 'navlink'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className="sidebar__jump-label">{t.sidebarJumpLabel}</p>
        <div className="sidebar__jump">
          {jumpLinks.map((j) => (
            <a
              key={j.hash}
              className="navlink navlink--jump"
              href={`${hashPrefix}#${j.hash}`}
            >
              {j.label}
            </a>
          ))}
        </div>

        <p className="sidebar__foot">{t.sidebarFoot}</p>
      </aside>
      <div className="main">
        <Outlet />
      </div>
    </div>
  )
}
