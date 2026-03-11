import { useState, useCallback, useMemo } from 'react';
import { useAnalysis } from '../workers/useAnalysis';
import { useCorpus } from '../data/useCorpus';
import catalogData from '../data/catalog.json';
import authorImages from '../data/authorImages';
import type { CorpusMetadata, AnalysisResult } from '../types';
import { FileUpload } from '../components/FileUpload';
import { SearchableSelect } from '../components/SearchableSelect';
import type { SelectOption } from '../components/SearchableSelect';
import { CompareLetterChart } from '../charts/CompareLetterChart';
import { CompareLengthChart } from '../charts/CompareLengthChart';
import { EntropyChart } from '../charts/EntropyChart';
import { useI18n } from '../i18n/I18nContext';

const catalog = catalogData as CorpusMetadata[];

interface TextPanel {
  title: string;
  author: string;
  result: AnalysisResult | null;
}

export default function Compare() {
  const { t } = useI18n();
  const analysisA = useAnalysis();
  const analysisB = useAnalysis();
  const corpusA = useCorpus();
  const corpusB = useCorpus();

  const [titleA, setTitleA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [authorA, setAuthorA] = useState('');
  const [authorB, setAuthorB] = useState('');
  const [selectedA, setSelectedA] = useState('');
  const [selectedB, setSelectedB] = useState('');

  const loadAndAnalyze = useCallback(
    (side: 'A' | 'B', text: string, name: string, langCode?: string) => {
      if (side === 'A') {
        setTitleA(name);
        analysisA.analyze(text, langCode);
      } else {
        setTitleB(name);
        analysisB.analyze(text, langCode);
      }
    },
    [analysisA, analysisB],
  );

  const handleCatalogSelect = useCallback(
    async (side: 'A' | 'B', corpusId: string) => {
      const corpus = catalog.find((c) => c.id === corpusId);
      if (!corpus) return;

      if (side === 'A') {
        setSelectedA(corpusId);
        setTitleA(corpus.title);
        setAuthorA(corpus.author);
      } else {
        setSelectedB(corpusId);
        setTitleB(corpus.title);
        setAuthorB(corpus.author);
      }

      const loader = side === 'A' ? corpusA : corpusB;
      const text = await loader.loadText(corpus);
      loadAndAnalyze(side, text, corpus.title, corpus.languageCode);
    },
    [corpusA, corpusB, loadAndAnalyze],
  );

  const handleFileUpload = useCallback(
    (side: 'A' | 'B', text: string, filename: string) => {
      const name = filename.replace(/\.txt$/i, '');
      if (side === 'A') {
        setSelectedA('');
        setAuthorA('');
      } else {
        setSelectedB('');
        setAuthorB('');
      }
      loadAndAnalyze(side, text, name);
    },
    [loadAndAnalyze],
  );

  const loadingA = corpusA.loading || analysisA.analyzing;
  const loadingB = corpusB.loading || analysisB.analyzing;
  const bothDone = analysisA.result && analysisB.result && !loadingA && !loadingB;

  const panelA: TextPanel = { title: titleA, author: authorA, result: analysisA.result };
  const panelB: TextPanel = { title: titleB, author: authorB, result: analysisB.result };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('compare.title')}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {t('compare.subtitle')}
        </p>
      </div>

      {/* Selection panels */}
      <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-2">
        <SelectorPanel
          label={t('compare.textA')}
          selectedId={selectedA}
          loading={loadingA}
          title={titleA}
          hasResult={!!analysisA.result}
          error={corpusA.error || analysisA.error}
          onCatalogSelect={(id) => handleCatalogSelect('A', id)}
          onFileUpload={(text, name) => handleFileUpload('A', text, name)}
        />
        <SelectorPanel
          label={t('compare.textB')}
          selectedId={selectedB}
          loading={loadingB}
          title={titleB}
          hasResult={!!analysisB.result}
          error={corpusB.error || analysisB.error}
          onCatalogSelect={(id) => handleCatalogSelect('B', id)}
          onFileUpload={(text, name) => handleFileUpload('B', text, name)}
        />
      </div>

      {bothDone && <ComparisonResults panelA={panelA} panelB={panelB} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

interface SelectorPanelProps {
  label: string;
  selectedId: string;
  loading: boolean;
  title: string;
  hasResult: boolean;
  error: string | null;
  onCatalogSelect: (id: string) => void;
  onFileUpload: (text: string, filename: string) => void;
}

function SelectorPanel({
  label,
  selectedId,
  loading,
  title,
  hasResult,
  error,
  onCatalogSelect,
  onFileUpload,
}: SelectorPanelProps) {
  const { t } = useI18n();

  const catalogOptions: SelectOption[] = useMemo(
    () =>
      catalog.map((c) => ({
        id: c.id,
        label: `${c.title} — ${c.author}`,
        group: t(`lang.${c.language}` as Parameters<typeof t>[0]),
        // searchable by language + author + title (all embedded in label + group)
      })),
    [t],
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mb-4 sm:text-sm">
        {label}
      </h3>

      <label className="mb-1 block text-xs font-medium text-slate-600">
        {t('compare.chooseLibrary')}
      </label>
      <div className="mb-3 sm:mb-4">
        <SearchableSelect
          options={catalogOptions}
          value={selectedId}
          placeholder={t('compare.selectText')}
          onChange={onCatalogSelect}
        />
      </div>

      <label className="mb-1 block text-xs font-medium text-slate-600">
        {t('compare.orUpload')}
      </label>
      <FileUpload onTextLoaded={onFileUpload} />

      <div className="mt-3 sm:mt-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            <span className="truncate">Analyzing {title}...</span>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hasResult && !loading && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">{t('compare.ready').replace('{title}', title)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

interface ComparisonResultsProps {
  panelA: TextPanel;
  panelB: TextPanel;
}

function ComparisonResults({ panelA, panelB }: ComparisonResultsProps) {
  const { t } = useI18n();
  const a = panelA.result!;
  const b = panelB.result!;

  const bits = t('stats.bits');

  const diffColor = (va: number, vb: number) => {
    if (va === vb) return 'text-slate-400';
    return va > vb ? 'text-blue-600' : 'text-red-600';
  };

  const statsRows = [
    { label: t('stats.letterEntropy'), valA: a.letterEntropy.toFixed(4) + ' ' + bits, valB: b.letterEntropy.toFixed(4) + ' ' + bits, numA: a.letterEntropy, numB: b.letterEntropy, fmt: (d: number) => (d >= 0 ? '+' : '') + d.toFixed(4) + ' ' + bits },
    { label: t('stats.wordEntropy'), valA: a.wordEntropy.toFixed(4) + ' ' + bits, valB: b.wordEntropy.toFixed(4) + ' ' + bits, numA: a.wordEntropy, numB: b.wordEntropy, fmt: (d: number) => (d >= 0 ? '+' : '') + d.toFixed(2) + ' ' + bits },
    { label: t('stats.totalChars'), valA: a.totalCharacters.toLocaleString(), valB: b.totalCharacters.toLocaleString(), numA: a.totalCharacters, numB: b.totalCharacters, fmt: (d: number) => (d >= 0 ? '+' : '') + d.toLocaleString() },
    { label: t('stats.totalWords'), valA: a.totalWords.toLocaleString(), valB: b.totalWords.toLocaleString(), numA: a.totalWords, numB: b.totalWords, fmt: (d: number) => (d >= 0 ? '+' : '') + d.toLocaleString() },
    { label: t('stats.uniqueWords'), valA: a.uniqueWords.toLocaleString(), valB: b.uniqueWords.toLocaleString(), numA: a.uniqueWords, numB: b.uniqueWords, fmt: (d: number) => (d >= 0 ? '+' : '') + d.toLocaleString() },
    { label: t('stats.meanWordLength'), valA: a.wordLengthStats.mean.toFixed(2), valB: b.wordLengthStats.mean.toFixed(2), numA: a.wordLengthStats.mean, numB: b.wordLengthStats.mean, fmt: (d: number) => (d >= 0 ? '+' : '') + d.toFixed(2) },
  ];

  const portraitA = authorImages[panelA.author];
  const portraitB = authorImages[panelB.author];

  return (
    <div>
      {/* Portrait vs Portrait */}
      <div className="mb-6 flex items-center justify-center gap-4 sm:mb-8 sm:gap-8">
        <div className="flex flex-col items-center gap-2">
          {portraitA ? (
            <img src={portraitA} alt={panelA.author} className="h-20 w-20 rounded-full border-3 border-blue-500 object-cover shadow-md sm:h-28 sm:w-28" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-3 border-blue-500 bg-blue-50 text-2xl font-bold text-blue-400 shadow-md sm:h-28 sm:w-28 sm:text-3xl">
              {(panelA.author || panelA.title).charAt(0)}
            </div>
          )}
          <div className="text-center">
            <p className="text-xs font-semibold text-blue-700 sm:text-sm">{panelA.author || panelA.title}</p>
            <p className="max-w-[140px] truncate text-[10px] text-slate-500 sm:text-xs">{panelA.title}</p>
          </div>
        </div>

        <span className="text-2xl font-black text-slate-300 sm:text-4xl">vs</span>

        <div className="flex flex-col items-center gap-2">
          {portraitB ? (
            <img src={portraitB} alt={panelB.author} className="h-20 w-20 rounded-full border-3 border-red-500 object-cover shadow-md sm:h-28 sm:w-28" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-3 border-red-500 bg-red-50 text-2xl font-bold text-red-400 shadow-md sm:h-28 sm:w-28 sm:text-3xl">
              {(panelB.author || panelB.title).charAt(0)}
            </div>
          )}
          <div className="text-center">
            <p className="text-xs font-semibold text-red-700 sm:text-sm">{panelB.author || panelB.title}</p>
            <p className="max-w-[140px] truncate text-[10px] text-slate-500 sm:text-xs">{panelB.title}</p>
          </div>
        </div>
      </div>

      {/* Stats table */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm sm:mb-8">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-600 sm:px-4 sm:py-3 sm:text-sm">
                {t('stats.metric')}
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-blue-600 sm:px-4 sm:py-3 sm:text-sm">
                {panelA.title}
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-red-600 sm:px-4 sm:py-3 sm:text-sm">
                {panelB.title}
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-slate-500 sm:px-4 sm:py-3 sm:text-sm">
                Δ (A − B)
              </th>
            </tr>
          </thead>
          <tbody>
            {statsRows.map((row, i) => (
              <tr
                key={row.label}
                className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
              >
                <td className="whitespace-nowrap px-3 py-2 text-xs font-medium text-slate-700 sm:px-4 sm:py-2.5 sm:text-sm">
                  {row.label}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right text-xs tabular-nums text-slate-900 sm:px-4 sm:py-2.5 sm:text-sm">
                  {row.valA}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right text-xs tabular-nums text-slate-900 sm:px-4 sm:py-2.5 sm:text-sm">
                  {row.valB}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-right text-xs font-medium tabular-nums sm:px-4 sm:py-2.5 sm:text-sm ${diffColor(row.numA, row.numB)}`}>
                  {row.fmt(row.numA - row.numB)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts — overlaid for easy comparison */}
      <div className="grid gap-4 sm:gap-6">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <EntropyChart
            entries={[
              { label: panelA.title, letterEntropy: a.letterEntropy, wordEntropy: a.wordEntropy },
              { label: panelB.title, letterEntropy: b.letterEntropy, wordEntropy: b.wordEntropy },
            ]}
            title={t('chart.entropy')}
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <CompareLetterChart
            freqA={a.letterFrequencies}
            freqB={b.letterFrequencies}
            labelA={panelA.title}
            labelB={panelB.title}
            title={t('chart.letterFreqOverlay')}
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <CompareLengthChart
            distA={a.wordLengthDistribution}
            distB={b.wordLengthDistribution}
            labelA={panelA.title}
            labelB={panelB.title}
            title={t('chart.wordLengthOverlay')}
          />
        </div>
      </div>
    </div>
  );
}
