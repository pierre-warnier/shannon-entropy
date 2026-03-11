/**
 * Web Worker — full text-analysis pipeline off the main thread.
 *
 * Receives:  { type: 'analyze'; text: string; languageCode?: string }
 * Posts:     { type: 'result'; data: SerializedAnalysisResult }
 *        or  { type: 'error';  message: string }
 */

import { normalizeText } from '../analysis/preprocess';
import { tokenizeCharacters, tokenizeWords } from '../analysis/tokenizer';
import {
  letterFrequencies,
  wordFrequencies,
  topN,
} from '../analysis/frequencies';
import { shannonEntropy } from '../analysis/entropy';
import { wordLengthDistribution, wordLengthStats } from '../analysis/wordLength';
import { mutualInformation as computeMI } from '../analysis/mutualInformation';
import { removeStopwords } from '../analysis/stopwords';

export interface SerializedAnalysisResult {
  letterFrequencies: [string, number][];
  wordFrequencies: [string, number][];
  letterEntropy: number;
  wordEntropy: number;
  wordLengthDistribution: [number, number][];
  wordLengthStats: { mean: number; variance: number; median: number };
  totalCharacters: number;
  totalWords: number;
  uniqueWords: number;
  topWords: [string, number][];
  topWordsFiltered: [string, number][];
  mutualInformation: { pair: [string, string]; mi: number }[];
}

type IncomingMessage = { type: 'analyze'; text: string; languageCode?: string };

self.onmessage = (event: MessageEvent<IncomingMessage>) => {
  const msg = event.data;

  if (msg.type !== 'analyze') {
    return;
  }

  try {
    const normalized = normalizeText(msg.text);
    const chars = tokenizeCharacters(normalized);
    const words = tokenizeWords(normalized, msg.languageCode);

    const letterFreqs = letterFrequencies(chars);
    const wordFreqs = wordFrequencies(words);

    const letterH = shannonEntropy(letterFreqs);
    const wordH = shannonEntropy(wordFreqs);

    const wlDist = wordLengthDistribution(words);
    const wlStats = wordLengthStats(words);

    const mi = computeMI(words);

    // Top words: both with and without stopwords
    const top50 = topN(wordFreqs, 50);
    let topFiltered = top50;
    if (msg.languageCode) {
      const filteredWords = removeStopwords(words, msg.languageCode);
      const filteredFreqs = wordFrequencies(filteredWords);
      topFiltered = topN(filteredFreqs, 50);
    }

    const data: SerializedAnalysisResult = {
      letterFrequencies: [...letterFreqs.entries()],
      wordFrequencies: [...wordFreqs.entries()],
      letterEntropy: letterH,
      wordEntropy: wordH,
      wordLengthDistribution: [...wlDist.entries()],
      wordLengthStats: wlStats,
      totalCharacters: chars.length,
      totalWords: words.length,
      uniqueWords: wordFreqs.size,
      topWords: top50,
      topWordsFiltered: topFiltered,
      mutualInformation: mi,
    };

    self.postMessage({ type: 'result', data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: 'error', message });
  }
};
