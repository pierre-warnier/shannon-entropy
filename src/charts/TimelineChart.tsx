import { useState } from 'react';
import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import trendData from '../data/precomputed_trends.json';
import { useI18n } from '../i18n/I18nContext';

export interface TimelineEntry {
  title: string;
  author: string;
  language: string;
  period: string;
  letterEntropy: number;
  wordEntropy: number;
  meanWordLength: number;
  vocabularyRichness: number;
}

interface TrendLine {
  language: string;
  slope: number;
  intercept: number;
  xMin: number;
  xMax: number;
}

const trends = trendData as TrendLine[];

interface TimelineChartProps {
  entries: TimelineEntry[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

/** Map periods to numeric years for positioning on the x-axis */
const PERIOD_YEARS: Record<string, number> = {
  '8th century BC': -750,
  '5th century BC': -450,
  '4th century BC': -350,
  '1st century BC': -50,
  '1st century': 50,
  '2nd century': 150,
  '4th century': 350,
  '5th century': 450,
  '6th century': 550,
  '8th century': 750,
  '11th century': 1050,
  '12th century': 1150,
  '13th century': 1250,
  '14th century': 1350,
  '16th century': 1550,
  '17th century': 1650,
  '18th century': 1750,
  '19th century': 1850,
  '20th century': 1950,
};

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
};

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: { format: 'png', scale: 2 },
};

export function TimelineChart({
  entries,
  title = 'Entropy Through the Ages',
  xLabel = 'Historical Period',
  yLabel = 'Letter Entropy (bits/char.)',
}: TimelineChartProps) {
  const { t } = useI18n();
  const [showTrends, setShowTrends] = useState(true);

  // Group by language
  const byLang = new Map<string, TimelineEntry[]>();
  for (const e of entries) {
    const arr = byLang.get(e.language) ?? [];
    arr.push(e);
    byLang.set(e.language, arr);
  }

  // Build unique tick values/labels from the data
  const periodsInData = new Set(entries.map((e) => e.period));
  const sortedPeriods = Array.from(periodsInData)
    .filter((p) => p in PERIOD_YEARS)
    .sort((a, b) => PERIOD_YEARS[a] - PERIOD_YEARS[b]);

  const data: Data[] = [];

  // Marker traces
  for (const [lang, items] of byLang.entries()) {
    data.push({
      type: 'scatter' as const,
      mode: 'markers' as const,
      name: lang,
      x: items.map((e) => PERIOD_YEARS[e.period] ?? 0),
      y: items.map((e) => e.letterEntropy),
      text: items.map(
        (e) =>
          `<b>${e.title}</b><br>${e.author}<br>${e.language} · ${e.period}<br>` +
          `Letter H: ${e.letterEntropy.toFixed(3)} bits<br>` +
          `Word H: ${e.wordEntropy.toFixed(2)} bits`,
      ),
      hovertemplate: '%{text}<extra></extra>',
      marker: {
        size: 12,
        color: LANGUAGE_COLORS[lang] ?? '#64748b',
        opacity: 0.85,
        line: { color: 'white', width: 1.5 },
      },
    });
  }

  // Add precomputed trend lines
  if (showTrends) {
    for (const trend of trends) {
      const color = LANGUAGE_COLORS[trend.language] ?? '#64748b';
      const yStart = trend.slope * trend.xMin + trend.intercept;
      const yEnd = trend.slope * trend.xMax + trend.intercept;
      data.push({
        type: 'scatter' as const,
        mode: 'lines' as const,
        x: [trend.xMin, trend.xMax],
        y: [yStart, yEnd],
        line: { color: color + '60', width: 2, dash: 'dot' },
        showlegend: false,
        hoverinfo: 'skip',
      } as Data);
    }
  }

  const layout: Partial<Layout> = {
    title: { text: title, font: { family: 'Inter, system-ui, sans-serif', size: 16 } },
    font: { family: 'Inter, system-ui, sans-serif', size: 12 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: xLabel },
      showgrid: true,
      gridcolor: '#f1f5f9',
      zeroline: false,
      tickvals: sortedPeriods.map((p) => PERIOD_YEARS[p]),
      ticktext: sortedPeriods,
      tickangle: -30,
    },
    yaxis: {
      title: { text: yLabel },
      showgrid: true,
      gridcolor: '#f1f5f9',
      zeroline: false,
    },
    legend: {
      orientation: 'h',
      x: 0.5,
      y: -0.35,
      xanchor: 'center',
      yanchor: 'top',
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#e5e7eb',
      borderwidth: 1,
      font: { size: 11 },
      itemdoubleclick: 'toggleothers',
    },
    margin: { t: 50, r: 20, b: 150, l: 60 },
    hoverlabel: {
      bgcolor: 'white',
      bordercolor: '#cbd5e1',
      font: { family: 'Inter, system-ui, sans-serif', size: 12 },
    },
    annotations: [
      {
        text: t('chart.legendHint'),
        xref: 'paper',
        yref: 'paper',
        x: 1,
        y: -0.3,
        xanchor: 'right',
        showarrow: false,
        font: { size: 9, color: '#94a3b8' },
      },
    ],
  };

  return (
    <div className="min-h-[450px] w-full sm:min-h-[500px]">
      <div className="mb-2 flex justify-end">
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setShowTrends(!showTrends)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              showTrends ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                showTrends ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span>{t('chart.timeline.trends')}</span>
        </label>
      </div>
      <Plot
        data={data}
        layout={layout}
        config={plotConfig}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
