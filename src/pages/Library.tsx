import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import catalogData from '../data/catalog.json';
import precomputedStats from '../data/precomputed_stats.json';
import authorImages from '../data/authorImages';
import type { CorpusMetadata } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { useAnalysis } from '../workers/useAnalysis';
import { useCorpus } from '../data/useCorpus';
import { StatsPanel } from '../components/StatsPanel';
import { FileUpload } from '../components/FileUpload';
import { ExportButton } from '../components/ExportButton';
import { LetterChart } from '../charts/LetterChart';
import { WordChart } from '../charts/WordChart';
import { LengthChart } from '../charts/LengthChart';
import { MutualInformationChart } from '../charts/MutualInformationChart';

const catalog = catalogData as CorpusMetadata[];

/** Language code to display name mapping. */
const LANG_CODE_TO_NAME: Record<string, string> = {
  fr: 'French', en: 'English', de: 'German', nl: 'Dutch',
  it: 'Italian', es: 'Spanish', la: 'Latin', fro: 'Old French',
  grc: 'Ancient Greek', he: 'Hebrew', ar: 'Arabic',
};

/** Word count lookup from precomputed stats */
const wordCountMap = new Map<string, number>(
  (precomputedStats as { id: string; totalWords?: number }[])
    .filter((s) => s.totalWords != null)
    .map((s) => [s.id, s.totalWords!]),
);

function formatWordCount(n: number): string {
  if (n >= 1000) return Math.round(n / 1000) + 'k';
  return String(n);
}

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const { t } = useI18n();

  // Analysis state
  const { result, analyzing, error: analysisError, analyze } = useAnalysis();
  const { loadText, loading: corpusLoading, error: corpusError } = useCorpus();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('');
  const [source, setSource] = useState('');
  const [period, setPeriod] = useState('');
  const [customUpload, setCustomUpload] = useState(false);
  const analysisSectionRef = useRef<HTMLDivElement>(null);

  const selectedId = searchParams.get('id');
  const loading = corpusLoading || analyzing;

  // Load from URL param on mount or when id changes
  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang) setActiveLanguage(lang);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedId) return;
    const corpus = catalog.find((c) => c.id === selectedId);
    if (!corpus) return;
    setTitle(corpus.title);
    setAuthor(corpus.author);
    setLanguage(corpus.language);
    setSource(corpus.source);
    setPeriod(corpus.period);
    setCustomUpload(false);
    loadText(corpus).then((text) => analyze(text, corpus.languageCode));
  }, [selectedId, loadText, analyze]);

  // When results arrive: scroll to analysis, and set detected language for uploads
  useEffect(() => {
    if (result) {
      if (customUpload && result.detectedLanguageCode) {
        setLanguage(LANG_CODE_TO_NAME[result.detectedLanguageCode] ?? '');
      }
      if (analysisSectionRef.current) {
        requestAnimationFrame(() =>
          analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        );
      }
    }
  }, [result, customUpload]);

  const handleCardClick = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        prev.set('id', id);
        return prev;
      });
    },
    [setSearchParams],
  );

  const handleFileUpload = useCallback(
    (text: string, filename: string) => {
      setTitle(filename.replace(/\.txt$/i, ''));
      setAuthor('');
      setLanguage('');
      setSource('');
      setPeriod('');
      setCustomUpload(true);
      setSearchParams((prev) => {
        prev.delete('id');
        return prev;
      });
      analyze(text);
    },
    [analyze, setSearchParams],
  );

  const handleClose = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete('id');
      return prev;
    });
    setTitle('');
    setAuthor('');
    setLanguage('');
    setSource('');
    setPeriod('');
    setCustomUpload(false);
  }, [setSearchParams]);

  const hasAnalysis = !!selectedId || customUpload;

  const languages = useMemo(() => {
    const set = new Set(catalog.map((c) => c.language));
    return Array.from(set).sort((a, b) =>
      t(`lang.${a}` as Parameters<typeof t>[0]).localeCompare(t(`lang.${b}` as Parameters<typeof t>[0])),
    );
  }, [t]);

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

      {/* Search, filter & upload */}
      <div className="mb-4 space-y-3 sm:mb-6 sm:space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
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
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-8 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:py-2.5"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <FileUpload onTextLoaded={handleFileUpload} compact />
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

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center sm:p-12">
          <p className="text-sm text-slate-500">{t('library.empty')}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((corpus) => (
            <button
              key={corpus.id}
              onClick={() => handleCardClick(corpus.id)}
              className={`group flex gap-3 rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:gap-4 sm:p-5 ${
                selectedId === corpus.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-slate-200'
              }`}
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
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600 sm:text-base">
                      {corpus.title}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 sm:text-xs">
                    {corpus.languageCode.toUpperCase()}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                  {corpus.author} <span className="text-slate-300">·</span> {t(`period.${corpus.period}` as Parameters<typeof t>[0])}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 sm:gap-x-3 sm:text-xs">
                  {wordCountMap.has(corpus.id) && (
                    <span>{formatWordCount(wordCountMap.get(corpus.id)!)} {t('library.words')}</span>
                  )}
                  {wordCountMap.has(corpus.id) && <span className="text-slate-300">|</span>}
                  <span className="italic">{corpus.source}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Inline analysis results */}
      {hasAnalysis && (
        <div ref={analysisSectionRef} className="mt-6 sm:mt-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 sm:h-12 sm:w-12" />
              <p className="mt-3 text-sm text-slate-500 sm:mt-4">
                {t('analyze.analyzing').replace('{title}', title || '...')}
              </p>
            </div>
          )}

          {(corpusError || analysisError) && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:mb-6 sm:p-4">
              <p className="text-sm text-red-800">{corpusError || analysisError}</p>
            </div>
          )}

          {result && !loading && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6 sm:gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
                  {author && (
                    <p className="text-xs text-slate-600 sm:text-sm">{author}</p>
                  )}
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 sm:text-xs">
                    {language && <span>{t(`lang.${language}` as Parameters<typeof t>[0])}</span>}
                    {language && period && <span className="text-slate-300">|</span>}
                    {period && <span>{t(`period.${period}` as Parameters<typeof t>[0])}</span>}
                    {(language || period) && source && <span className="text-slate-300">|</span>}
                    {source && <span className="italic">{source}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <ExportButton result={result} title={title} />
                  <button
                    onClick={handleClose}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {t('library.closeAnalysis')}
                  </button>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <StatsPanel result={result} language={language || undefined} />
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                  <LetterChart frequencies={result.letterFrequencies} />
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                  <h4 className="mb-2 text-sm font-medium text-slate-700 sm:mb-3">{t('analyze.topWords')}</h4>
                  <WordChart words={result.topWordsFiltered} />
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                  <LengthChart distribution={result.wordLengthDistribution} language={language || undefined} />
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                  <MutualInformationChart pairs={result.mutualInformation} />
                  <p className="mt-2 text-center text-[10px] text-slate-400 sm:text-xs">
                    {t('chart.mi.note')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
