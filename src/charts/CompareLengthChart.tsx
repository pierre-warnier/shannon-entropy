import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';
import { useI18n } from '../i18n/I18nContext';

interface CompareLengthChartProps {
  distA: Map<number, number>;
  distB: Map<number, number>;
  labelA: string;
  labelB: string;
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
};

const COLOR_A = '#3b82f6'; // blue
const COLOR_B = '#ef4444'; // red

export function CompareLengthChart({
  distA,
  distB,
  labelA,
  labelB,
  title,
}: CompareLengthChartProps) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t('chart.wordLengthOverlay');

  // Normalize to relative frequencies
  const totalA = Array.from(distA.values()).reduce((s, c) => s + c, 0);
  const totalB = Array.from(distB.values()).reduce((s, c) => s + c, 0);

  const maxLen = Math.max(...distA.keys(), ...distB.keys());
  const lengths = Array.from({ length: maxLen }, (_, i) => i + 1);

  const relA = lengths.map((l) => (totalA > 0 ? (distA.get(l) ?? 0) / totalA : 0));
  const relB = lengths.map((l) => (totalB > 0 ? (distB.get(l) ?? 0) / totalB : 0));
  const diff = lengths.map((_, i) => relA[i] - relB[i]);

  // Color each bar
  const colors = diff.map((d) => (d >= 0 ? COLOR_A : COLOR_B));

  const data: Data[] = [
    {
      type: 'bar',
      x: lengths,
      y: diff,
      marker: { color: colors },
      hovertemplate: lengths.map(
        (l, i) =>
          `<b>${t('chart.wordLenAxis')}: ${l}</b><br>` +
          `${labelA}: ${(relA[i] * 100).toFixed(2)}%<br>` +
          `${labelB}: ${(relB[i] * 100).toFixed(2)}%<br>` +
          `Δ: ${diff[i] >= 0 ? '+' : ''}${(diff[i] * 100).toFixed(2)} pp` +
          `<extra></extra>`,
      ),
      showlegend: false,
    },
    // Invisible traces for legend
    {
      type: 'bar',
      x: [null],
      y: [null],
      name: labelA,
      marker: { color: COLOR_A },
      showlegend: true,
    },
    {
      type: 'bar',
      x: [null],
      y: [null],
      name: labelB,
      marker: { color: COLOR_B },
      showlegend: true,
    },
  ];

  const layout: Partial<Layout> = {
    title: { text: resolvedTitle, font: { family: 'Inter, system-ui, sans-serif', size: 16 } },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: t('chart.wordLenAxis') },
      showgrid: false,
      dtick: 1,
    },
    yaxis: {
      title: { text: t('chart.diff') },
      showgrid: true,
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#94a3b8',
      zerolinewidth: 1.5,
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
    margin: { t: 50, r: 30, b: 50, l: 60 },
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
