import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKey, LOCALE_LABELS } from './translations';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  /** Wikipedia base URL for current locale (e.g. https://fr.wikipedia.org/wiki/) */
  wikiBase: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  // Check localStorage first
  const saved = localStorage.getItem('shannon-locale') as Locale | null;
  if (saved && saved in translations) return saved;

  // Check browser language
  const browserLang = navigator.language?.slice(0, 2);
  if (browserLang === 'nl') return 'nl';
  if (browserLang === 'en') return 'en';

  // Default to French (Belgian school project)
  return 'fr';
}

const WIKI_BASE: Record<Locale, string> = {
  fr: 'https://fr.wikipedia.org/wiki/',
  en: 'https://en.wikipedia.org/wiki/',
  nl: 'https://nl.wikipedia.org/wiki/',
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('shannon-locale', l);
    document.documentElement.lang = l === 'grc' ? 'el' : l;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale]?.[key] ?? translations.fr[key] ?? key;
    },
    [locale],
  );

  const wikiBase = WIKI_BASE[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, wikiBase }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export { LOCALE_LABELS };
export type { Locale };
