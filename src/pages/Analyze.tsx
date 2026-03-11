import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAnalysis } from '../workers/useAnalysis';
import { useCorpus } from '../data/useCorpus';
import catalogData from '../data/catalog.json';
import type { CorpusMetadata } from '../types';
import { StatsPanel } from '../components/StatsPanel';
import { FileUpload } from '../components/FileUpload';
import { ExportButton } from '../components/ExportButton';
import { SearchableSelect } from '../components/SearchableSelect';
import type { SelectOption } from '../components/SearchableSelect';
import { LetterChart } from '../charts/LetterChart';
import { WordChart } from '../charts/WordChart';
import { LengthChart } from '../charts/LengthChart';
import { MutualInformationChart } from '../charts/MutualInformationChart';
import { useI18n } from '../i18n/I18nContext';

const catalog = catalogData as CorpusMetadata[];

export default function Analyze() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const { result, analyzing, error: analysisError, analyze } = useAnalysis();
  const { loadText, loading: corpusLoading, error: corpusError } = useCorpus();
  const [title, setTitle] = useState<string>('');
  const [hasStarted, setHasStarted] = useState(false);
  const [showStopwords, setShowStopwords] = useState(false);

  useEffect(() => {
    if (!id) return;

    const corpus = catalog.find((c) => c.id === id);
    if (!corpus) return;

    loadText(corpus).then((text) => {
      setTitle(corpus.title);
      setHasStarted(true);
      analyze(text, corpus.languageCode);
    });
  }, [id, loadText, analyze]);

  const handleFileLoaded = (text: string, filename: string) => {
    setTitle(filename.replace(/\.txt$/i, ''));
    setHasStarted(true);
    analyze(text);
  };

  const loading = corpusLoading || analyzing;
  const error = corpusError || analysisError;

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('analyze.title')}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {t('analyze.subtitle')}
        </p>
      </div>

      {!hasStarted && (
        <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-700 sm:mb-3">
              {t('analyze.upload')}
            </h3>
            <FileUpload onTextLoaded={handleFileLoaded} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-700 sm:mb-3">
              {t('analyze.choose')}
            </h3>
            <CatalogSelect
              onSelect={(corpus) => {
                setTitle(corpus.title);
                setHasStarted(true);
                loadText(corpus).then((text) => analyze(text, corpus.languageCode));
              }}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 sm:h-12 sm:w-12" />
          <p className="mt-3 text-sm text-slate-500 sm:mt-4">
            {t('analyze.analyzing').replace('{title}', title || 'text')}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:mb-6 sm:p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6 sm:gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
              <p className="text-xs text-slate-500">{t('analyze.complete')}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <ExportButton result={result} title={title} />
              <button
                onClick={() => {
                  setHasStarted(false);
                  setTitle('');
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                {t('analyze.new')}
              </button>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <StatsPanel result={result} />
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <LetterChart frequencies={result.letterFrequencies} />
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 sm:mb-3">
                <h4 className="text-sm font-medium text-slate-700">{t('analyze.topWords')}</h4>
                <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-slate-500 sm:gap-2 sm:text-xs">
                  <span className="hidden sm:inline">{showStopwords ? t('analyze.allWords') : t('analyze.contentWords')}</span>
                  <button
                    onClick={() => setShowStopwords(!showStopwords)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      showStopwords ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showStopwords ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span>{t('analyze.stopwords')}</span>
                </label>
              </div>
              <WordChart
                words={showStopwords ? result.topWords : result.topWordsFiltered}
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <LengthChart distribution={result.wordLengthDistribution} />
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
  );
}

/* -------------------------------------------------------------------------- */

function CatalogSelect({ onSelect }: { onSelect: (corpus: CorpusMetadata) => void }) {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState('');

  const catalogOptions: SelectOption[] = useMemo(
    () =>
      catalog.map((c) => ({
        id: c.id,
        label: `${c.title} — ${c.author}`,
        group: t(`lang.${c.language}` as Parameters<typeof t>[0]),
      })),
    [t],
  );

  return (
    <SearchableSelect
      options={catalogOptions}
      value={selectedId}
      placeholder={t('analyze.searchLibrary')}
      onChange={(id) => {
        setSelectedId(id);
        const corpus = catalog.find((c) => c.id === id);
        if (corpus) onSelect(corpus);
      }}
    />
  );
}
