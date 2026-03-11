# Shannon Entropy - Linguistic Information Analysis Tool

## Project Description

Client-side web application for analyzing linguistic properties of texts using information theory concepts (entropy, Zipf's law, frequency distributions). Runs entirely in the browser with no backend. Full spec in `docs/specs.md`.

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
  pages/            # Library, Analyze, Compare pages

  analysis/         # Core computation modules
    preprocess.ts   # Text normalization (lowercase, Unicode, punctuation removal)
    tokenizer.ts    # Character-level and word-level tokenization
    frequencies.ts  # Letter and word frequency distributions
    entropy.ts      # Shannon entropy (H = -sum p(x) log2 p(x)))
    zipf.ts         # Zipf's law rank-frequency analysis
    mutualInformation.ts  # Bigram mutual information (advanced/optional)

  charts/           # Plotly chart components
    letterChart.ts
    zipfChart.ts
    wordChart.ts
    lengthChart.ts
    entropyChart.ts

  workers/          # Web Workers for heavy computation
    analysisWorker.ts

  data/
    catalog.json    # Corpus metadata index

public/
  corpora/          # Built-in text files (cleaned, plain text)
    fr/             # French (Voltaire, etc.)
    la/             # Latin (Cicero, etc.)
    grc/            # Ancient Greek (Plato, Homer, etc.)
    nl/             # Dutch (Multatuli, etc.)
    en/             # English (Shakespeare, etc.)
    it/             # Italian (Dante, etc.)
    es/             # Spanish (Cervantes, etc.)
    de/             # German (Goethe, etc.)
```

## Key Architecture Decisions

- **No backend.** All processing happens in-browser. No API calls, no data transmission.
- **Web Workers** for tokenization, frequency, and entropy computation to keep the UI responsive.
- **Lazy loading** of corpus texts — only fetch when selected.
- **Corpus metadata** lives in `src/data/catalog.json`. Each entry has: id, title, author, language, period, source, gutenbergId (optional), textPath.
- **Two token levels:** character-level (letters only) and word-level (whitespace split, punctuation filtered).

## Three Main Sections

1. **Library** — Browse/search/filter built-in corpora, select for analysis.
2. **Analyze** — Run full analysis pipeline on a text: frequencies, entropy, Zipf, word length stats, charts.
3. **Compare** — Side-by-side comparison of two texts with overlay charts.

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

French, Latin, Ancient Greek, Dutch, English, Italian, Spanish, German. Texts are public domain (Project Gutenberg). Each text file is manually cleaned before inclusion (no Gutenberg headers/footers, no editorial artifacts).

## Privacy

- Uploaded user texts are processed locally and never stored or transmitted
- No analytics, no cookies, no external services
