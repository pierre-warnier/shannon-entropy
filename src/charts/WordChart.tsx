import Plot from 'react-plotly.js';
import type { Config, Data, Layout } from 'plotly.js-dist-min';

interface WordChartProps {
  words: [string, number][];
  title?: string;
}

const plotConfig: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: { format: 'png', scale: 2 },
};

export function WordChart({ words, title = 'Top Words by Frequency' }: WordChartProps) {
  const topWords = words.slice(0, 30);

  // Reverse so highest-frequency word appears at the top of the horizontal bar chart
  const reversed = [...topWords].reverse();
  const labels = reversed.map(([word]) => word);
  const counts = reversed.map(([, count]) => count);

  const data: Data[] = [
    {
      type: 'bar',
      orientation: 'h',
      x: counts,
      y: labels,
      marker: { color: '#10b981' },
      hovertemplate: '<b>%{y}</b><br>Count: %{x}<extra></extra>',
    },
  ];

  const dynamicHeight = Math.max(400, topWords.length * 24 + 100);

  const layout: Partial<Layout> = {
    title: { text: title, font: { family: 'Inter, system-ui, sans-serif', size: 18 } },
    font: { family: 'Inter, system-ui, sans-serif' },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    xaxis: {
      title: { text: 'Count' },
      showgrid: true,
      gridcolor: '#e5e7eb',
      gridwidth: 1,
    },
    yaxis: {
      showgrid: false,
      automargin: true,
    },
    height: dynamicHeight,
    margin: { t: 60, r: 30, b: 60, l: 120 },
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
