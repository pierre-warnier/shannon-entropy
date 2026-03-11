import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import { useI18n } from '../i18n/I18nContext';

interface EntropyChartProps {
  entries: { label: string; letterEntropy: number; wordEntropy: number }[];
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: { format: 'png', scale: 2 },
};

export function EntropyChart({ entries, title }: EntropyChartProps) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t('chart.entropy');
  const labels = entries.map((e) => e.label);
  const letterEntropies = entries.map((e) => e.letterEntropy);
  const wordEntropies = entries.map((e) => e.wordEntropy);

  const data: Data[] = [
    {
      type: 'bar',
      name: t('chart.letterEntropyLabel'),
      x: labels,
      y: letterEntropies,
      marker: { color: '#3b82f6' },
      hovertemplate: `<b>%{x}</b><br>${t('chart.letterEntropyHover')}<extra></extra>`,
    },
    {
      type: 'bar',
      name: t('chart.wordEntropyLabel'),
      x: labels,
      y: wordEntropies,
      marker: { color: '#f97316' },
      hovertemplate: `<b>%{x}</b><br>${t('chart.wordEntropyHover')}<extra></extra>`,
    },
  ];

  const layout: Partial<Layout> = {
    title: { text: resolvedTitle, font: { family: 'Inter, system-ui, sans-serif', size: 18 } },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    barmode: 'group',
    xaxis: {
      showgrid: false,
      automargin: true,
    },
    yaxis: {
      title: { text: t('chart.entropyBits') },
      showgrid: true,
      gridcolor: '#e5e7eb',
      gridwidth: 1,
    },
    legend: {
      x: 0.98,
      y: 0.98,
      xanchor: 'right',
      yanchor: 'top',
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#e5e7eb',
      borderwidth: 1,
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
