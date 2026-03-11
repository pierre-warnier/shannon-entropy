# Shannon Entropy & the Mathematics of Language

> *"The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point."*
> — Claude Shannon, *A Mathematical Theory of Communication* (1948)

**What if we could measure the information hidden inside language itself?**

In 1948, Claude Shannon invented a formula that changed the world: **entropy**. It measures the unpredictability — the *surprise* — contained in a message. This single idea gave birth to the entire digital age, from the internet to smartphones.

But Shannon's entropy doesn't just apply to machines. It reveals deep structure in **human language** — structure that connects the mathematics of information to the classical texts of Homer, Plato, Cicero, Virgil, the Torah, and the Quran.

This project brings that connection to life.

**Live at [lang.warnier.net](https://lang.warnier.net)**

## About

This application was built as a companion to a mathematics project in **première secondaire** (first year of secondary school) in the **humanités gréco-latines** program at [Schola Nova](https://www.scholanova.be), a classical education school in Incourt, Walloon Brabant, Belgium.

**This is not the assignment itself.** The school project was a written report analyzing Shannon entropy applied to ancient and modern languages. This web application was developed alongside it as an interactive tool to explore, visualize, and compare the results — a digital companion to the report.

## What it does

An interactive web application that lets you explore the **statistical structure of languages** through the lens of information theory. The corpus spans **134 texts** across **11 languages** and **2,700 years** of written history.

Load a text — whether it's Cicero's *De Officiis* in Latin, Homer's *Iliad* in Ancient Greek, Voltaire's *Candide* in French, the *Quran* in Arabic, or the *Torah* in Hebrew — and the app instantly reveals:

- **Letter frequency distributions** — Which letters dominate each language? Why does Latin love 'e' and 'i' while Greek favors 'α' and 'ε'?
- **Word frequency distributions** — Which words appear most often? Every language has its own signature pattern of function words and content words.
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

- **Bubble chart** with convex hull "potatoes" per language group, togglable between letter entropy and word entropy modes
- **Timeline chart** showing entropy across centuries with per-language trend lines
- **Rankings** page with podium and sortable tables
- **Side-by-side comparison** of any two texts
- **Letter frequency charts**, word frequency charts, word length distributions

## The corpus

134 texts across 11 languages, covering classical antiquity through the 20th century:

| Language | Texts | Authors |
|---|---|---|
| **Ancient Greek** | 12 | Aeschylus, Aristophanes, Aristotle, Euripides, Herodotus, Homer, Plato, Sophocles, Thucydides, Xenophon |
| **Latin** | 12 | Apuleius, Augustinus, Beda Venerabilis, Boethius, Caesar, Cicero, Lucretius, Ovid, Seneca, Thomas Aquinas, Virgil |
| **Hebrew** | 13 | Torah, Tanakh, Judah Halevi, Maimonides, Mendele Mocher Sforim, Sholem Aleichem, H.N. Bialik, S.Y. Agnon |
| **Arabic** | 13 | Quran, Pre-Islamic Poets, Abu Nuwas, Al-Jahiz, Al-Mutanabbi, Ibn Sina, Al-Ghazali, Ibn Khaldun, Ahmad Shawqi, Gibran Khalil Gibran, Taha Hussein |
| **Old French** | 12 | *Chanson de Roland* (anon.), *Roman d'Enéas* (anon.), Chrétien de Troyes, Guillaume de Lorris, Marie de France, Geoffroi de Villehardouin, Jean Froissart |
| **French** | 12 | Baudelaire, Balzac, Dumas, Flaubert, Hugo, Molière, Racine, Rousseau, Stendhal, Voltaire, Zola |
| **English** | 12 | Austen, Brontë, Defoe, Dickens, Melville, Milton, Shakespeare, Shelley, Stoker, Swift, Twain, Wilde |
| **German** | 12 | Brüder Grimm, Fontane, Goethe, Heine, Kafka, Lessing, Nietzsche, Schiller, Storm |
| **Dutch** | 12 | Bosboom-Toussaint, Conscience, Couperus, Hildebrand, Multatuli, Van Eeden, Van Lennep, Van Schendel, Vondel |
| **Italian** | 12 | Aleramo, Boccaccio, Collodi, D'Annunzio, Dante, Deledda, Goldoni, Leopardi, Machiavelli, Manzoni, Pirandello |
| **Spanish** | 12 | Bécquer, Calderón, Cervantes, Clarín, Lope de Vega, Pardo Bazán, Pérez Galdós, Sor Juana, Valera |

Sources: [Project Gutenberg](https://www.gutenberg.org/), [Perseus Digital Library](http://www.perseus.tufts.edu/), [Wikisource](https://wikisource.org/), [DBNL](https://www.dbnl.org/), [BFM (ENS Lyon)](http://bfm.ens-lyon.fr/), [Al-Maktaba al-Shamela](https://shamela.ws/), [Sefaria](https://www.sefaria.org/)

## Technical stack

The application is **entirely client-side** — no backend, no API, no data collection. Everything runs in your browser.

```
React 19 + TypeScript    UI framework
Vite                     Build tool
Tailwind CSS 4           Styling
Plotly.js                Interactive charts
Web Workers              Background computation (analysis never blocks the UI)
GitHub Pages             Hosting (static site)
Cloudflare               CDN & DNS
```

### Architecture

- **Real-time analysis**: texts are analyzed in the browser using a Web Worker — letter/word frequencies, entropy, mutual information
- **Precomputed statistics**: per-language trends (linear regression), convex hulls, and summary stats are computed via `npm run stats`
- **Trilingual i18n**: full French, English, and Dutch translations
- **Responsive**: works on mobile, tablet, and desktop
- **Unicode-aware**: proper handling of Hebrew nikud, Arabic tashkeel, and Greek polytonic diacritics via `\p{M}` combining mark normalization

### Project structure

```
src/
  analysis/       Pure computation (entropy, mutual info, tokenization)
  charts/         Plotly chart components (bubble, timeline, letter freq, etc.)
  components/     Shared UI components (StatsPanel, FileUpload, ExportButton, etc.)
  data/           Catalog, precomputed stats, trends, hulls, author images
  i18n/           Translations (FR/EN/NL) and Wikipedia URL mappings
  pages/          Home, Library, Compare, Rankings, Formulas, About
  workers/        Web Worker for background text analysis

scripts/
  compute-stats.ts   Precomputation of stats, trends & convex hulls

public/
  corpora/           134 cleaned plain-text files organized by language
    grc/             Ancient Greek
    la/              Latin
    he/              Hebrew
    ar/              Arabic
    fro/             Old French
    fr/              French
    en/              English
    de/              German
    nl/              Dutch
    it/              Italian
    es/              Spanish
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
npm run stats
```

This regenerates `precomputed_stats.json`, `precomputed_trends.json`, and `precomputed_hulls.json`.

### Deploy

The app deploys as a static site to **GitHub Pages** via GitHub Actions — just push to `main`. Cloudflare provides CDN and DNS.

## The key insight

Every human language, no matter how different it looks on the surface — whether written in Greek letters, Latin script, Hebrew, or Arabic characters — obeys the same deep statistical laws.

Shannon gave us the tools to see this. This app lets you explore it yourself.

## Credits

- **Corpus sources**: Project Gutenberg, Perseus Digital Library, Wikisource, DBNL, BFM (ENS Lyon), Al-Maktaba al-Shamela, Sefaria
- **Author portraits**: Wikimedia Commons
- **Developed with assistance from** [Claude](https://claude.ai) (Anthropic)

## License

MIT

---

*A première secondaire project — humanités gréco-latines, [Schola Nova](https://www.scholanova.be), Incourt, Belgium.*
