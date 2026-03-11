import { NavLink, Outlet } from 'react-router-dom';
import { useI18n, LOCALE_LABELS } from './i18n/I18nContext';
import type { Locale } from './i18n/I18nContext';

const LOCALES: Locale[] = ['fr', 'en', 'nl'];

export default function App() {
  const { locale, setLocale, t } = useI18n();

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/library', label: t('nav.library') },
    { to: '/compare', label: t('nav.compare') },
    { to: '/formulas', label: t('nav.formulas') },
    { to: '/about', label: t('nav.about') },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between sm:h-16">
            {/* Title */}
            <NavLink to="/" className="flex shrink-0 items-baseline gap-2 sm:gap-3">
              <h1 className="text-base font-bold tracking-tight text-white sm:text-xl">
                {t('app.title')}
              </h1>
              <span className="hidden text-sm font-light text-slate-400 md:inline">
                {t('app.subtitle')}
              </span>
            </NavLink>

            {/* Navigation + Language Switcher */}
            <div className="flex items-center gap-1 sm:gap-2">
              <nav className="flex items-center gap-0.5 sm:gap-1">
                {navItems.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Language switcher */}
              <div className="ml-1 flex items-center rounded-md border border-slate-700 sm:ml-2">
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    title={LOCALE_LABELS[l]}
                    className={`px-1.5 py-1 text-[10px] font-medium uppercase transition-colors sm:px-2 sm:py-1.5 sm:text-xs ${
                      locale === l
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    } ${l === 'fr' ? 'rounded-l-md' : l === 'nl' ? 'rounded-r-md' : ''}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
