import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import { useI18n } from '../i18n/I18nContext';

interface LetterChartProps {
  frequencies: Map<string, number>;
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: { format: 'png', scale: 2 },
};

export function LetterChart({ frequencies, title }: LetterChartProps) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t('chart.letterFreq');
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
    title: { text: resolvedTitle, font: { family: 'Inter, system-ui, sans-serif', size: 18 } },
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
    <div className="min-h-[400px] w-full">
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
