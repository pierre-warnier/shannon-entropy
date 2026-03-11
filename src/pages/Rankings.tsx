import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import statsData from '../data/precomputed_stats.json';
import authorImages from '../data/authorImages';
import { useI18n } from '../i18n/I18nContext';

interface StatEntry {
  id: string;
  title: string;
  author: string;
  language: string;
  period: string;
  letterEntropy: number;
  wordEntropy: number;
  meanWordLength: number;
  vocabularyRichness: number;
}

const stats = statsData as StatEntry[];

const LANGUAGE_COLORS: Record<string, string> = {
  'Ancient Greek': '#e11d48',
  Latin: '#9333ea',
  French: '#2563eb',
  'Old French': '#60a5fa',
  Dutch: '#f97316',
  English: '#16a34a',
  Italian: '#dc2626',
  Spanish: '#ca8a04',
  German: '#475569',
  Hebrew: '#0d9488',
  Arabic: '#7c3aed',
};

type MetricKey = 'letterEntropy' | 'wordEntropy';
type SortDir = 'desc' | 'asc';

function Portrait({ author, size = 48 }: { author: string; size?: number }) {
  const url = authorImages[author];
  if (url) {
    return (
      <img
        src={url}
        alt={author}
        className="rounded-full border-2 border-white object-cover shadow-md"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-white bg-slate-200 font-bold text-slate-500 shadow-md"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {author.charAt(0)}
    </div>
  );
}

export default function Rankings() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [metric, setMetric] = useState<MetricKey>('wordEntropy');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const goToText = useCallback(
    (id: string) => navigate(`/library?id=${encodeURIComponent(id)}`),
    [navigate],
  );

  const sorted = useMemo(() => {
    const arr = [...stats];
    arr.sort((a, b) =>
      sortDir === 'desc' ? b[metric] - a[metric] : a[metric] - b[metric],
    );
    return arr;
  }, [metric, sortDir]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const allValues = stats.map((s) => s[metric]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;

  const barWidth = (val: number) => ((val - minVal) / range) * 100;

  const metricLabel =
    metric === 'letterEntropy'
      ? t('rankings.letterEntropy')
      : t('rankings.wordEntropy');

  const dirLabel =
    sortDir === 'desc' ? t('rankings.mostComplex') : t('rankings.mostDirect');

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {t('rankings.title')}
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {t('rankings.subtitle')}
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Metric toggle */}
        <div className="inline-flex rounded-md border border-slate-200 text-xs font-medium shadow-sm">
          <button
            type="button"
            onClick={() => setMetric('letterEntropy')}
            className={`rounded-l-md px-3 py-1.5 transition-colors ${
              metric === 'letterEntropy'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('rankings.byLetter')}
          </button>
          <button
            type="button"
            onClick={() => setMetric('wordEntropy')}
            className={`rounded-r-md border-l border-slate-200 px-3 py-1.5 transition-colors ${
              metric === 'wordEntropy'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('rankings.byWord')}
          </button>
        </div>

        {/* Direction toggle */}
        <button
          type="button"
          onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
        >
          <span className="text-base">{sortDir === 'desc' ? '↓' : '↑'}</span>
          {dirLabel}
        </button>

        <span className="text-xs text-slate-400">{metricLabel}</span>
      </div>

      {/* Podium - Top 3 */}
      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        {/* 2nd place */}
        <button onClick={() => top3[1] && goToText(top3[1].id)} className="flex cursor-pointer flex-col items-center pt-6 transition-opacity hover:opacity-80">
          <div className="relative">
            <Portrait author={top3[1]?.author ?? ''} size={64} />
            <span className="absolute -bottom-1.5 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-white shadow">
              2
            </span>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs font-semibold text-slate-900 sm:text-sm">
              {top3[1]?.author}
            </p>
            <p className="line-clamp-1 text-[10px] text-slate-500 sm:text-xs">
              {top3[1]?.title}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    LANGUAGE_COLORS[top3[1]?.language ?? ''] ?? '#64748b',
                }}
              />
              <span className="text-[10px] text-slate-400">
                {t(`lang.${top3[1]?.language}` as Parameters<typeof t>[0])}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-slate-700 sm:text-base">
              {top3[1]?.[metric].toFixed(metric === 'letterEntropy' ? 3 : 2)}
            </p>
          </div>
        </button>

        {/* 1st place */}
        <button onClick={() => top3[0] && goToText(top3[0].id)} className="flex cursor-pointer flex-col items-center transition-opacity hover:opacity-80">
          <div className="relative">
            <Portrait author={top3[0]?.author ?? ''} size={80} />
            <span className="absolute -bottom-1.5 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-white shadow">
              1
            </span>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-bold text-slate-900 sm:text-base">
              {top3[0]?.author}
            </p>
            <p className="line-clamp-1 text-[10px] text-slate-500 sm:text-xs">
              {top3[0]?.title}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    LANGUAGE_COLORS[top3[0]?.language ?? ''] ?? '#64748b',
                }}
              />
              <span className="text-[10px] text-slate-400">
                {t(`lang.${top3[0]?.language}` as Parameters<typeof t>[0])}
              </span>
            </div>
            <p className="mt-1 text-lg font-bold text-blue-600 sm:text-xl">
              {top3[0]?.[metric].toFixed(metric === 'letterEntropy' ? 3 : 2)}
            </p>
          </div>
        </button>

        {/* 3rd place */}
        <button onClick={() => top3[2] && goToText(top3[2].id)} className="flex cursor-pointer flex-col items-center pt-8 transition-opacity hover:opacity-80">
          <div className="relative">
            <Portrait author={top3[2]?.author ?? ''} size={56} />
            <span className="absolute -bottom-1.5 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white shadow">
              3
            </span>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs font-semibold text-slate-900 sm:text-sm">
              {top3[2]?.author}
            </p>
            <p className="line-clamp-1 text-[10px] text-slate-500 sm:text-xs">
              {top3[2]?.title}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    LANGUAGE_COLORS[top3[2]?.language ?? ''] ?? '#64748b',
                }}
              />
              <span className="text-[10px] text-slate-400">
                {t(`lang.${top3[2]?.language}` as Parameters<typeof t>[0])}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-slate-700 sm:text-base">
              {top3[2]?.[metric].toFixed(metric === 'letterEntropy' ? 3 : 2)}
            </p>
          </div>
        </button>
      </div>

      {/* Full ranking list */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {rest.map((entry, i) => {
          const rank = i + 4;
          const color = LANGUAGE_COLORS[entry.language] ?? '#64748b';
          return (
            <button
              key={entry.id}
              onClick={() => goToText(entry.id)}
              className="flex w-full cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-slate-50 sm:gap-4 sm:px-4 sm:py-3"
            >
              <span className="w-6 shrink-0 text-right text-xs font-semibold text-slate-400 sm:w-8 sm:text-sm">
                {rank}
              </span>
              <Portrait author={entry.author} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm">
                    {entry.author}
                  </p>
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <p className="truncate text-[10px] text-slate-500 sm:text-xs">
                  {entry.title}
                </p>
                {/* Horizontal bar */}
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barWidth(entry[metric])}%`,
                      backgroundColor: color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold tabular-nums text-slate-700 sm:text-sm">
                {entry[metric].toFixed(metric === 'letterEntropy' ? 3 : 2)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[10px] text-slate-400 sm:text-xs">
        {t('rankings.note')}
      </p>
    </div>
  );
}
