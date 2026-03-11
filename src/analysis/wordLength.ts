/**
 * Word length distribution and statistics for linguistic analysis.
 */

/**
 * Count how many words have each length.
 *
 * @param words - Array of word tokens.
 * @returns Map from word length to the number of words with that length.
 */
export function wordLengthDistribution(words: string[]): Map<number, number> {
  const dist = new Map<number, number>();
  for (const word of words) {
    // Use spread to correctly count Unicode characters (not UTF-16 code units).
    const len = [...word].length;
    dist.set(len, (dist.get(len) ?? 0) + 1);
  }
  return dist;
}

/**
 * Compute basic statistics over word lengths.
 *
 * @param words - Array of word tokens.
 * @returns Object with mean, variance, and median of the word lengths.
 *          Returns all zeros for empty input.
 */
export function wordLengthStats(
  words: string[],
): { mean: number; variance: number; median: number } {
  if (words.length === 0) {
    return { mean: 0, variance: 0, median: 0 };
  }

  const lengths = words.map((w) => [...w].length);
  const n = lengths.length;

  // Mean
  let sum = 0;
  for (const l of lengths) {
    sum += l;
  }
  const mean = sum / n;

  // Variance (population variance)
  let sumSqDiff = 0;
  for (const l of lengths) {
    sumSqDiff += (l - mean) ** 2;
  }
  const variance = sumSqDiff / n;

  // Median
  const sorted = [...lengths].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  return { mean, variance, median };
}
