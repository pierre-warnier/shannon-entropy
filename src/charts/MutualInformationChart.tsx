import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';

interface MutualInformationChartProps {
  pairs: { pair: [string, string]; mi: number }[];
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: { format: 'png', scale: 2 },
};

export function MutualInformationChart({
  pairs,
  title = 'Top Word Associations (Mutual Information)',
}: MutualInformationChartProps) {
  const topPairs = pairs.slice(0, 20);

  // Reverse so highest MI score appears at the top of the horizontal bar chart
  const reversed = [...topPairs].reverse();
  const labels = reversed.map((p) => `${p.pair[0]} \u2192 ${p.pair[1]}`);
  const scores = reversed.map((p) => p.mi);

  const data: Data[] = [
    {
      type: 'bar',
      orientation: 'h',
      x: scores,
      y: labels,
      marker: { color: '#f59e0b' },
      hovertemplate: '<b>%{y}</b><br>MI Score: %{x:.4f}<extra></extra>',
    },
  ];

  const dynamicHeight = Math.max(400, topPairs.length * 28 + 100);

  const layout: Partial<Layout> = {
    title: { text: title, font: { family: 'Inter, system-ui, sans-serif', size: 18 } },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: 'Mutual Information Score' },
      showgrid: true,
      gridcolor: '#e5e7eb',
      gridwidth: 1,
    },
    yaxis: {
      showgrid: false,
      automargin: true,
    },
    height: dynamicHeight,
    margin: { t: 60, r: 30, b: 60, l: 160 },
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
