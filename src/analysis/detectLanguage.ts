/**
 * Simple language detection based on character frequency profiles.
 *
 * Compares the letter frequency distribution of the input text against
 * known profiles for each supported language. Uses cosine similarity
 * to find the best match.
 *
 * Returns a languageCode (e.g. 'fr', 'la', 'grc') or undefined if
 * no confident match is found.
 */

import { normalizeText } from './preprocess';
import { tokenizeCharacters } from './tokenizer';
import { letterFrequencies, relativeFrequencies } from './frequencies';

/** Reference character frequency profiles per language (top letters). */
const PROFILES: Record<string, Record<string, number>> = {
  fr: { e: 0.157, s: 0.087, a: 0.082, i: 0.077, t: 0.072, n: 0.071, r: 0.067, u: 0.061, l: 0.058, o: 0.054, d: 0.038, c: 0.033, p: 0.029, m: 0.028 },
  en: { e: 0.127, t: 0.091, a: 0.082, o: 0.075, i: 0.070, n: 0.067, s: 0.063, h: 0.061, r: 0.060, d: 0.043, l: 0.040, c: 0.028, u: 0.028, m: 0.024 },
  de: { e: 0.163, n: 0.098, i: 0.076, r: 0.070, s: 0.068, t: 0.061, a: 0.058, h: 0.047, d: 0.047, u: 0.043, l: 0.035, c: 0.031, g: 0.030, m: 0.025 },
  nl: { e: 0.171, n: 0.099, a: 0.073, t: 0.068, i: 0.063, r: 0.060, o: 0.058, d: 0.055, s: 0.050, l: 0.039, g: 0.034, h: 0.029, v: 0.027, k: 0.025 },
  it: { e: 0.117, a: 0.112, i: 0.103, o: 0.098, n: 0.069, l: 0.065, r: 0.063, t: 0.056, s: 0.050, c: 0.045, d: 0.037, u: 0.033, p: 0.031, m: 0.025 },
  es: { e: 0.131, a: 0.126, o: 0.087, s: 0.078, n: 0.067, r: 0.065, l: 0.059, d: 0.055, i: 0.054, u: 0.046, t: 0.042, c: 0.040, m: 0.027, p: 0.025 },
  la: { i: 0.112, e: 0.105, u: 0.085, a: 0.082, t: 0.072, s: 0.065, n: 0.060, r: 0.057, o: 0.050, m: 0.047, c: 0.040, l: 0.033, p: 0.030, d: 0.028 },
  fro: { e: 0.147, i: 0.083, s: 0.077, a: 0.075, n: 0.068, t: 0.064, r: 0.063, l: 0.057, o: 0.054, u: 0.049, d: 0.034, c: 0.032, m: 0.029, p: 0.025 },
  // Script-based detection (these use non-Latin alphabets)
  grc: { α: 0.110, ο: 0.085, ε: 0.083, ι: 0.082, ν: 0.072, τ: 0.063, σ: 0.055, η: 0.045, ρ: 0.042, π: 0.035 },
  he: { י: 0.120, ו: 0.100, ל: 0.070, ה: 0.068, מ: 0.060, א: 0.058, ב: 0.050, ר: 0.048, ת: 0.045, ש: 0.040 },
  ar: { ا: 0.130, ل: 0.100, ي: 0.065, م: 0.060, و: 0.055, ن: 0.050, ر: 0.045, ب: 0.035, ع: 0.030, ت: 0.028 },
};

/** Detect script family from the first N characters. */
function detectScript(chars: string[]): 'latin' | 'greek' | 'hebrew' | 'arabic' | 'unknown' {
  const sample = chars.slice(0, Math.min(chars.length, 2000));
  let latin = 0, greek = 0, hebrew = 0, arabic = 0;
  for (const c of sample) {
    const cp = c.codePointAt(0)!;
    if (cp >= 0x0041 && cp <= 0x024F) latin++;
    else if (cp >= 0x0370 && cp <= 0x03FF) greek++;
    else if (cp >= 0x0590 && cp <= 0x05FF) hebrew++;
    else if (cp >= 0x0600 && cp <= 0x06FF) arabic++;
  }
  const max = Math.max(latin, greek, hebrew, arabic);
  if (max === 0) return 'unknown';
  if (max === greek) return 'greek';
  if (max === hebrew) return 'hebrew';
  if (max === arabic) return 'arabic';
  return 'latin';
}

function cosineSimilarity(a: Map<string, number>, profile: Record<string, number>): number {
  let dot = 0, magA = 0, magB = 0;
  const allKeys = new Set([...a.keys(), ...Object.keys(profile)]);
  for (const key of allKeys) {
    const va = a.get(key) ?? 0;
    const vb = profile[key] ?? 0;
    dot += va * vb;
    magA += va * va;
    magB += vb * vb;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export interface DetectionResult {
  languageCode: string | undefined;
  confidence: number;
}

/**
 * Detect the language of a text from its character frequency profile.
 * Returns one of the 11 supported language codes, or undefined.
 */
export function detectLanguage(text: string): DetectionResult {
  const normalized = normalizeText(text);
  const chars = tokenizeCharacters(normalized);

  if (chars.length < 50) {
    return { languageCode: undefined, confidence: 0 };
  }

  const script = detectScript(chars);

  // Non-Latin scripts can be matched directly
  if (script === 'greek') return { languageCode: 'grc', confidence: 0.95 };
  if (script === 'hebrew') return { languageCode: 'he', confidence: 0.95 };
  if (script === 'arabic') return { languageCode: 'ar', confidence: 0.95 };

  if (script !== 'latin') {
    return { languageCode: undefined, confidence: 0 };
  }

  // For Latin-script languages, compare frequency profiles
  const freq = relativeFrequencies(letterFrequencies(chars));

  const candidates = ['fr', 'en', 'de', 'nl', 'it', 'es', 'la', 'fro'];
  let bestCode = '';
  let bestScore = 0;

  for (const code of candidates) {
    const score = cosineSimilarity(freq, PROFILES[code]);
    if (score > bestScore) {
      bestScore = score;
      bestCode = code;
    }
  }

  // Require minimum confidence
  if (bestScore < 0.92) {
    return { languageCode: undefined, confidence: bestScore };
  }

  return { languageCode: bestCode, confidence: bestScore };
}
