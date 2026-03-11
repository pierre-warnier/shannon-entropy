# Web Application Specification

## Linguistic Information Analysis Tool

---

# 1. Project Overview

## Purpose

The application is a **client-side web tool** that analyzes linguistic properties of texts using concepts from **information theory**.

The goal is to allow users to explore statistical structures of languages and texts through interactive visualizations.

The app supports:

* exploration of a built-in literary corpus (134 texts, 11 languages)
* analysis of user-uploaded texts
* comparison between languages and authors
* visualization of statistical language properties
* rankings and leaderboards across the corpus

The application runs **entirely in the browser** and requires **no backend**.

Deployment: **GitHub Pages** (static hosting) + **Cloudflare** (CDN & DNS).

Live at: **[lang.warnier.net](https://lang.warnier.net)**

---

# 2. Core Concepts

The application focuses on statistical analysis of texts.

Primary ideas:

* symbol frequency distributions
* word distributions
* Shannon entropy (letter-level and word-level)
* word length distributions
* mutual information (contextual dependence between consecutive words)
* comparative linguistics across 11 languages and 2,700 years

These ideas illustrate the principle that **language has measurable information structure**.

---

# 3. Functional Specification

## 3.1 Application Sections

The application contains six sections, accessible via a tab-based navigation bar:

### Home

Landing page with overview, interactive charts, and educational content.

Features:

* Shannon quote and hero section
* Interactive bubble chart (letter entropy vs. word entropy per text, grouped by language)
* Timeline chart (entropy across centuries)
* Explanation of Shannon entropy with formulas
* Focus section: information theory vs. NLP positioning
* Corpus showcase with language cards

---

### Library

Browse and analyze texts from the built-in corpus or upload custom texts.

Features:

* corpus search with reset button
* language filter pills (sorted alphabetically by translated name)
* text cards with author portraits, metadata, and word counts
* inline analysis results (no separate Analyze page)
* file upload for custom `.txt` files
* CSV export of analysis results

---

### Compare

Compare two texts side-by-side.

Features:

* dual text selection (from corpus or upload)
* side-by-side entropy metrics
* comparative letter frequency charts
* comparative word frequency charts
* word length distribution comparison

---

### Rankings

Leaderboard of all corpus texts by entropy metrics.

Features:

* podium display (top 3) with author portraits
* sortable table with all texts
* toggle between letter entropy and word entropy
* language grouping

---

### Formulas

Interactive educational page explaining the three core formulas.

Features:

* collapsible formula sections with examples
* notation primer (probability, logarithm, summation, bits)
* interactive yes/no quiz game
* accessible to secondary school students

---

### About

Project background and credits.

---

# 4. Supported Data Sources

## 4.1 Built-in Corpus Library

134 texts stored locally within the application.

Sources:

* Project Gutenberg
* Perseus Digital Library
* Wikisource
* DBNL (Digitale Bibliotheek voor de Nederlandse Letteren)
* BFM (Base de Français Médiéval, ENS Lyon)
* Al-Maktaba al-Shamela
* Sefaria

Languages:

* Ancient Greek (12 texts)
* Latin (12)
* Hebrew (13)
* Arabic (13)
* Old French (12)
* French (12)
* English (12)
* German (12)
* Dutch (12)
* Italian (12)
* Spanish (12)

Each corpus text is manually cleaned before inclusion.

---

## 4.2 User Upload

Users may upload their own `.txt` files.

Constraints:

* text format only
* analysis performed locally
* no persistent storage
* data never leaves the browser

---

# 5. Corpus Metadata

Each corpus is described using a metadata index (`src/data/catalog.json`).

Example structure:

```json
{
  "id": "voltaire_candide",
  "title": "Candide",
  "author": "Voltaire",
  "language": "French",
  "languageCode": "fr",
  "period": "18th century",
  "source": "Project Gutenberg",
  "gutenbergId": 19942,
  "textPath": "/corpora/fr/voltaire_candide.txt"
}
```

Metadata fields:

| Field        | Description             |
| ------------ | ----------------------- |
| id           | unique identifier       |
| title        | work title              |
| author       | author name             |
| language     | language (display name) |
| languageCode | ISO language code       |
| period       | historical period       |
| source       | origin of text          |
| gutenbergId  | optional reference      |
| textPath     | path to cleaned text    |

---

# 6. Text Processing Pipeline

All processing occurs inside the browser via a Web Worker.

Pipeline:

1. Load text (fetch from `/corpora/` or read uploaded file)
2. Normalize text
3. Tokenize (characters and words)
4. Compute statistics
5. Return results to UI
6. Render charts

---

# 7. Preprocessing

Steps applied to each text:

### Normalization

* convert to lowercase
* normalize Unicode (NFC)
* strip combining marks via `\p{M}` regex (handles Latin diacritics, Greek polytonic accents, Hebrew nikud, Arabic tashkeel)
* remove punctuation and digits

### Tokenization

Two token levels:

**Character level**

* extract alphabetic characters only

**Word level**

* `Intl.Segmenter` for locale-aware word segmentation
* fallback to whitespace splitting when Segmenter unavailable
* filter stopwords (via `stopwords-iso`) for top-words display

Outputs:

* character array
* word array
* filtered word array (without stopwords)

---

# 8. Statistical Analyses

## 8.1 Letter Frequency Distribution

Compute frequency of each character.

Outputs:

* bar chart with frequencies
* relative frequencies (percentages)

Purpose:

* illustrate linguistic structure
* compare alphabets across languages

---

## 8.2 Word Frequency Distribution

Compute word counts (with and without stopwords).

Outputs:

* top words word cloud (d3-cloud)
* frequency values

Purpose:

* observe lexical patterns
* detect stylistic differences

---

## 8.3 Shannon Entropy

Compute entropy of symbol distribution.

Formula:

```
H = −Σ p(x) log₂ p(x)
```

Two measures:

* **letter entropy** (bits per character) — measures alphabet utilization
* **word entropy** (bits per word) — measures vocabulary richness

Output:

* bits per symbol
* comparison badges against language averages (precomputed)

Interpretation:

* higher letter entropy → more uniform alphabet usage
* lower letter entropy → dominant letters, more predictable
* higher word entropy → richer vocabulary, more inflection
* lower word entropy → more repetitive, simpler structure

Short text warning: results flagged when text contains fewer than 10,000 words.

---

## 8.4 Word Length Distribution

Compute statistics:

* mean word length
* distribution histogram

Useful for cross-language comparison.

---

## 8.5 Mutual Information

Estimate contextual dependence between consecutive words.

Formula:

```
I(X;Y) = Σ p(x,y) log₂ [p(x,y) / p(x)p(y)]
```

Output:

* bar chart of top word pairs by MI score

---

# 9. Comparative Analysis

Users may select two texts from the corpus or upload custom texts.

Comparisons include:

* letter entropy and word entropy
* letter frequency distributions
* word frequency distributions
* word length distributions
* mutual information pairs

Visual output:

* side-by-side charts
* side-by-side metric cards

---

# 10. Visualizations

Charts generated using **Plotly.js** and **d3-cloud**.

| Chart                     | Library  | Purpose                                    |
| ------------------------- | -------- | ------------------------------------------ |
| Bubble chart              | Plotly   | Corpus overview (entropy vs. word length)   |
| Timeline chart            | Plotly   | Entropy across centuries with trend lines   |
| Letter frequency bar      | Plotly   | Alphabet distribution per text              |
| Word cloud                | d3-cloud | Top words visualization                     |
| Word length histogram     | Plotly   | Linguistic structure                        |
| Mutual information bar    | Plotly   | Strongest word pair associations            |

Features:

* hover tooltips with rich content (title, author, language, metrics)
* interactive legend (click to isolate, double-click to toggle)
* convex hull "potato" overlays per language group (togglable)
* trend lines per language (togglable)
* didactic axis labels with directional hints
* responsive sizing

---

# 11. Export Features

Users may export analysis results.

### CSV

Export via PapaParse:

* letter frequencies
* word frequencies
* entropy results
* word length distribution
* mutual information pairs

---

# 12. User Interface

## Layout

Main structure:

```
Navigation bar (tabs)
Main content area
```

Navigation tabs:

* Home
* Library
* Compare
* Rankings
* Formulas
* About

No sidebar — the navigation is a horizontal tab bar with a language selector (FR/EN/NL).

Main area:

* statistics overview (StatsPanel)
* charts in grid layout
* responsive cards

---

## UX Principles

Design goals:

* minimal and clean
* responsive (mobile, tablet, desktop)
* readable and educational
* accessible to 11-year-old students

Key rules:

* progressive disclosure
* avoid clutter
* highlight key metrics first
* didactic chart labels (directional hints)
* author portraits on cards for visual engagement

---

# 13. Technical Architecture

## Frontend Framework

```
React 19 + TypeScript
Vite
Tailwind CSS 4
```

Routing:

```
react-router-dom (HashRouter for GitHub Pages compatibility)
```

Deployment:

```
GitHub Pages (via GitHub Actions) + Cloudflare (CDN & DNS)
```

No backend required.

---

# 14. Libraries

Core libraries:

```
React 19
TypeScript
Plotly.js (plotly.js-dist-min + react-plotly.js)
Tailwind CSS 4 (@tailwindcss/vite)
react-router-dom
```

Utilities:

```
PapaParse          CSV export
d3-cloud           Word cloud layout
stopwords-iso      Stopword lists per language
```

---

# 15. Internationalization (i18n)

The application is fully trilingual:

* **French** (default)
* **English**
* **Dutch**

Implementation:

* all UI strings stored in `src/i18n/translations.ts` as typed key-value maps
* `TranslationKey` type ensures compile-time safety
* locale-aware Wikipedia links via `src/i18n/wiki.ts`
* language selector in navigation bar
* locale persisted in `localStorage`
* `Intl.Segmenter` uses locale-appropriate word boundaries

---

# 16. Precomputed Statistics

Build-time script (`scripts/compute-stats.ts`) precomputes:

* **Per-text stats**: letter entropy, word entropy, mean word length, vocabulary richness, total words
* **Per-language trend lines**: linear regression of entropy over historical periods
* **Per-language convex hulls**: 2D hull coordinates for bubble chart overlays

Output files:

* `src/data/precomputed_stats.json`
* `src/data/precomputed_trends.json`
* `src/data/precomputed_hulls.json`

Run via: `npm run stats`

---

# 17. Project Structure

```
src/
  analysis/         Pure computation
    preprocess.ts     Text normalization (Unicode, combining marks)
    tokenizer.ts      Character and word tokenization
    frequencies.ts    Frequency distributions
    entropy.ts        Shannon entropy computation
    mutualInfo.ts     Mutual information computation
    stats.ts          Descriptive statistics (mean, variance)

  charts/           Plotly/d3 chart components
    CorpusBubbleChart.tsx
    TimelineChart.tsx
    LetterChart.tsx
    WordChart.tsx        (d3-cloud word cloud)
    LengthChart.tsx
    MutualInformationChart.tsx

  components/       Shared UI components
    StatsPanel.tsx
    FileUpload.tsx
    ExportButton.tsx
    SearchableSelect.tsx

  data/             Static data
    catalog.json
    precomputed_stats.json
    precomputed_trends.json
    precomputed_hulls.json
    authorImages.ts
    useCorpus.ts

  i18n/             Internationalization
    translations.ts
    I18nContext.tsx
    wiki.ts

  pages/            Route pages
    Home.tsx
    Library.tsx
    Compare.tsx
    Rankings.tsx
    FAQ.tsx           (Formulas page)
    About.tsx

  workers/          Web Worker
    analysisWorker.ts
    useAnalysis.ts

scripts/
  compute-stats.ts    Build-time precomputation

public/
  corpora/            134 cleaned plain-text files
    grc/              Ancient Greek
    la/               Latin
    he/               Hebrew
    ar/               Arabic
    fro/              Old French
    fr/               French
    en/               English
    de/               German
    nl/               Dutch
    it/               Italian
    es/               Spanish
```

---

# 18. Web Workers

Heavy computations run in a background Web Worker.

Purpose:

* avoid UI blocking
* improve responsiveness

Worker tasks:

* text normalization and tokenization
* frequency calculation
* entropy computation
* mutual information computation

Communication via `useAnalysis` hook (message-based).

---

# 19. Data Flow

```
User selects corpus (or uploads file)
      |
Text fetched / read
      |
Sent to Web Worker
      |
Preprocessing & tokenization
      |
Statistical computation
      |
Results returned to UI (via message)
      |
StatsPanel + charts rendered
```

---

# 20. Performance Strategy

Key principles:

* lazy load corpus texts (fetched on demand, not bundled)
* precompute aggregate statistics at build time
* offload all analysis to Web Worker
* limit mutual information to top pairs
* responsive chart sizing (no unnecessary re-renders)

Corpus text sizes:

```
1k – 300k words per text
```

Well within browser capabilities.

---

# 21. Security and Privacy

The application does not transmit user data.

Properties:

* fully client-side
* no external API calls (except loading corpus texts from same origin)
* uploaded files processed locally
* no persistent storage (except locale preference)
* no cookies, no analytics, no tracking

---

# 22. Deployment

Hosting:

```
GitHub Pages (static site via GitHub Actions)
Cloudflare (CDN, DNS, HTTPS)
```

Pipeline:

```
Push to main → GitHub Actions workflow → npm ci → tsc -b → vite build → deploy to Pages
```

Custom domain: `lang.warnier.net` (CNAME → `pierre-warnier.github.io`, Cloudflare proxy)

---

# 23. Summary

The application demonstrates how **information theory reveals structure in human language**.

Key properties:

* fully client-side architecture
* 134-text curated corpus across 11 languages
* interactive statistical exploration
* trilingual interface (FR/EN/NL)
* strong visual pedagogy for secondary school students
* precomputed aggregate statistics with real-time per-text analysis

The system provides an intuitive and powerful tool for exploring the mathematics of language.
