import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import { useI18n } from '../i18n/I18nContext';

interface LengthChartProps {
  distribution: Map<number, number>;
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: { format: 'png', scale: 2 },
};

export function LengthChart({ distribution, title }: LengthChartProps) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t('chart.wordLength');
  const sorted = Array.from(distribution.entries()).sort(([a], [b]) => a - b);

  const lengths = sorted.map(([length]) => length);
  const counts = sorted.map(([, count]) => count);

  const data: Data[] = [
    {
      type: 'bar',
      x: lengths,
      y: counts,
      marker: { color: '#8b5cf6' },
      hovertemplate: 'Length: %{x}<br>Count: %{y}<extra></extra>',
    },
  ];

  const layout: Partial<Layout> = {
    title: { text: resolvedTitle, font: { family: 'Inter, system-ui, sans-serif', size: 18 } },
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
