import { useState } from 'react';
import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import { useI18n } from '../i18n/I18nContext';
import hullData from '../data/precomputed_hulls.json';

export interface BubbleEntry {
  title: string;
  author: string;
  language: string;
  period: string;
  letterEntropy: number;
  wordEntropy: number;
  meanWordLength: number;
  vocabularyRichness: number; // unique words / total words
}

interface CorpusBubbleChartProps {
  entries: BubbleEntry[];
  title?: string;
}

interface HullData {
  language: string;
  letterHull: [number, number][];
  wordHull: [number, number][];
}

const precomputedHulls = hullData as HullData[];

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

/** Smooth a closed polygon using Catmull-Rom spline → organic "potato" shape */
function smoothClosed(pts: [number, number][], segments: number = 32): [number, number][] {
  const n = pts.length;
  if (n < 3) return [...pts, pts[0]];
  const result: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    for (let s = 0; s < segments; s++) {
      const t = s / segments;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y =
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      result.push([x, y]);
    }
  }
  result.push(result[0]); // close
  return result;
}

export function CorpusBubbleChart({
  entries,
  title,
}: CorpusBubbleChartProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<EntropyMode>('letter');
  const [showHulls, setShowHulls] = useState(true);
  const resolvedTitle = title ?? t('chart.bubbleTitle');

  // Group by language for legend, sorted by translated name
  const byLangUnsorted = new Map<string, BubbleEntry[]>();
  for (const e of entries) {
    const arr = byLangUnsorted.get(e.language) ?? [];
    arr.push(e);
    byLangUnsorted.set(e.language, arr);
  }
  const sortedLangs = Array.from(byLangUnsorted.keys()).sort((a, b) =>
    t(`lang.${a}` as Parameters<typeof t>[0]).localeCompare(t(`lang.${b}` as Parameters<typeof t>[0])),
  );
  const byLang = new Map(sortedLangs.map((l) => [l, byLangUnsorted.get(l)!]));

  // Normalize bubble size: vocabulary richness → marker size (10–45)
  const allRichness = entries.map((e) => e.vocabularyRichness);
  const minR = Math.min(...allRichness);
  const maxR = Math.max(...allRichness);
  const scaleSize = (r: number) => {
    if (maxR === minR) return 25;
    return 12 + ((r - minR) / (maxR - minR)) * 35;
  };

  const data: Data[] = [];

  // Smooth "potato" fills behind markers (sorted to match legend order)
  const sortedHulls = [...precomputedHulls].sort((a, b) =>
    t(`lang.${a.language}` as Parameters<typeof t>[0]).localeCompare(t(`lang.${b.language}` as Parameters<typeof t>[0])),
  );
  if (showHulls) {
    for (const h of sortedHulls) {
      const rawHull = mode === 'letter' ? h.letterHull : h.wordHull;
      if (rawHull.length < 3) continue;
      const smooth = smoothClosed(rawHull);
      const color = LANGUAGE_COLORS[h.language] ?? '#64748b';
      const langLabel = t(`lang.${h.language}` as Parameters<typeof t>[0]);
      data.push({
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: langLabel,
        legendgroup: h.language,
        showlegend: false,
        x: smooth.map((p) => p[0]),
        y: smooth.map((p) => p[1]),
        fill: 'toself',
        fillcolor: color + '40',
        line: { color: color + '90', width: 2 },
        text: smooth.map(() => langLabel),
        hoverinfo: 'text',
        hoveron: 'fills+points',
        hoverlabel: {
          bgcolor: color,
          bordercolor: color,
          font: { family: 'Inter, system-ui, sans-serif', size: 14, color: 'white' },
        },
      } as Data);
    }
  }

  // Markers: dots in potato mode, sized bubbles in bubble mode
  for (const [lang, items] of byLang.entries()) {
    data.push({
      type: 'scatter' as const,
      mode: 'markers' as const,
      name: t(`lang.${lang}` as Parameters<typeof t>[0]),
      legendgroup: lang,
      x: items.map((e) => (mode === 'letter' ? e.letterEntropy : e.wordEntropy)),
      y: items.map((e) => e.meanWordLength),
      text: items.map(
        (e) =>
          `<b style="font-size:14px">${e.title}</b><br>` +
          `${e.author}<br>` +
          `${t(`lang.${e.language}` as Parameters<typeof t>[0])} · ${e.period}<br><br>` +
          `${t('chart.bubble.letterH')}: <b>${e.letterEntropy.toFixed(3)}</b> bits<br>` +
          `${t('chart.bubble.wordH')}: <b>${e.wordEntropy.toFixed(2)}</b> bits<br>` +
          `${t('chart.bubble.meanLen')}: <b>${e.meanWordLength.toFixed(2)}</b><br>` +
          `${t('chart.bubble.vocRich')}: <b>${(e.vocabularyRichness * 100).toFixed(1)}%</b>`,
      ),
      hovertemplate: '%{text}<extra></extra>',
      hoverlabel: {
        bgcolor: LANGUAGE_COLORS[lang] ?? '#64748b',
        bordercolor: LANGUAGE_COLORS[lang] ?? '#64748b',
        font: { family: 'Inter, system-ui, sans-serif', size: 13, color: 'white' },
      },
      marker: showHulls
        ? { size: 8, color: LANGUAGE_COLORS[lang] ?? '#64748b', opacity: 0.9, line: { color: 'white', width: 1 } }
        : { size: items.map((e) => scaleSize(e.vocabularyRichness)), color: LANGUAGE_COLORS[lang] ?? '#64748b', opacity: 0.8, line: { color: 'white', width: 1.5 } },
    });
  }

  const xLabel = mode === 'letter' ? t('chart.bubbleX') : t('chart.bubbleX.word');

  // Fix axis ranges so they don't rescale when isolating a language
  const xValues = entries.map((e) => (mode === 'letter' ? e.letterEntropy : e.wordEntropy));
  const yValues = entries.map((e) => e.meanWordLength);
  const xPad = (Math.max(...xValues) - Math.min(...xValues)) * 0.08;
  const yPad = (Math.max(...yValues) - Math.min(...yValues)) * 0.08;
  const xRange: [number, number] = [Math.min(...xValues) - xPad, Math.max(...xValues) + xPad];
  const yRange: [number, number] = [Math.min(...yValues) - yPad, Math.max(...yValues) + yPad];

  const layout: Partial<Layout> = {
    title: { text: resolvedTitle, font: { family: 'Inter, system-ui, sans-serif', size: 16 } },
    font: { family: 'Inter, system-ui, sans-serif', size: 12 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: xLabel },
      showgrid: true,
      gridcolor: '#f1f5f9',
      zeroline: false,
      range: xRange,
    },
    yaxis: {
      title: { text: t('chart.bubbleY') },
      showgrid: true,
      gridcolor: '#f1f5f9',
      zeroline: false,
      range: yRange,
    },
    legend: {
      orientation: 'h',
      x: 0.5,
      y: -0.22,
      xanchor: 'center',
      yanchor: 'top',
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#e5e7eb',
      borderwidth: 1,
      font: { size: 11 },
      itemdoubleclick: 'toggleothers',
    },
    margin: { t: 50, r: 20, b: 120, l: 60 },
    hoverlabel: {
      bgcolor: 'white',
      bordercolor: '#cbd5e1',
      font: { family: 'Inter, system-ui, sans-serif', size: 12 },
    },
    annotations: [
      ...(showHulls
        ? []
        : [
            {
              text: t('chart.bubbleSize'),
              xref: 'paper' as const,
              yref: 'paper' as const,
              x: 0,
              y: -0.18,
              showarrow: false,
              font: { size: 10, color: '#94a3b8' },
            },
          ]),
      {
        text: t('chart.legendHint'),
        xref: 'paper',
        yref: 'paper',
        x: 1,
        y: -0.18,
        xanchor: 'right',
        showarrow: false,
        font: { size: 9, color: '#94a3b8' },
      },
    ],
  };

  return (
    <div className="min-h-[450px] w-full sm:min-h-[500px]">
      <div className="mb-2 flex items-center justify-end gap-2">
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setShowHulls(!showHulls)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              showHulls ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                showHulls ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span>{t('chart.bubble.groups')}</span>
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
            {t('chart.bubble.toggleLetter')}
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
            {t('chart.bubble.toggleWord')}
          </button>
        </div>
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
