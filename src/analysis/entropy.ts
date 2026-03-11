/**
 * Shannon entropy computation for linguistic analysis.
 */

/**
 * Compute Shannon entropy H from a frequency map of raw counts.
 *
 *   H = -Σ p(x) * log₂(p(x))
 *
 * The convention 0 * log₂(0) = 0 is applied: symbols with zero
 * probability contribute nothing to the sum.
 *
 * @param frequencies - Map from symbol to its absolute count.
 *                      Counts must be non-negative integers.
 * @returns Entropy in bits per symbol. Returns 0 for empty input or
 *          when all probability mass is on a single symbol.
 */
export function shannonEntropy(frequencies: Map<string, number>): number {
  let total = 0;
  for (const count of frequencies.values()) {
    total += count;
  }

  if (total === 0) {
    return 0;
  }

  let entropy = 0;

  for (const count of frequencies.values()) {
    if (count === 0) {
      continue; // 0 * log₂(0) = 0 by convention
    }

    const p = count / total;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}
