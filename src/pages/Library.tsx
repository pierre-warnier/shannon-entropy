import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import catalogData from '../data/catalog.json';
import authorImages from '../data/authorImages';
import type { CorpusMetadata } from '../types';
import { useI18n } from '../i18n/I18nContext';

const catalog = catalogData as CorpusMetadata[];

export default function Library() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang) setActiveLanguage(lang);
  }, [searchParams]);

  const languages = useMemo(() => {
    const set = new Set(catalog.map((c) => c.language));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return catalog.filter((corpus) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        corpus.title.toLowerCase().includes(q) ||
        corpus.author.toLowerCase().includes(q);
      const matchesLanguage =
        !activeLanguage || corpus.language === activeLanguage;
      return matchesSearch && matchesLanguage;
    });
  }, [search, activeLanguage]);

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {t('library.title')}
          <span className="ml-2 align-middle text-sm font-normal text-slate-400 sm:text-base">
            ({catalog.length})
          </span>
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {t('library.subtitle').replace('{n}', String(languages.length))}
        </p>
      </div>

      {/* Search and filter */}
      <div className="mb-4 space-y-3 sm:mb-6 sm:space-y-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={t('library.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:py-2.5"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveLanguage(null)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors sm:px-3 sm:text-xs ${
              activeLanguage === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('library.all')}
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                setActiveLanguage(activeLanguage === lang ? null : lang)
              }
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors sm:px-3 sm:text-xs ${
                activeLanguage === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t(`lang.${lang}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-[10px] text-slate-400 sm:mb-4 sm:text-xs">
        {t('library.showing')
          .replace('{filtered}', String(filtered.length))
          .replace('{total}', String(catalog.length))}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center sm:p-12">
          <p className="text-sm text-slate-500">{t('library.empty')}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((corpus) => (
            <Link
              key={corpus.id}
              to={`/analyze/${corpus.id}`}
              className="group flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:gap-4 sm:p-5"
            >
              {/* Author portrait */}
              {authorImages[corpus.author] ? (
                <img
                  src={authorImages[corpus.author]}
                  alt={corpus.author}
                  className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover sm:h-16 sm:w-16"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-400 sm:h-16 sm:w-16">
                  {corpus.author.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-2 sm:mb-2">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 sm:text-base">
                    {corpus.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 sm:text-xs">
                    {corpus.languageCode.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 sm:text-sm">{corpus.author}</p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400 sm:mt-2 sm:gap-3 sm:text-xs">
                  <span>{t(`lang.${corpus.language}` as Parameters<typeof t>[0])}</span>
                  <span className="text-slate-300">|</span>
                  <span>{t(`period.${corpus.period}` as Parameters<typeof t>[0])}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
