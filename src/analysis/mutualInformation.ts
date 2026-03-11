/**
 * Mutual information computation for bigram analysis.
 *
 * Computes pointwise mutual information (PMI) for adjacent word pairs.
 */

/** Strict Roman numeral pattern (matches I–MMMCMXCIX) */
const ROMAN_RE = /^(?:m{0,3})(?:cm|cd|d?c{0,3})(?:xc|xl|l?x{0,3})(?:ix|iv|v?i{0,3})$/i;

/** Returns true for Arabic digits or Roman numerals (2+ chars to keep "i" etc.) */
function isNumericToken(word: string): boolean {
  if (/\d/.test(word)) return true;
  if (word.length < 2) return false;
  return ROMAN_RE.test(word);
}

/**
 * Compute mutual information for adjacent word pairs and return the
 * top pairs ranked by MI score.
 *
 * PMI(x, y) = log2( P(x, y) / (P(x) * P(y)) )
 *
 * where P(x, y) is the probability of the bigram (x, y) among all
 * bigrams, and P(x) / P(y) are the unigram probabilities.
 *
 * Only bigrams that appear at least `minCount` times are considered,
 * to avoid the well-known PMI bias toward rare events.
 *
 * @param words    - Array of word tokens.
 * @param topK     - Number of top pairs to return (default 20).
 * @param minCount - Minimum bigram count to consider (default 3).
 * @returns Array of { pair, mi } objects sorted by MI descending.
 */
export function mutualInformation(
  words: string[],
  topK: number = 20,
  minCount: number = 3,
): { pair: [string, string]; mi: number }[] {
  if (words.length < 2) {
    return [];
  }

  // Count unigrams
  const unigramCounts = new Map<string, number>();
  for (const word of words) {
    unigramCounts.set(word, (unigramCounts.get(word) ?? 0) + 1);
  }

  // Count bigrams
  const bigramCounts = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const key = `${words[i]}\t${words[i + 1]}`;
    bigramCounts.set(key, (bigramCounts.get(key) ?? 0) + 1);
  }

  const totalUnigrams = words.length;
  const totalBigrams = words.length - 1;

  // Compute PMI for each bigram (skip rare bigrams)
  const results: { pair: [string, string]; mi: number }[] = [];

  for (const [key, count] of bigramCounts) {
    if (count < minCount) continue;

    const [w1, w2] = key.split('\t');

    // Skip pairs containing numbers (Arabic or Roman) — chapter numbers etc.
    if (isNumericToken(w1) || isNumericToken(w2)) continue;
    const pBigram = count / totalBigrams;
    const pW1 = unigramCounts.get(w1)! / totalUnigrams;
    const pW2 = unigramCounts.get(w2)! / totalUnigrams;

    const mi = Math.log2(pBigram / (pW1 * pW2));

    results.push({ pair: [w1, w2], mi });
  }

  // Sort by MI descending, break ties alphabetically
  results.sort((a, b) => {
    const diff = b.mi - a.mi;
    if (diff !== 0) return diff;
    const cmp = a.pair[0].localeCompare(b.pair[0]);
    if (cmp !== 0) return cmp;
    return a.pair[1].localeCompare(b.pair[1]);
  });

  return results.slice(0, topK);
}
