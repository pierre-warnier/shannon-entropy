import { useEffect, useRef, useState, useCallback } from 'react';
import cloud from 'd3-cloud';

interface WordChartProps {
  words: [string, number][];
}

interface LayoutWord {
  text: string;
  size: number;
  count: number;
  x: number;
  y: number;
  rotate: number;
}

const COLORS = [
  '#1e3a5f',
  '#1e40af',
  '#2563eb',
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
];

function getColor(t: number): string {
  const idx = Math.min(Math.floor((1 - t) * COLORS.length), COLORS.length - 1);
  return COLORS[idx];
}

export function WordChart({ words }: WordChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutWords, setLayoutWords] = useState<LayoutWord[]>([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const computeLayout = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const width = el.clientWidth || 600;
    const height = Math.max(350, Math.min(width * 0.65, 550));
    setDimensions({ width, height });

    const topWords = words.slice(0, 60);
    if (topWords.length === 0) return;

    const maxCount = topWords[0][1];
    const minCount = topWords[topWords.length - 1][1];
    const range = maxCount - minCount || 1;

    // Aggressive font scaling to fill the frame
    const maxFont = Math.max(24, width / 6);
    const minFont = Math.max(11, width / 40);

    const cloudWords = topWords.map(([text, count]) => ({
      text,
      size: minFont + ((count - minCount) / range) * (maxFont - minFont),
      count,
    }));

    cloud<typeof cloudWords[number]>()
      .size([width, height])
      .words(cloudWords)
      .padding(1)
      .rotate(() => (Math.random() > 0.8 ? 90 : 0))
      .fontSize((d) => d.size)
      .spiral('archimedean')
      .on('end', (output) => {
        setLayoutWords(
          output.map((w) => {
            const cw = w as typeof cloudWords[number] & { x: number; y: number; rotate: number };
            return {
              text: cw.text!,
              size: cw.size!,
              count: cw.count,
              x: cw.x,
              y: cw.y,
              rotate: cw.rotate,
            };
          }),
        );
      })
      .start();
  }, [words]);

  // Compute on mount and when words change
  useEffect(() => {
    computeLayout();
  }, [computeLayout]);

  // Recompute on resize
  useEffect(() => {
    const observer = new ResizeObserver(() => computeLayout());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeLayout]);

  if (words.length === 0) return null;

  const maxCount = words[0]?.[1] ?? 1;
  const minCount = words[Math.min(79, words.length - 1)]?.[1] ?? 0;
  const range = maxCount - minCount || 1;

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full"
      >
        <g transform={`translate(${dimensions.width / 2},${dimensions.height / 2})`}>
          {layoutWords.map((w) => (
            <text
              key={w.text}
              textAnchor="middle"
              transform={`translate(${w.x},${w.y}) rotate(${w.rotate})`}
              style={{
                fontSize: `${w.size}px`,
                fill: getColor((w.count - minCount) / range),
                fontWeight: w.count > maxCount * 0.5 ? 700 : 500,
                fontFamily: 'Inter, system-ui, sans-serif',
                cursor: 'default',
              }}
            >
              <title>{`${w.text}: ${w.count}`}</title>
              {w.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
