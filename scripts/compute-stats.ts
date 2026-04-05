/**
 * Build-time script: reads every corpus text listed in catalog.json,
 * runs the same analysis pipeline used by the app, and writes the
 * results to src/data/precomputed_stats.json.
 *
 * Usage:  npx tsx scripts/compute-stats.ts
 * Called automatically via the "prebuild" npm script.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve project root
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Import analysis functions (pure TS, no browser APIs)
import { normalizeText } from '../src/analysis/preprocess.js';
import { tokenizeCharacters, tokenizeWords } from '../src/analysis/tokenizer.js';
import { letterFrequencies, wordFrequencies } from '../src/analysis/frequencies.js';
import { shannonEntropy } from '../src/analysis/entropy.js';
import { wordLengthDistribution, wordLengthStats } from '../src/analysis/wordLength.js';

interface CatalogEntry {
  id: string;
  title: string;
  author: string;
  language: string;
  languageCode: string;
  period: string;
  textPath: string;
}

interface StatEntry {
  id: string;
  title: string;
  author: string;
  language: string;
  period: string;
  letterEntropy: number;
  wordEntropy: number;
  meanWordLength: number;
  vocabularyRichness: number;
  totalWords: number;
}

function analyzeText(raw: string, langCode?: string): {
  letterEntropy: number;
  wordEntropy: number;
  meanWordLength: number;
  vocabularyRichness: number;
  totalWords: number;
  wordLengthDist: Map<number, number>;
  letterFreqs: Map<string, number>;
} {
  const normalized = normalizeText(raw);
  const chars = tokenizeCharacters(normalized);
  const words = tokenizeWords(normalized, langCode);

  const letterFreqs = letterFrequencies(chars);
  const wordFreqs = wordFrequencies(words);

  const letterH = shannonEntropy(letterFreqs);
  const wordH = shannonEntropy(wordFreqs);
  const stats = wordLengthStats(words);
  const wlDist = wordLengthDistribution(words);

  const totalWords = words.length;
  const uniqueWords = wordFreqs.size;
  const vocabularyRichness = totalWords > 0 ? uniqueWords / totalWords : 0;

  return {
    letterEntropy: Math.round(letterH * 1000) / 1000,
    wordEntropy: Math.round(wordH * 100) / 100,
    meanWordLength: Math.round(stats.mean * 100) / 100,
    vocabularyRichness: Math.round(vocabularyRichness * 10000) / 10000,
    totalWords,
    wordLengthDist: wlDist,
    letterFreqs,
  };
}

// Load catalog
const catalogPath = resolve(ROOT, 'src/data/catalog.json');
const catalog: CatalogEntry[] = JSON.parse(readFileSync(catalogPath, 'utf-8'));

const results: StatEntry[] = [];
const wordLengthDists = new Map<string, Map<number, number>[]>(); // language -> distributions
const letterFreqDists = new Map<string, Map<string, number>[]>(); // language -> letter freq distributions
let skipped = 0;

for (const entry of catalog) {
  const textFile = resolve(ROOT, 'public', entry.textPath.replace(/^\//, ''));

  if (!existsSync(textFile)) {
    console.warn(`⚠  Skipping ${entry.id}: file not found (${textFile})`);
    skipped++;
    continue;
  }

  const raw = readFileSync(textFile, 'utf-8');

  if (raw.length < 100) {
    console.warn(`⚠  Skipping ${entry.id}: file too small (${raw.length} bytes)`);
    skipped++;
    continue;
  }

  const stats = analyzeText(raw, entry.languageCode);

  // Collect word length distributions per language
  const langDists = wordLengthDists.get(entry.language) ?? [];
  langDists.push(stats.wordLengthDist);
  wordLengthDists.set(entry.language, langDists);

  // Collect letter frequency distributions per language
  const langLetterDists = letterFreqDists.get(entry.language) ?? [];
  langLetterDists.push(stats.letterFreqs);
  letterFreqDists.set(entry.language, langLetterDists);

  results.push({
    id: entry.id,
    title: entry.title,
    author: entry.author,
    language: entry.language,
    period: entry.period,
    letterEntropy: stats.letterEntropy,
    wordEntropy: stats.wordEntropy,
    meanWordLength: stats.meanWordLength,
    vocabularyRichness: stats.vocabularyRichness,
    totalWords: stats.totalWords,
  });

  console.log(
    `✓  ${entry.id.padEnd(35)} letterH=${stats.letterEntropy.toFixed(3)}  ` +
    `wordH=${stats.wordEntropy.toFixed(2)}  meanLen=${stats.meanWordLength.toFixed(2)}  ` +
    `richness=${(stats.vocabularyRichness * 100).toFixed(1)}%`,
  );
}

// Write output
const outPath = resolve(ROOT, 'src/data/precomputed_stats.json');
writeFileSync(outPath, JSON.stringify(results, null, 2) + '\n');

// --- Compute per-language trend lines (linear regression over time) ---

const PERIOD_YEARS: Record<string, number> = {
  '8th century BC': -750,
  '5th century BC': -450,
  '4th century BC': -350,
  '1st century BC': -50,
  '1st century': 50,
  '2nd century': 150,
  '4th century': 350,
  '5th century': 450,
  '6th century': 550,
  '7th century': 650,
  '8th century': 750,
  '9th century': 850,
  '10th century': 950,
  '11th century': 1050,
  '12th century': 1150,
  '13th century': 1250,
  '14th century': 1350,
  '16th century': 1550,
  '17th century': 1650,
  '18th century': 1750,
  '19th century': 1850,
  '20th century': 1950,
};

interface TrendLine {
  language: string;
  type: 'letter' | 'word';
  slope: number;
  intercept: number;
  xMin: number;
  xMax: number;
}

function linearRegression(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n < 2) return null;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumX2 = xs.reduce((a, x) => a + x * x, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

// Group results by language
const byLanguage = new Map<string, StatEntry[]>();
for (const r of results) {
  const arr = byLanguage.get(r.language) ?? [];
  arr.push(r);
  byLanguage.set(r.language, arr);
}

const trends: TrendLine[] = [];
for (const [lang, items] of byLanguage.entries()) {
  const filtered = items.filter((e) => e.period in PERIOD_YEARS);
  if (filtered.length < 2) continue;
  const xs = filtered.map((e) => PERIOD_YEARS[e.period]);

  // Letter entropy trend
  const letterYs = filtered.map((e) => e.letterEntropy);
  const letterReg = linearRegression(xs, letterYs);
  if (letterReg) {
    trends.push({
      language: lang,
      type: 'letter',
      slope: Math.round(letterReg.slope * 1e8) / 1e8,
      intercept: Math.round(letterReg.intercept * 10000) / 10000,
      xMin: Math.min(...xs),
      xMax: Math.max(...xs),
    });
    console.log(
      `📈 ${lang.padEnd(15)} letter trend: slope=${letterReg.slope.toFixed(8)}  intercept=${letterReg.intercept.toFixed(4)}`,
    );
  }

  // Word entropy trend
  const wordYs = filtered.map((e) => e.wordEntropy);
  const wordReg = linearRegression(xs, wordYs);
  if (wordReg) {
    trends.push({
      language: lang,
      type: 'word',
      slope: Math.round(wordReg.slope * 1e8) / 1e8,
      intercept: Math.round(wordReg.intercept * 10000) / 10000,
      xMin: Math.min(...xs),
      xMax: Math.max(...xs),
    });
    console.log(
      `📈 ${lang.padEnd(15)} word trend:   slope=${wordReg.slope.toFixed(8)}  intercept=${wordReg.intercept.toFixed(4)}`,
    );
  }
}

const trendsPath = resolve(ROOT, 'src/data/precomputed_trends.json');
writeFileSync(trendsPath, JSON.stringify(trends, null, 2) + '\n');

// --- Precompute convex hulls per language for bubble chart ---

function convexHull2D(points: [number, number][]): [number, number][] {
  if (points.length < 3) return [...points];
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (const p of sorted.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function padHull2D(hull: [number, number][], padX: number, padY: number): [number, number][] {
  if (hull.length < 2) return hull;
  const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length;
  return hull.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return [x, y] as [number, number];
    return [
      Math.round((x + (dx / dist) * padX) * 10000) / 10000,
      Math.round((y + (dy / dist) * padY) * 10000) / 10000,
    ] as [number, number];
  });
}

interface HullData {
  language: string;
  letterHull: [number, number][];
  wordHull: [number, number][];
}

const hulls: HullData[] = [];
for (const [lang, items] of byLanguage.entries()) {
  if (items.length < 2) continue;
  const letterPts: [number, number][] = items.map((e) => [e.letterEntropy, e.meanWordLength]);
  const wordPts: [number, number][] = items.map((e) => [e.wordEntropy, e.meanWordLength]);
  hulls.push({
    language: lang,
    letterHull: padHull2D(convexHull2D(letterPts), 0.04, 0.15),
    wordHull: padHull2D(convexHull2D(wordPts), 0.15, 0.15),
  });
}

const hullsPath = resolve(ROOT, 'src/data/precomputed_hulls.json');
writeFileSync(hullsPath, JSON.stringify(hulls, null, 2) + '\n');

// --- Compute per-language average word length distributions ---

interface LangWordLengthDist {
  language: string;
  distribution: Record<number, number>; // length -> relative frequency (0-1)
}

const langWordLengths: LangWordLengthDist[] = [];

for (const [lang, dists] of wordLengthDists.entries()) {
  // Average relative frequencies across all texts in this language
  const avgDist = new Map<number, number>();
  for (const dist of dists) {
    const total = Array.from(dist.values()).reduce((s, c) => s + c, 0);
    if (total === 0) continue;
    for (const [len, count] of dist) {
      avgDist.set(len, (avgDist.get(len) ?? 0) + count / total);
    }
  }
  // Divide by number of texts to get average relative frequency
  const n = dists.length;
  const result: Record<number, number> = {};
  for (const [len, sum] of avgDist) {
    result[len] = Math.round((sum / n) * 100000) / 100000;
  }
  langWordLengths.push({ language: lang, distribution: result });
  console.log(`📊 ${lang.padEnd(15)} word-length dist: ${Object.keys(result).length} lengths`);
}

const wlPath = resolve(ROOT, 'src/data/precomputed_wordlengths.json');
writeFileSync(wlPath, JSON.stringify(langWordLengths, null, 2) + '\n');

// --- Compute per-language average letter frequency distributions ---

interface LangLetterFreqDist {
  language: string;
  distribution: Record<string, number>; // letter -> relative frequency (0-1)
}

const langLetterFreqs: LangLetterFreqDist[] = [];

for (const [lang, dists] of letterFreqDists.entries()) {
  const avgDist = new Map<string, number>();
  for (const dist of dists) {
    const total = Array.from(dist.values()).reduce((s, c) => s + c, 0);
    if (total === 0) continue;
    for (const [letter, count] of dist) {
      avgDist.set(letter, (avgDist.get(letter) ?? 0) + count / total);
    }
  }
  const n = dists.length;
  const result: Record<string, number> = {};
  for (const [letter, sum] of avgDist) {
    result[letter] = Math.round((sum / n) * 100000) / 100000;
  }
  langLetterFreqs.push({ language: lang, distribution: result });
  console.log(`🔤 ${lang.padEnd(15)} letter-freq dist: ${Object.keys(result).length} letters`);
}

const lfPath = resolve(ROOT, 'src/data/precomputed_letterfreqs.json');
writeFileSync(lfPath, JSON.stringify(langLetterFreqs, null, 2) + '\n');

console.log(`\nDone: ${results.length} texts analyzed, ${skipped} skipped.`);
console.log(`Output: ${outPath}`);
console.log(`Trends: ${trendsPath} (${trends.length} languages)`);
console.log(`Hulls: ${hullsPath} (${hulls.length} languages)`);
console.log(`Word lengths: ${wlPath} (${langWordLengths.length} languages)`);
console.log(`Letter freqs: ${lfPath} (${langLetterFreqs.length} languages)`);
