/**
 * Frequency distribution utilities for linguistic analysis.
 */

/**
 * Count the occurrences of each character in the input array.
 *
 * @param chars - Array of single-character strings.
 * @returns Map from character to its absolute count.
 */
export function letterFrequencies(chars: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const ch of chars) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  return counts;
}

/**
 * Count the occurrences of each word in the input array.
 *
 * @param words - Array of word tokens.
 * @returns Map from word to its absolute count.
 */
export function wordFrequencies(words: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
}

/**
 * Convert absolute counts to relative frequencies (proportions in 0-1).
 *
 * @param counts - Map from token to absolute count.
 * @returns Map from token to its proportion of the total.
 *          Returns an empty map when the input is empty.
 */
export function relativeFrequencies(
  counts: Map<string, number>,
): Map<string, number> {
  const result = new Map<string, number>();

  let total = 0;
  for (const count of counts.values()) {
    total += count;
  }

  if (total === 0) {
    return result;
  }

  for (const [key, count] of counts) {
    result.set(key, count / total);
  }
  return result;
}

/**
 * Return the top N entries from a frequency map, sorted by count
 * descending. Ties are broken alphabetically (ascending) for
 * deterministic output.
 *
 * @param counts - Map from token to absolute count.
 * @param n      - Number of entries to return.
 * @returns Array of [token, count] pairs, length <= n.
 */
export function topN(
  counts: Map<string, number>,
  n: number,
): [string, number][] {
  return [...counts.entries()]
    .sort((a, b) => {
      const diff = b[1] - a[1];
      if (diff !== 0) return diff;
      return a[0].localeCompare(b[0]);
    })
    .slice(0, n);
}
