/**
 * Text normalization utilities for linguistic analysis.
 *
 * Handles Greek, Latin, French, Dutch, English, Italian, Spanish,
 * and German characters via Unicode-aware processing.
 */

/**
 * Pattern matching editorial artifacts:
 * - Square brackets and their contents: [1], [sic], [note]
 * - Curly braces and their contents: {1}, {note}
 * - Angle brackets and their contents: <1>, <note>
 * - Standalone digits (not part of words)
 * - Common reference markers: *, †, ‡, §, ¶
 */
const EDITORIAL_ARTIFACTS = /\[[^\]]*\]|\{[^}]*\}|<[^>]*>|(?<!\p{L})\d+(?!\p{L})|[*†‡§¶]/gu;

/**
 * Pattern matching punctuation and symbols — everything that is not a
 * Unicode letter (\p{L}) or whitespace (\s).
 */
const PUNCTUATION = /[^\p{L}\s]/gu;

/**
 * Collapse runs of whitespace into a single space and trim.
 */
const WHITESPACE_RUNS = /\s+/g;

/**
 * Normalize a raw text for linguistic analysis.
 *
 * Steps applied in order:
 * 1. Convert to lowercase.
 * 2. Unicode-normalize: NFD then NFC (ensures composed forms while
 *    handling any pre-decomposed input consistently).
 * 3. Remove editorial artifacts (bracketed content, standalone numbers,
 *    reference markers).
 * 4. Remove remaining punctuation / symbols.
 * 5. Collapse whitespace and trim.
 */
export function normalizeText(text: string): string {
  let result = text.toLowerCase();

  // Normalize Unicode: NFD (canonical decomposition) then strip
  // ALL combining marks (\p{M}) so that accented/vocalized letters
  // are folded to their base form. This handles:
  // - Latin accents (à→a, é→e, ç→c, ñ→n, ü→u)
  // - Greek breathing/tonos marks
  // - Hebrew nikud/vowel points (בְּ→ב)
  // - Arabic tashkeel/diacritics (بِ→ب)
  // Essential for letter-frequency analysis where accented/vocalized
  // variants should not be counted separately.
  result = result.normalize("NFD");
  result = result.replace(/\p{M}/gu, "");

  // Strip editorial artifacts before punctuation removal so that
  // bracketed content is removed as a unit.
  result = result.replace(EDITORIAL_ARTIFACTS, " ");

  // Remove all remaining punctuation and symbols.
  result = result.replace(PUNCTUATION, " ");

  // Collapse whitespace.
  result = result.replace(WHITESPACE_RUNS, " ").trim();

  return result;
}
