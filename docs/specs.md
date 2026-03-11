# Web Application Specification

## Linguistic Information Analysis Tool

---

# 1. Project Overview

## Purpose

The application is a **client-side web tool** that analyzes linguistic properties of texts using concepts from **information theory**.

The goal is to allow users to explore statistical structures of languages and texts through interactive visualizations.

The app supports:

* exploration of built-in literary corpora
* analysis of user-uploaded texts
* comparison between languages and authors
* visualization of statistical language properties

The application runs **entirely in the browser** and requires **no backend**.

Deployment target: **Cloudflare Pages**.

---

# 2. Core Concepts

The application focuses on statistical analysis of texts.

Primary ideas:

* symbol frequency distributions
* word distributions
* entropy
* Zipf's law
* contextual dependence
* comparative linguistics

These ideas illustrate the principle that **language has measurable information structure**.

---

# 3. Functional Specification

## 3.1 Application Sections

The application contains three main sections:

### Library

Browse available texts included in the application.

Features:

* corpus search
* filtering
* metadata display
* corpus selection

---

### Analyze

Perform statistical analysis on a selected text.

Features:

* automatic analysis pipeline
* statistical metrics
* interactive graphs
* export tools

---

### Compare

Compare two texts or corpora.

Features:

* side-by-side metrics
* comparative charts
* distribution comparisons

---

# 4. Supported Data Sources

## 4.1 Built-in Corpus Library

Texts stored locally within the application.

Sources:

* public domain texts
* primarily Project Gutenberg works

Languages targeted:

* French
* Latin
* Ancient Greek
* Dutch
* English
* Italian
* Spanish
* German

Example authors:

* Voltaire
* Cicero
* Plato
* Homer
* Multatuli
* Shakespeare
* Dante
* Cervantes
* Goethe

Each corpus is manually cleaned before inclusion.

---

## 4.2 User Upload

Users may upload their own `.txt` files.

Constraints:

* text format only
* analysis performed locally
* no persistent storage
* data never leaves the browser

Optional metadata input:

* language
* author
* time period

---

# 5. Corpus Metadata

Each corpus is described using a metadata index.

Example structure:

```json
{
  "id": "voltaire_candide",
  "title": "Candide",
  "author": "Voltaire",
  "language": "French",
  "period": "18th century",
  "source": "Project Gutenberg",
  "gutenbergId": 19942,
  "textPath": "/corpora/fr/voltaire_candide.txt"
}
```

Metadata fields:

| Field       | Description          |
| ----------- | -------------------- |
| id          | unique identifier    |
| title       | work title           |
| author      | author name          |
| language    | language             |
| period      | historical period    |
| source      | origin of text       |
| gutenbergId | optional reference   |
| textPath    | path to cleaned text |

---

# 6. Text Processing Pipeline

All processing occurs inside the browser.

Pipeline:

1. Load text
2. Normalize text
3. Tokenize text
4. Compute statistics
5. Generate visualizations

---

# 7. Preprocessing

Steps applied to each text:

### Normalization

* convert to lowercase
* normalize Unicode characters
* remove punctuation
* remove editorial artifacts

### Tokenization

Two token levels:

**Character level**

* letters

**Word level**

* whitespace splitting
* filtering punctuation

Outputs:

* character list
* word list

---

# 8. Statistical Analyses

## 8.1 Letter Frequency Distribution

Compute frequency of each character.

Outputs:

* histogram
* relative frequencies

Purpose:

* illustrate linguistic structure
* compare alphabets across languages

---

## 8.2 Word Frequency Distribution

Compute word counts.

Outputs:

* top words table
* frequency distribution

Purpose:

* observe lexical patterns
* detect stylistic differences

---

## 8.3 Zipf's Law

Compute word rank-frequency distribution.

Plot:

```
rank vs frequency
```

Expected behavior:

```
frequency ~ 1/rank
```

Used to demonstrate universal linguistic patterns.

---

## 8.4 Shannon Entropy

Compute entropy of symbol distribution.

Formula:

```
H = - sum( p(x) * log2(p(x)) )
```

Two measures:

* letter entropy
* word entropy

Output:

* bits per symbol

Interpretation:

* higher entropy -> more unpredictability
* lower entropy -> stronger structure

---

## 8.5 Word Length Distribution

Compute statistics:

* mean word length
* variance
* distribution histogram

Useful for cross-language comparison.

---

## 8.6 Mutual Information (optional advanced feature)

Estimate contextual dependence between consecutive words.

Measures:

```
I(X, Y)
```

Output:

* simple heatmap
* strongest associations

---

# 9. Comparative Analysis

Users may select two texts.

Comparisons include:

* entropy
* word length distribution
* letter frequencies
* Zipf curves

Visual output:

* overlay charts
* side-by-side metrics

---

# 10. Visualizations

Graphs generated using Plotly.

Required charts:

| Chart                      | Purpose                |
| -------------------------- | ---------------------- |
| Letter histogram           | alphabet distribution  |
| Zipf plot                  | word rank distribution |
| Word frequency bar chart   | common words           |
| Word length histogram      | linguistic structure   |
| Entropy comparison         | language comparison    |
| Mutual information heatmap | contextual dependence  |

Features:

* hover tooltips
* zoom
* interactive legend
* export PNG

---

# 11. Export Features

Users may export analysis results.

Formats:

### CSV

Export tables:

* frequency tables
* entropy results
* distribution statistics

### PNG

Export graphs.

---

# 12. User Interface

## Layout

Main structure:

```
Header
Sidebar
Main analysis area
```

Sidebar:

* corpus selection
* filters
* upload

Main area:

* statistics overview
* charts
* analysis panels

---

## UX Principles

Design goals:

* minimal
* responsive
* readable
* educational

Key rules:

* progressive disclosure
* avoid clutter
* highlight key metrics first

---

# 13. Technical Architecture

## Frontend Framework

```
React
TypeScript
Vite
```

Deployment:

```
Cloudflare Pages
```

No backend required.

---

# 14. Libraries

Core libraries:

```
React
TypeScript
Plotly.js
Tailwind CSS
```

Optional utilities:

```
PapaParse (CSV export)
lodash (optional utilities)
```

---

# 15. Project Structure

```
project-root/
  src/
    app/
    components/
    pages/

    analysis/
      preprocess.ts
      tokenizer.ts
      frequencies.ts
      entropy.ts
      zipf.ts
      mutualInformation.ts

    charts/
      letterChart.ts
      zipfChart.ts
      wordChart.ts
      lengthChart.ts
      entropyChart.ts

    workers/
      analysisWorker.ts

    data/
      catalog.json

  public/
    corpora/
      fr/
      la/
      grc/
      nl/
      en/
      it/
      es/
      de/
```

---

# 16. Web Workers

Heavy computations run in background workers.

Purpose:

* avoid UI blocking
* improve responsiveness

Worker tasks:

* tokenization
* frequency calculation
* entropy computation

---

# 17. Data Flow

```
User selects corpus
      |
Text loaded
      |
Preprocessing
      |
Tokenization
      |
Statistical computation
      |
Results returned to UI
      |
Charts rendered
```

---

# 18. Performance Strategy

Key principles:

* lazy load corpora
* compute statistics only when needed
* limit vocabulary size for heavy calculations
* offload processing to Web Workers

Expected corpus size:

```
50k - 300k words
```

Well within browser capabilities.

---

# 19. Security and Privacy

The application does not transmit user data.

Properties:

* fully client-side
* no external API calls
* uploaded files processed locally
* no persistent storage

---

# 20. Deployment

Hosting platform:

```
Cloudflare Pages
```

Characteristics:

* static site hosting
* CDN distribution
* free tier sufficient

Deployment pipeline:

```
GitHub repository -> Cloudflare Pages build -> Static deployment
```

---

# 21. Future Extensions

Possible future improvements:

* additional languages
* richer corpus library
* language detection
* lemmatization
* deeper NLP analysis
* collaborative corpus contributions
* advanced comparison dashboards

---

# 22. Summary

The application demonstrates how **information theory reveals structure in human language**.

Key properties:

* fully client-side architecture
* curated corpus library
* interactive statistical exploration
* strong visual pedagogy

The system provides an intuitive and powerful tool for exploring the mathematics of language.
