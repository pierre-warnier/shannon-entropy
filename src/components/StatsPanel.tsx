import { useI18n } from '../i18n/I18nContext';
import type { AnalysisResult } from '../types';

interface StatsPanelProps {
  result: AnalysisResult;
}

export function StatsPanel({ result }: StatsPanelProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Entropy hero — front and center */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 sm:text-xs">
            {t('stats.letterEntropy')}
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-blue-900 sm:mt-2 sm:text-5xl">
            {result.letterEntropy.toFixed(4)}
          </p>
          <p className="mt-0.5 text-xs text-blue-600 sm:mt-1 sm:text-sm">{t('stats.perChar')}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-blue-700/70 sm:mt-3 sm:text-xs">
            {t('stats.letterDesc')}
          </p>
        </div>
        <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-600 sm:text-xs">
            {t('stats.wordEntropy')}
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-purple-900 sm:mt-2 sm:text-5xl">
            {result.wordEntropy.toFixed(4)}
          </p>
          <p className="mt-0.5 text-xs text-purple-600 sm:mt-1 sm:text-sm">{t('stats.perWord')}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-purple-700/70 sm:mt-3 sm:text-xs">
            {t('stats.wordDesc')}
          </p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {[
          { label: t('stats.totalChars'), value: result.totalCharacters.toLocaleString() },
          { label: t('stats.totalWords'), value: result.totalWords.toLocaleString() },
          { label: t('stats.uniqueWords'), value: result.uniqueWords.toLocaleString() },
          { label: t('stats.meanWordLength'), value: result.wordLengthStats.mean.toFixed(2) },
          { label: t('stats.medianLength'), value: result.wordLengthStats.median.toFixed(1) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm sm:px-3 sm:py-3"
          >
            <p className="truncate text-[9px] font-medium uppercase tracking-wide text-slate-400 sm:text-[10px]">
              {stat.label}
            </p>
            <p className="mt-0.5 text-base font-bold text-slate-800 sm:mt-1 sm:text-lg">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
