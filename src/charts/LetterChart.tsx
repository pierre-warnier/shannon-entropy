import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import { useI18n } from '../i18n/I18nContext';
import rawLetterFreqs from '../data/precomputed_letterfreqs.json';

interface LetterFreqEntry {
  language: string;
  distribution: Record<string, number>;
}

interface LetterChartProps {
  frequencies: Map<string, number>;
  language?: string; // display name e.g. "French", "Latin"
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
};

/** Lookup from language display name to average letter distribution. */
const langDistMap = new Map<string, Record<string, number>>(
  (rawLetterFreqs as unknown as LetterFreqEntry[]).map((entry) => [entry.language, entry.distribution]),
);

export function LetterChart({ frequencies, language, title }: LetterChartProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'normal' | 'comparison'>('normal');

  const langDist = language ? langDistMap.get(language) : undefined;
  const canCompare = !!langDist;

  const resolvedTitle = title ?? t('chart.letterFreq');

  // Compute relative frequencies for the text
  const { textRel, letters } = useMemo(() => {
    const sorted = Array.from(frequencies.entries()).sort(([a], [b]) => a.localeCompare(b));
    const totalCount = sorted.reduce((sum, [, count]) => sum + count, 0);
    const rel = new Map<string, number>();
    for (const [letter, count] of sorted) {
      rel.set(letter, totalCount > 0 ? count / totalCount : 0);
    }
    return { textRel: rel, letters: sorted.map(([l]) => l) };
  }, [frequencies]);

  if (mode === 'comparison' && canCompare) {
    return (
      <div className="min-h-[400px] w-full">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700">
            {t('chart.lf.vsLang').replace(
              '{lang}',
              t(`lang.${language}` as Parameters<typeof t>[0]),
            )}
          </h4>
          <Toggle mode={mode} onToggle={setMode} canCompare={canCompare} />
        </div>
        <ComparisonPlot
          textRel={textRel}
          langDist={langDist!}
          letters={letters}
          language={language!}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[400px] w-full">
      {canCompare && (
        <div className="mb-2 flex items-center justify-end">
          <Toggle mode={mode} onToggle={setMode} canCompare={canCompare} />
        </div>
      )}
      <NormalPlot frequencies={frequencies} title={resolvedTitle} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Toggle({
  mode,
  onToggle,
  canCompare,
}: {
  mode: 'normal' | 'comparison';
  onToggle: (m: 'normal' | 'comparison') => void;
  canCompare: boolean;
}) {
  if (!canCompare) return null;

  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 text-[10px] font-medium sm:text-xs">
      <button
        onClick={() => onToggle('normal')}
        className={`rounded-l-md px-2.5 py-1 transition-colors ${
          mode === 'normal'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        A–Z
      </button>
      <button
        onClick={() => onToggle('comparison')}
        className={`rounded-r-md px-2.5 py-1 transition-colors ${
          mode === 'comparison'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        Δ
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function NormalPlot({
  frequencies,
  title,
}: {
  frequencies: Map<string, number>;
  title: string;
}) {
  const { t } = useI18n();
  const sorted = Array.from(frequencies.entries()).sort(([a], [b]) => a.localeCompare(b));
  const totalCount = sorted.reduce((sum, [, count]) => sum + count, 0);

  const letters = sorted.map(([letter]) => letter);
  const counts = sorted.map(([, count]) => count);
  const relativeFreqs = counts.map((c) => (totalCount > 0 ? c / totalCount : 0));
  const percentages = relativeFreqs.map((f) => (f * 100).toFixed(2));

  const data: Data[] = [
    {
      type: 'bar',
      x: letters,
      y: relativeFreqs,
      marker: { color: '#3b82f6' },
      hovertemplate: '<b>%{x}</b><br>Count: %{customdata[0]}<br>Percentage: %{customdata[1]}%<extra></extra>',
      customdata: counts.map((c, i) => [c, percentages[i]]),
    },
  ];

  const layout: Partial<Layout> = {
    title: { text: title, font: { family: 'Inter, system-ui, sans-serif', size: 18 } },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: t('chart.letter') },
      showgrid: false,
    },
    yaxis: {
      title: { text: t('chart.relFreq') },
      showgrid: true,
      gridcolor: '#e5e7eb',
      gridwidth: 1,
    },
    margin: { t: 60, r: 30, b: 60, l: 70 },
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={plotConfig}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

/* -------------------------------------------------------------------------- */

function ComparisonPlot({
  textRel,
  langDist,
  letters,
  language,
}: {
  textRel: Map<string, number>;
  langDist: Record<string, number>;
  letters: string[];
  language: string;
}) {
  const { t } = useI18n();

  // Merge letter sets from both text and language average
  const allLetters = new Set([...letters, ...Object.keys(langDist)]);
  const sortedLetters = Array.from(allLetters).sort((a, b) => a.localeCompare(b));

  const textVals = sortedLetters.map((l) => (textRel.get(l) ?? 0) * 100);
  const langVals = sortedLetters.map((l) => (langDist[l] ?? 0) * 100);
  const delta = sortedLetters.map((_, i) => textVals[i] - langVals[i]);

  const colors = delta.map((d) => (d >= 0 ? '#3b82f6' : '#94a3b8'));

  const translatedLang = t(`lang.${language}` as Parameters<typeof t>[0]);

  const data: Data[] = [
    {
      type: 'bar',
      x: sortedLetters,
      y: delta,
      marker: { color: colors },
      hovertemplate: sortedLetters.map(
        (l, i) =>
          `<b>${l}</b><br>` +
          `${t('chart.lf.textLabel')}: ${textVals[i].toFixed(2)}%<br>` +
          `${t('chart.lf.langAvg').replace('{lang}', translatedLang)}: ${langVals[i].toFixed(2)}%<br>` +
          `Δ: ${delta[i] >= 0 ? '+' : ''}${delta[i].toFixed(2)} pp` +
          `<extra></extra>`,
      ),
      showlegend: false,
    },
  ];

  const layout: Partial<Layout> = {
    title: {
      text: t('chart.lf.vsLang').replace('{lang}', translatedLang),
      font: { family: 'Inter, system-ui, sans-serif', size: 16 },
    },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: t('chart.letter') },
      showgrid: false,
    },
    yaxis: {
      title: { text: t('chart.lf.delta') },
      showgrid: true,
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#94a3b8',
      zerolinewidth: 1.5,
    },
    margin: { t: 50, r: 30, b: 50, l: 60 },
    annotations: [
      {
        x: 0.01,
        y: 1,
        xref: 'paper',
        yref: 'paper',
        text: `↑ ${t('chart.lf.above')} ${translatedLang}`,
        showarrow: false,
        font: { size: 10, color: '#3b82f6' },
        xanchor: 'left',
        yanchor: 'top',
      },
      {
        x: 0.01,
        y: 0,
        xref: 'paper',
        yref: 'paper',
        text: `↓ ${t('chart.lf.below')} ${translatedLang}`,
        showarrow: false,
        font: { size: 10, color: '#94a3b8' },
        xanchor: 'left',
        yanchor: 'bottom',
      },
    ],
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={plotConfig}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
