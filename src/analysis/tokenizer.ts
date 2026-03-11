/**
 * Tokenization utilities for linguistic analysis.
 *
 * Uses Intl.Segmenter for locale-aware word segmentation when available,
 * with regex fallback. Supports Greek, Latin, and all Unicode scripts.
 */

const LETTER_RE = /\p{L}/gu;
const HAS_LETTER_RE = /\p{L}/u;

/** ISO 639-1 locale codes for our supported languages. */
const LOCALE_MAP: Record<string, string> = {
  fr: 'fr',
  la: 'la',
  grc: 'el',
  nl: 'nl',
  en: 'en',
  it: 'it',
  es: 'es',
  de: 'de',
};

/**
 * Extract individual letter characters from a text string.
 * Non-letter characters are discarded. Order is preserved.
 */
export function tokenizeCharacters(text: string): string[] {
  return text.match(LETTER_RE) ?? [];
}

/**
 * Split text into word tokens using Intl.Segmenter for locale-aware
 * segmentation. Falls back to whitespace splitting if Segmenter
 * is unavailable.
 *
 * @param text - Input text (ideally already normalized).
 * @param languageCode - Optional ISO language code for locale-aware segmentation.
 * @returns Array of word-level tokens.
 */
export function tokenizeWords(text: string, languageCode?: string): string[] {
  const locale = languageCode ? LOCALE_MAP[languageCode] ?? languageCode : undefined;

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
    const segments = segmenter.segment(text);
    const words: string[] = [];
    for (const segment of segments) {
      if (segment.isWordLike && HAS_LETTER_RE.test(segment.segment)) {
        words.push(segment.segment);
      }
    }
    return words;
  }

  // Fallback: whitespace split
  return text.split(/\s+/).filter((token) => HAS_LETTER_RE.test(token));
}
