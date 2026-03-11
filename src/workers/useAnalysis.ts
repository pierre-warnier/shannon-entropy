import { useState, useCallback, useRef, useEffect } from 'react';
import type { AnalysisResult } from '../types';

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const analyze = useCallback((text: string, languageCode?: string) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    workerRef.current?.terminate();

    const worker = new Worker(
      new URL('./analysisWorker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'result') {
        const data = msg.data;
        const analysisResult: AnalysisResult = {
          ...data,
          letterFrequencies: new Map(data.letterFrequencies),
          wordFrequencies: new Map(data.wordFrequencies),
          wordLengthDistribution: new Map(data.wordLengthDistribution),
          detectedLanguageCode: data.detectedLanguageCode,
        };
        setResult(analysisResult);
        setAnalyzing(false);
      } else if (msg.type === 'error') {
        setError(msg.message);
        setAnalyzing(false);
      }
    };

    worker.onerror = (e) => {
      setError(e.message || 'Worker error');
      setAnalyzing(false);
    };

    worker.postMessage({ type: 'analyze', text, languageCode });
  }, []);

  return { result, analyzing, error, analyze };
}
