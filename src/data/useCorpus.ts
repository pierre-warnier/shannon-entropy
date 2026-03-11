import { useState, useCallback } from 'react';
import type { CorpusMetadata } from '../types';
import catalogData from './catalog.json';

export const catalog: CorpusMetadata[] = catalogData as CorpusMetadata[];

export function useCorpus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadText = useCallback(async (corpus: CorpusMetadata): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(corpus.textPath);
      if (!response.ok) throw new Error(`Failed to load ${corpus.title}`);
      const text = await response.text();
      return text;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load text';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { catalog, loading, error, loadText };
}
