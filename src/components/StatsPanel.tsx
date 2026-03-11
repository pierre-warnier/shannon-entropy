import { useMemo } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { AnalysisResult } from '../types';
import precomputedStats from '../data/precomputed_stats.json';

const SHORT_TEXT_THRESHOLD = 10000; // words

interface StatEntry {
  language: string;
  letterEntropy: number;
  wordEntropy: number;
}

/** Compute per-language and corpus-wide averages (once at module load). */
function computeAverages() {
  const stats = precomputedStats as StatEntry[];
  const byLang = new Map<string, { sumL: number; sumW: number; n: number }>();
  let totalL = 0, totalW = 0, total = 0;

  for (const s of stats) {
    totalL += s.letterEntropy;
    totalW += s.wordEntropy;
    total++;
    const entry = byLang.get(s.language) ?? { sumL: 0, sumW: 0, n: 0 };
    entry.sumL += s.letterEntropy;
    entry.sumW += s.wordEntropy;
    entry.n++;
    byLang.set(s.language, entry);
  }

  const langAvg = new Map<string, { letter: number; word: number }>();
  for (const [lang, { sumL, sumW, n }] of byLang) {
    langAvg.set(lang, { letter: sumL / n, word: sumW / n });
  }

  return {
    langAvg,
    corpusAvg: { letter: totalL / total, word: totalW / total },
  };
}

const { langAvg, corpusAvg } = computeAverages();

/**
 * Entropy comparison as effective-possibilities ratio.
 * 0.2 bits difference = 2^0.2 ≈ +15% complexity.
 */
function entropyPct(value: number, reference: number): string {
  const pct = (Math.pow(2, value - reference) - 1) * 100;
  return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
}

function entropyPctRaw(value: number, reference: number): number {
  return (Math.pow(2, value - reference) - 1) * 100;
}

interface StatsPanelProps {
  result: AnalysisResult;
  language?: string; // display name e.g. "French", "Latin"
}

export function StatsPanel({ result, language }: StatsPanelProps) {
  const { t } = useI18n();

  const context = useMemo(() => {
    const lang = language ? langAvg.get(language) : undefined;
    return { lang, corpus: corpusAvg };
  }, [language]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Short text warning */}
      {result.totalWords < SHORT_TEXT_THRESHOLD && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-xs text-amber-800 sm:text-sm">
            {t('stats.shortTextWarning').replace('{n}', result.totalWords.toLocaleString())}
          </p>
        </div>
      )}

      {/* Entropy hero — front and center */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <EntropyCard
          label={t('stats.letterEntropy')}
          value={result.letterEntropy}
          unit={t('stats.perChar')}
          desc={t('stats.letterDesc')}
          langAvg={context.lang?.letter}
          corpusAvg={context.corpus.letter}
          language={language}
          color="blue"
          t={t}
        />
        <EntropyCard
          label={t('stats.wordEntropy')}
          value={result.wordEntropy}
          unit={t('stats.perWord')}
          desc={t('stats.wordDesc')}
          langAvg={context.lang?.word}
          corpusAvg={context.corpus.word}
          language={language}
          color="purple"
          t={t}
        />
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

/* -------------------------------------------------------------------------- */

interface EntropyCardProps {
  label: string;
  value: number;
  unit: string;
  desc: string;
  langAvg?: number;
  corpusAvg: number;
  language?: string;
  color: 'blue' | 'purple';
  t: ReturnType<typeof useI18n>['t'];
}

function EntropyCard({ label, value, unit, desc, langAvg, corpusAvg, language, color, t }: EntropyCardProps) {
  const c = color === 'blue'
    ? { border: 'border-blue-200', bg: 'bg-gradient-to-br from-blue-50 to-blue-100', title: 'text-blue-600', num: 'text-blue-900', sub: 'text-blue-600', desc: 'text-blue-700/70' }
    : { border: 'border-purple-200', bg: 'bg-gradient-to-br from-purple-50 to-purple-100', title: 'text-purple-600', num: 'text-purple-900', sub: 'text-purple-600', desc: 'text-purple-700/70' };

  return (
    <div className={`rounded-xl border-2 ${c.border} ${c.bg} p-4 shadow-sm sm:p-6`}>
      <p className={`text-[10px] font-semibold uppercase tracking-widest ${c.title} sm:text-xs`}>
        {label}
      </p>
      <p className={`mt-1 text-3xl font-extrabold tracking-tight ${c.num} sm:mt-2 sm:text-5xl`}>
        {value.toFixed(4)}
      </p>
      <p className={`mt-0.5 text-xs ${c.sub} sm:mt-1 sm:text-sm`}>{unit}</p>

      {/* Context badges */}
      <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
        {langAvg != null && (
          <ContextBadge
            pct={entropyPctRaw(value, langAvg)}
            label={t('stats.vsLang').replace('{lang}', language ?? '')}
          />
        )}
        <ContextBadge
          pct={entropyPctRaw(value, corpusAvg)}
          label={t('stats.vsCorpus')}
        />
      </div>

      <p className={`mt-2 text-[11px] leading-relaxed ${c.desc} sm:mt-3 sm:text-xs`}>
        {desc}
      </p>
    </div>
  );
}

function ContextBadge({ pct, label }: { pct: number; label: string }) {
  const isPositive = pct >= 0;
  const bgColor = isPositive ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  const arrow = isPositive ? '↑' : '↓';
  const formatted = (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';

  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${bgColor}`}>
      {arrow} {formatted} {label}
    </span>
  );
}
