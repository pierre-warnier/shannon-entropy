# Shannon Entropy & the Mathematics of Language

> *"The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point."*
> — Claude Shannon, *A Mathematical Theory of Communication* (1948)

**What if we could measure the information hidden inside language itself?**

In 1948, Claude Shannon invented a formula that changed the world: **entropy**. It measures the unpredictability — the *surprise* — contained in a message. This single idea gave birth to the entire digital age, from the internet to smartphones.

But Shannon's entropy doesn't just apply to machines. It reveals deep structure in **human language** — structure that connects the mathematics of information to the classical texts of Homer, Plato, Cicero, and Virgil.

This project brings that connection to life.

## About

This application was built as a companion to a mathematics project in **première secondaire** (first year of secondary school) in the **humanités gréco-latines** program at [Schola Nova](https://www.scholanova.be), a classical education school in Incourt, Walloon Brabant, Belgium.

**This is not the project deliverable.** The school assignment was a written thesis analyzing Shannon entropy applied to ancient and modern languages. This web application was developed alongside it as an interactive tool to explore, visualize, and compare the results — a digital companion to the thesis.

## What it does

An interactive web application that lets you explore the **statistical structure of languages** through the lens of information theory. The corpus spans **108 texts** across **9 languages** and **2,700 years** of written history.

Load a text — whether it's Cicero's *De Officiis* in Latin, Homer's *Iliad* in Ancient Greek, Voltaire's *Candide* in French, or Shakespeare's *Hamlet* in English — and the app instantly reveals:

- **Letter frequency distributions** — Which letters dominate each language? Why does Latin love 'e' and 'i' while Greek favors 'α' and 'ε'?
- **Word frequency & Zipf's law** — A stunning universal pattern: in *every* language, the most common word appears roughly twice as often as the second most common.
- **Shannon entropy** — How many bits of information does each symbol carry? Is Greek more "unpredictable" than Latin? Is poetry more structured than prose?
- **Word length distributions** — German words are famously long. But how does Ancient Greek compare to Dutch? To Spanish?
- **Mutual information** — When you see the word *"senatus"* in Latin, can you predict the next word? This measures how much context matters.

### The three formulas

The app includes an interactive **Formulas** page explaining the three core formulas with collapsible sections, concrete examples, and a notation primer (probability, logarithm, summation, bits) accessible to secondary school students.

| Formula | What it measures | Unit |
|---|---|---|
| `I(x) = −log₂ p(x)` | Surprise of a single event | bits |
| `H = −Σ p(x) log₂ p(x)` | Average surprise (entropy) | bits/symbol |
| `I(X;Y) = Σ p(x,y) log₂ p(x,y)/p(x)p(y)` | Connection between words | bits |

### Visualizations

- **Bubble chart** with convex hull "potatoes" per language group, togglable between group mode (smooth organic hulls) and bubble mode (sized markers)
- **Timeline chart** showing entropy across centuries with per-language trend lines
- **Side-by-side comparison** of any two texts
- **Interactive Zipf plots**, letter frequency charts, word length distributions

## The corpus

108 texts, 12 per language (except Old French), covering classical antiquity through the 20th century:

| Language | Texts | Example authors |
|---|---|---|
| **Ancient Greek** | 12 | Homer, Plato, Sophocles, Euripides, Aristotle, Aeschylus, Aristophanes, Xenophon |
| **Latin** | 12 | Cicero, Virgil, Ovid, Caesar, Seneca, Lucretius, Apuleius, Boethius, Aquinas |
| **French** | 12 | Voltaire, Hugo, Flaubert, Zola, Baudelaire, Racine, Molière, Dumas, Stendhal |
| **English** | 12 | Shakespeare, Austen, Dickens, Brontë, Wilde, Milton, Shelley, Stoker, Melville |
| **German** | 12 | Goethe, Kafka, Nietzsche, Schiller, Grimm, Fontane, Lessing, Heine, Storm |
| **Dutch** | 12 | Multatuli, Couperus, Vondel, Conscience, Van Lennep, Hildebrand, Van Eeden |
| **Italian** | 12 | Dante, Machiavelli, Manzoni, Boccaccio, Leopardi, Pirandello, Collodi, Goldoni |
| **Spanish** | 12 | Cervantes, Lope de Vega, Calderón, Bécquer, Pérez Galdós, Pardo Bazán, Sor Juana |
| **Old French** | 12 | Chanson de Roland, Chrétien de Troyes, Marie de France, Villehardouin, Froissart |

Sources: [Project Gutenberg](https://www.gutenberg.org/), [Perseus Digital Library](http://www.perseus.tufts.edu/), [Wikisource](https://wikisource.org/), [DBNL](https://www.dbnl.org/), [BFM (ENS Lyon)](http://bfm.ens-lyon.fr/)

## Technical stack

The application is **entirely client-side** — no backend, no API, no data collection. Everything runs in your browser.

```
React 19 + TypeScript    UI framework
Vite                     Build tool
Tailwind CSS 4           Styling
Plotly.js                Interactive charts
Web Workers              Background computation (analysis never blocks the UI)
Cloudflare Pages         Hosting (static site)
```

### Architecture

- **Real-time analysis**: texts are analyzed in the browser using a Web Worker — letter/word frequencies, entropy, mutual information, Zipf's law
- **Precomputed statistics**: per-language trends (linear regression), convex hulls, and summary stats are computed at build time via `scripts/compute-stats.ts`
- **Trilingual i18n**: full French, English, and Dutch translations
- **Responsive**: works on mobile, tablet, and desktop

### Project structure

```
src/
  analysis/       Pure computation (entropy, mutual info, tokenization)
  charts/         Plotly chart components (bubble, timeline, Zipf, etc.)
  components/     Shared UI components (SearchableSelect, etc.)
  data/           Catalog, precomputed stats, trends, hulls, author images
  i18n/           Translations (FR/EN/NL) and Wikipedia URL mappings
  pages/          Home, Library, Analyze, Compare, Formulas, About
  workers/        Web Worker for background text analysis

scripts/
  compute-stats.ts   Build-time precomputation of stats, trends & convex hulls

public/
  corpora/           108 cleaned plain-text files organized by language
    grc/             Ancient Greek (Perseus Digital Library TEI → plain text)
    la/              Latin
    fr/              French
    fro/             Old French
    nl/              Dutch
    en/              English
    it/              Italian
    es/              Spanish
    de/              German
```

### Run locally

```bash
git clone https://github.com/pierre-warnier/shannon-entropy.git
cd shannon-entropy
npm install
npm run dev
```

### Precompute statistics

After adding or modifying corpus texts:

```bash
npx tsx scripts/compute-stats.ts
```

This regenerates `precomputed_stats.json`, `precomputed_trends.json`, and `precomputed_hulls.json`.

### Deploy

The app deploys as a static site to **Cloudflare Pages** — just push to `main`.

## The key insight

Every human language, no matter how different it looks on the surface — whether written in Greek letters, Latin script, or Arabic characters — obeys the same deep statistical laws.

Shannon gave us the tools to see this. This app lets you explore it yourself.

## Credits

- **Corpus sources**: Project Gutenberg, Perseus Digital Library, Wikisource, DBNL, BFM (ENS Lyon)
- **Author portraits**: Wikimedia Commons
- **Developed with assistance from** [Claude](https://claude.ai) (Anthropic)

## License

MIT

---

*A première secondaire project — humanités gréco-latines, [Schola Nova](https://www.scholanova.be), Incourt, Belgium.*
