import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import { useI18n } from '../i18n/I18nContext';
import rawWordLengths from '../data/precomputed_wordlengths.json';

interface WordLengthEntry {
  language: string;
  distribution: Record<string, number>;
}

interface LengthChartProps {
  distribution: Map<number, number>;
  language?: string; // display name e.g. "French", "Latin"
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
};

/** Lookup from language display name to average distribution. */
const langDistMap = new Map<string, Record<string, number>>(
  (rawWordLengths as unknown as WordLengthEntry[]).map((entry) => [entry.language, entry.distribution]),
);

export function LengthChart({ distribution, language, title }: LengthChartProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'normal' | 'comparison'>('normal');

  const langDist = language ? langDistMap.get(language) : undefined;
  const canCompare = !!langDist;

  const resolvedTitle = title ?? t('chart.wordLength');

  // Compute relative frequencies for the text
  const { textRel, maxLen } = useMemo(() => {
    const total = Array.from(distribution.values()).reduce((s, c) => s + c, 0);
    const rel = new Map<number, number>();
    let max = 0;
    for (const [len, count] of distribution) {
      rel.set(len, total > 0 ? count / total : 0);
      if (len > max) max = len;
    }
    return { textRel: rel, maxLen: max };
  }, [distribution]);

  if (mode === 'comparison' && canCompare) {
    return (
      <div className="min-h-[400px] w-full">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700">
            {t('chart.wl.vsLang').replace(
              '{lang}',
              t(`lang.${language}` as Parameters<typeof t>[0]),
            )}
          </h4>
          <Toggle mode={mode} onToggle={setMode} canCompare={canCompare} />
        </div>
        <ComparisonPlot
          textRel={textRel}
          langDist={langDist!}
          maxLen={maxLen}
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
      <NormalPlot distribution={distribution} title={resolvedTitle} />
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
  const { t } = useI18n();
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
        {t('chart.wl.normal')}
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
  distribution,
  title,
}: {
  distribution: Map<number, number>;
  title: string;
}) {
  const { t } = useI18n();
  const sorted = Array.from(distribution.entries()).sort(([a], [b]) => a - b);
  const lengths = sorted.map(([length]) => length);
  const counts = sorted.map(([, count]) => count);

  const data: Data[] = [
    {
      type: 'bar',
      x: lengths,
      y: counts,
      marker: { color: '#8b5cf6' },
      hovertemplate: `${t('chart.wordLenAxis')}: %{x}<br>${t('chart.count')}: %{y}<extra></extra>`,
    },
  ];

  const layout: Partial<Layout> = {
    title: { text: title, font: { family: 'Inter, system-ui, sans-serif', size: 18 } },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: t('chart.wordLenAxis') },
      showgrid: false,
      dtick: 1,
    },
    yaxis: {
      title: { text: t('chart.count') },
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
  maxLen,
  language,
}: {
  textRel: Map<number, number>;
  langDist: Record<string, number>;
  maxLen: number;
  language: string;
}) {
  const { t } = useI18n();

  // Compute max length from both distributions
  const langMaxLen = Math.max(...Object.keys(langDist).map(Number));
  const effectiveMax = Math.max(maxLen, langMaxLen);
  const lengths = Array.from({ length: effectiveMax }, (_, i) => i + 1);

  const textVals = lengths.map((l) => (textRel.get(l) ?? 0) * 100);
  const langVals = lengths.map((l) => (langDist[String(l)] ?? 0) * 100);
  const delta = lengths.map((_, i) => textVals[i] - langVals[i]);

  const colors = delta.map((d) => (d >= 0 ? '#8b5cf6' : '#94a3b8'));

  const translatedLang = t(`lang.${language}` as Parameters<typeof t>[0]);

  const data: Data[] = [
    {
      type: 'bar',
      x: lengths,
      y: delta,
      marker: { color: colors },
      hovertemplate: lengths.map(
        (l, i) =>
          `<b>${t('chart.wordLenAxis')}: ${l}</b><br>` +
          `${t('chart.wl.textLabel')}: ${textVals[i].toFixed(2)}%<br>` +
          `${t('chart.wl.langAvg').replace('{lang}', translatedLang)}: ${langVals[i].toFixed(2)}%<br>` +
          `Δ: ${delta[i] >= 0 ? '+' : ''}${delta[i].toFixed(2)} pp` +
          `<extra></extra>`,
      ),
      showlegend: false,
    },
  ];

  const layout: Partial<Layout> = {
    title: {
      text: t('chart.wl.vsLang').replace('{lang}', translatedLang),
      font: { family: 'Inter, system-ui, sans-serif', size: 16 },
    },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: t('chart.wordLenAxis') },
      showgrid: false,
      dtick: 1,
    },
    yaxis: {
      title: { text: t('chart.wl.delta') },
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
        text: `↑ ${t('chart.wl.above')} ${translatedLang}`,
        showarrow: false,
        font: { size: 10, color: '#8b5cf6' },
        xanchor: 'left',
        yanchor: 'top',
      },
      {
        x: 0.01,
        y: 0,
        xref: 'paper',
        yref: 'paper',
        text: `↓ ${t('chart.wl.below')} ${translatedLang}`,
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
