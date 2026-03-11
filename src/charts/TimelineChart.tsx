import { useState, useCallback, useRef } from 'react';
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
  '7th century': 650,
  '8th century': 750,
  '9th century': 850,
  '10th century': 950,
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
  Hebrew: '#0d9488',
  Arabic: '#7c3aed',
};

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
};

type EntropyMode = 'letter' | 'word';

export function TimelineChart({
  entries,
  title,
  xLabel,
}: TimelineChartProps) {
  const { t } = useI18n();
  const [showTrends, setShowTrends] = useState(false);
  const [mode, setMode] = useState<EntropyMode>('letter');
  const [hiddenLangs, setHiddenLangs] = useState<Set<string>>(new Set());

  const resolvedTitle = title ?? t('chart.timeline.title');
  const resolvedXLabel = xLabel ?? t('chart.timeline.period');
  const yLabel = mode === 'letter' ? t('chart.timeline.y') : t('chart.timeline.yWord');

  const langKeysRef = useRef<string[]>([]);

  // Group by language, sorted by translated name
  const byLangUnsorted = new Map<string, TimelineEntry[]>();
  for (const e of entries) {
    const arr = byLangUnsorted.get(e.language) ?? [];
    arr.push(e);
    byLangUnsorted.set(e.language, arr);
  }
  const sortedLangs = Array.from(byLangUnsorted.keys()).sort((a, b) =>
    t(`lang.${a}` as Parameters<typeof t>[0]).localeCompare(t(`lang.${b}` as Parameters<typeof t>[0])),
  );
  const byLang = new Map(sortedLangs.map((l) => [l, byLangUnsorted.get(l)!]));
  langKeysRef.current = sortedLangs;

  // Build unique tick values/labels from the data
  const periodsInData = new Set(entries.map((e) => e.period));
  const sortedPeriods = Array.from(periodsInData)
    .filter((p) => p in PERIOD_YEARS)
    .sort((a, b) => PERIOD_YEARS[a] - PERIOD_YEARS[b]);

  const data: Data[] = [];

  // Marker traces
  for (const [lang, items] of byLang.entries()) {
    const isHidden = hiddenLangs.has(lang);
    data.push({
      type: 'scatter' as const,
      mode: 'markers' as const,
      name: lang,
      legendgroup: lang,
      visible: isHidden ? 'legendonly' : true,
      x: items.map((e) => PERIOD_YEARS[e.period] ?? 0),
      y: items.map((e) => mode === 'letter' ? e.letterEntropy : e.wordEntropy),
      text: items.map(
        (e) =>
          `<b style="font-size:14px">${e.title}</b><br>` +
          `${e.author}<br>` +
          `${e.language} · ${e.period}<br><br>` +
          `${t('chart.bubble.letterH')}: <b>${e.letterEntropy.toFixed(3)}</b> bits<br>` +
          `${t('chart.bubble.wordH')}: <b>${e.wordEntropy.toFixed(2)}</b> bits`,
      ),
      hovertemplate: '%{text}<extra></extra>',
      hoverlabel: {
        bgcolor: LANGUAGE_COLORS[lang] ?? '#64748b',
        bordercolor: LANGUAGE_COLORS[lang] ?? '#64748b',
        font: { family: 'Inter, system-ui, sans-serif', size: 13, color: 'white' },
      },
      marker: {
        size: 12,
        color: LANGUAGE_COLORS[lang] ?? '#64748b',
        opacity: 0.85,
        line: { color: 'white', width: 1.5 },
      },
    });
  }

  // Add precomputed trend lines (letter mode only — trends are computed for letter entropy)
  if (showTrends && mode === 'letter') {
    for (const trend of trends) {
      const color = LANGUAGE_COLORS[trend.language] ?? '#64748b';
      const isHidden = hiddenLangs.has(trend.language);
      const yStart = trend.slope * trend.xMin + trend.intercept;
      const yEnd = trend.slope * trend.xMax + trend.intercept;
      data.push({
        type: 'scatter' as const,
        mode: 'lines' as const,
        x: [trend.xMin, trend.xMax],
        y: [yStart, yEnd],
        line: { color: color + '60', width: 2, dash: 'dot' },
        legendgroup: trend.language,
        showlegend: false,
        visible: isHidden ? 'legendonly' : true,
        hoverinfo: 'skip',
      } as Data);
    }
  }

  // Fix axis ranges so isolating a language doesn't rescale
  const allX = entries.map((e) => PERIOD_YEARS[e.period] ?? 0);
  const allY = entries.map((e) => mode === 'letter' ? e.letterEntropy : e.wordEntropy);
  const xPad = (Math.max(...allX) - Math.min(...allX)) * 0.05;
  const yPad = (Math.max(...allY) - Math.min(...allY)) * 0.08;

  const layout: Partial<Layout> = {
    title: { text: resolvedTitle, font: { family: 'Inter, system-ui, sans-serif', size: 16 } },
    font: { family: 'Inter, system-ui, sans-serif', size: 12 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: resolvedXLabel },
      showgrid: true,
      gridcolor: '#f1f5f9',
      zeroline: false,
      tickvals: sortedPeriods.map((p) => PERIOD_YEARS[p]),
      ticktext: sortedPeriods,
      tickangle: -30,
      range: [Math.min(...allX) - xPad, Math.max(...allX) + xPad],
    },
    yaxis: {
      title: { text: yLabel },
      showgrid: true,
      gridcolor: '#f1f5f9',
      zeroline: false,
      range: [Math.min(...allY) - yPad, Math.max(...allY) + yPad],
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

  const handleLegendClick = useCallback((e: { curveNumber: number }) => {
    const idx = e.curveNumber;
    const clickedTrace = data[idx];
    if (!clickedTrace) return true;
    const lang = (clickedTrace as { legendgroup?: string }).legendgroup;
    if (!lang) return true;

    setHiddenLangs((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) {
        next.delete(lang);
      } else {
        next.add(lang);
      }
      return next;
    });
    return false;
  }, [data]);

  const handleLegendDoubleClick = useCallback((e: { curveNumber: number }) => {
    const idx = e.curveNumber;
    const clickedTrace = data[idx];
    if (!clickedTrace) return true;
    const lang = (clickedTrace as { legendgroup?: string }).legendgroup;
    if (!lang) return true;

    setHiddenLangs((prev) => {
      const allLangs = langKeysRef.current;
      const currentlyVisible = allLangs.filter((l) => !prev.has(l));
      if (currentlyVisible.length === 1 && currentlyVisible[0] === lang) {
        return new Set();
      }
      return new Set(allLangs.filter((l) => l !== lang));
    });
    return false;
  }, [data]);

  const hasHidden = hiddenLangs.size > 0;

  return (
    <div className="min-h-[450px] w-full sm:min-h-[500px]">
      <div className="mb-2 flex items-center justify-end gap-2">
        {hasHidden && (
          <button
            type="button"
            onClick={() => setHiddenLangs(new Set())}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            {t('chart.resetView')}
          </button>
        )}
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
        <div className="inline-flex rounded-md border border-slate-200 text-xs font-medium shadow-sm">
          <button
            type="button"
            onClick={() => setMode('letter')}
            className={`rounded-l-md px-3 py-1.5 transition-colors ${
              mode === 'letter'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('chart.timeline.toggleLetter')}
          </button>
          <button
            type="button"
            onClick={() => setMode('word')}
            className={`rounded-r-md border-l border-slate-200 px-3 py-1.5 transition-colors ${
              mode === 'word'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('chart.timeline.toggleWord')}
          </button>
        </div>
      </div>
      <Plot
        data={data}
        layout={layout}
        config={plotConfig}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        onLegendClick={handleLegendClick as never}
        onLegendDoubleClick={handleLegendDoubleClick as never}
      />
    </div>
  );
}
