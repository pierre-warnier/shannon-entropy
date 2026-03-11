/**
 * Stopword filtering for multilingual text analysis.
 * Uses stopwords-iso for comprehensive multilingual stopword lists.
 */

import stopwordsData from 'stopwords-iso';

const stopwordSets = new Map<string, Set<string>>();

/** Language code mapping from our codes to ISO 639-1 codes used by stopwords-iso */
const CODE_MAP: Record<string, string> = {
  fr: 'fr',
  fro: 'fr', // Old French → modern French stopwords as approximation
  la: 'la',
  grc: 'el', // Ancient Greek → modern Greek stopwords as approximation
  nl: 'nl',
  en: 'en',
  it: 'it',
  es: 'es',
  de: 'de',
  he: 'he',
  ar: 'ar',
};

function getStopwordSet(languageCode: string): Set<string> {
  const isoCode = CODE_MAP[languageCode] ?? languageCode;

  if (stopwordSets.has(isoCode)) {
    return stopwordSets.get(isoCode)!;
  }

  const words: string[] = (stopwordsData as Record<string, string[]>)[isoCode] ?? [];
  const set = new Set(words.map((w) => w.toLowerCase()));
  stopwordSets.set(isoCode, set);
  return set;
}

/**
 * Check if a word is a stopword in the given language.
 */
export function isStopword(word: string, languageCode: string): boolean {
  const set = getStopwordSet(languageCode);
  return set.has(word.toLowerCase());
}

/**
 * Filter out stopwords from a word list.
 */
export function removeStopwords(words: string[], languageCode: string): string[] {
  const set = getStopwordSet(languageCode);
  return words.filter((w) => !set.has(w.toLowerCase()));
}
