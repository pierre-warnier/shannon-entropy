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
import { detectLanguage } from '../analysis/detectLanguage';

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
  detectedLanguageCode?: string;
}

type IncomingMessage = { type: 'analyze'; text: string; languageCode?: string };

self.onmessage = (event: MessageEvent<IncomingMessage>) => {
  const msg = event.data;

  if (msg.type !== 'analyze') {
    return;
  }

  try {
    // Auto-detect language when not provided (e.g. uploaded files)
    let langCode = msg.languageCode;
    let detectedLangCode: string | undefined;
    if (!langCode) {
      const detection = detectLanguage(msg.text);
      if (detection.languageCode) {
        langCode = detection.languageCode;
        detectedLangCode = detection.languageCode;
      }
    }

    const normalized = normalizeText(msg.text);
    const chars = tokenizeCharacters(normalized);
    const words = tokenizeWords(normalized, langCode);

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
    if (langCode) {
      const filteredWords = removeStopwords(words, langCode);
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
      detectedLanguageCode: detectedLangCode,
    };

    self.postMessage({ type: 'result', data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: 'error', message });
  }
};
