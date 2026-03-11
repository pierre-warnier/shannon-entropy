# Shannon Entropy - Linguistic Information Analysis Tool

## Project Description

Client-side web application for analyzing linguistic properties of texts using information theory concepts (entropy, frequency distributions, mutual information). Runs entirely in the browser with no backend. Full spec in `docs/specs.md`.

## Tech Stack

- **Framework:** React + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Plotly.js
- **CSV export:** PapaParse
- **Deployment:** Cloudflare Pages (static site)

## Project Structure

```
src/
  app/              # App shell, routing, layout
  components/       # Shared UI components
  pages/            # Home, Library, Analyze, Compare, Formulas (FAQ), About
  i18n/             # Trilingual translations (FR/EN/NL)

  analysis/         # Core computation modules
    preprocess.ts   # Text normalization (lowercase, Unicode, punctuation removal)
    tokenizer.ts    # Character-level and word-level tokenization
    frequencies.ts  # Letter and word frequency distributions
    entropy.ts      # Shannon entropy (H = -sum p(x) log2 p(x)))
    mutualInformation.ts  # Bigram mutual information
    wordLength.ts   # Word length distribution analysis
    stopwords.ts    # Stopword lists per language

  charts/           # Plotly chart components
    LetterChart.tsx
    WordChart.tsx
    LengthChart.tsx
    EntropyChart.tsx
    MutualInformationChart.tsx
    CorpusBubbleChart.tsx
    TimelineChart.tsx
    CompareLetterChart.tsx
    CompareLengthChart.tsx

  workers/          # Web Workers for heavy computation
    analysisWorker.ts

  data/
    catalog.json    # Corpus metadata index (108 entries)
    authorImages.ts # Author portrait URLs (Wikimedia Commons)
    precomputed_stats.json   # Per-text summary statistics
    precomputed_trends.json  # Per-language linear regression trend lines
    precomputed_hulls.json   # Per-language convex hulls for bubble chart

public/
  corpora/          # Built-in text files (cleaned, plain text)
    grc/            # Ancient Greek (Homer, Plato, etc.)
    la/             # Latin (Cicero, Virgil, etc.)
    fro/            # Old French (Chanson de Roland, Chrétien de Troyes, etc.)
    fr/             # French (Voltaire, Hugo, etc.)
    en/             # English (Shakespeare, Austen, etc.)
    de/             # German (Goethe, Kafka, etc.)
    nl/             # Dutch (Multatuli, Vondel, etc.)
    it/             # Italian (Dante, Machiavelli, etc.)
    es/             # Spanish (Cervantes, Calderón, etc.)
```

## Key Architecture Decisions

- **No backend.** All processing happens in-browser. No API calls, no data transmission.
- **Web Workers** for tokenization, frequency, and entropy computation to keep the UI responsive.
- **Lazy loading** of corpus texts — only fetch when selected.
- **Corpus metadata** lives in `src/data/catalog.json`. Each entry has: id, title, author, language, period, source, gutenbergId (optional), textPath.
- **Two token levels:** character-level (letters only) and word-level (whitespace split, punctuation filtered).

## Pages

1. **Home** — Overview with corpus bubble chart and timeline.
2. **Library** — Browse/search/filter 108 built-in corpora, select for analysis.
3. **Analyze** — Run full analysis pipeline on a text: frequencies, entropy, mutual information, word length stats, charts.
4. **Compare** — Side-by-side comparison of two texts with overlay charts.
5. **Formulas** — Collapsible accordion explaining the three core formulas with notation primer.
6. **About** — Project context (Schola Nova), companion app explanation, credits, GitHub link.

## Coding Conventions

- TypeScript strict mode
- Functional React components with hooks
- Keep analysis modules pure (no React dependencies) so they work in Web Workers
- Charts are thin wrappers around Plotly — data transformation happens in analysis modules
- Use Tailwind utility classes; no custom CSS files unless necessary
- Keep components small and focused; one component per file

## Common Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Lint
npm run typecheck # Type checking
```

## Supported Languages in Corpora

Ancient Greek, Latin, Old French, French, English, German, Dutch, Italian, Spanish. 9 languages × 12 texts = 108 texts total. Sources: Project Gutenberg, Perseus Digital Library, Wikisource, DBNL, BFM (ENS Lyon). Each text file is manually cleaned before inclusion (no headers/footers, no editorial artifacts).

## Privacy

- Uploaded user texts are processed locally and never stored or transmitted
- No analytics, no cookies, no external services
