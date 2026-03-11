# Shannon Entropy & the Mathematics of Language

> *"The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point."*
> — Claude Shannon, *A Mathematical Theory of Communication* (1948)

**What if we could measure the information hidden inside language itself?**

In 1948, Claude Shannon invented a formula that changed the world: **entropy**. It measures the unpredictability — the *surprise* — contained in a message. This single idea gave birth to the entire digital age, from the internet to smartphones.

But Shannon's entropy doesn't just apply to machines. It reveals deep structure in **human language** — structure that connects the mathematics of information to the classical texts of Homer, Plato, Cicero, and Virgil.

This project brings that connection to life.

---

## What

An interactive web application that lets you explore the **statistical structure of languages** through the lens of information theory.

Load a text — whether it's Cicero's *Catilinarians* in Latin, Homer's *Iliad* in Ancient Greek, Voltaire's *Candide* in French, or Shakespeare's *Hamlet* in English — and the app instantly reveals:

- **Letter frequency distributions** — Which letters dominate each language? Why does Latin love 'e' and 'i' while Greek favors 'α' and 'ε'?
- **Word frequency & Zipf's law** — A stunning universal pattern: in *every* language, the most common word appears roughly twice as often as the second most common, three times as often as the third, and so on. Always.
- **Shannon entropy** — How many bits of information does each symbol carry? Is Greek more "unpredictable" than Latin? Is poetry more structured than prose?
- **Word length distributions** — German words are famously long. But how does Ancient Greek compare to Dutch? To Spanish?
- **Mutual information** — When you see the word *"chat"* in French, can you predict the next word? This measures how much context matters.

Compare any two texts side by side. Overlay their Zipf curves. Watch how entropy shifts across languages, centuries, and literary styles.

---

## Why

This application was built as a school project for **première secondaire** in the Belgian **humanités gréco-latines** curriculum — a tradition that places classical languages at the heart of education.

The project sits at a crossroads:

- **Classical languages** (Greek and Latin) meet **modern mathematics** (information theory)
- **Literary heritage** meets **computational analysis**
- **Ancient texts** meet **digital tools**

### Why Shannon entropy?

Because it answers a question that feels almost philosophical:

> *How much information is in a letter? In a word? In a language?*

When you compute the entropy of Latin, you discover that its rich inflection system (all those case endings!) creates patterns that make it *more predictable* at the character level than, say, French. That's not just a number — it's an insight into how the language works.

When you plot Zipf's law for Homer's Greek and find the *exact same* curve as Shakespeare's English — separated by 2,500 years and completely unrelated languages — you're seeing something profound about the nature of human communication itself.

### Why these languages?

The corpus reflects the spirit of **humanités gréco-latines**:

| Language | Authors | Why |
|---|---|---|
| **Ancient Greek** | Homer, Plato | The foundation of Western literature and philosophy |
| **Latin** | Cicero | The language of Roman rhetoric and medieval scholarship |
| **French** | Voltaire | The literary tradition closest to home |
| **Dutch** | Multatuli | Representing Belgium's other literary heritage |
| **English** | Shakespeare | The global language, a bridge to the modern world |
| **Italian** | Dante | The first great work in a vernacular European language |
| **Spanish** | Cervantes | The birth of the modern novel |
| **German** | Goethe | A contrasting Germanic linguistic structure |

Together, these texts span **2,700 years** of written human language — and Shannon's mathematics applies equally to all of them.

---

## How

### For users

1. **Library** — Browse the built-in collection of classical and literary texts. Search by language, author, or period.
2. **Analyze** — Select a text and watch the analysis unfold: frequency charts, entropy calculations, Zipf plots, and more.
3. **Compare** — Pick two texts and see their statistical fingerprints side by side. How does Cicero compare to Voltaire? Homer to Shakespeare?

You can also upload your own `.txt` files. All processing happens in your browser — nothing is sent to any server.

### For developers

The application is built with modern web technologies and runs entirely client-side:

```
React + TypeScript     UI framework
Vite                   Build tool
Tailwind CSS           Styling
Plotly.js              Interactive charts
Web Workers            Background computation
```

**No backend. No API. No data collection.** Everything runs in the browser.

#### Project structure

```
src/
  analysis/       Pure computation modules (entropy, Zipf, frequencies, tokenization)
  charts/         Plotly chart components
  components/     Shared UI components
  pages/          Library, Analyze, Compare
  workers/        Web Workers for heavy computation
  data/           Corpus metadata catalog

public/
  corpora/        Cleaned plain-text files organized by language
    grc/          Ancient Greek
    la/           Latin
    fr/           French
    nl/           Dutch
    en/           English
    it/           Italian
    es/           Spanish
    de/           German
```

#### Run locally

```bash
git clone https://github.com/pierre-warnier/shannon-entropy.git
cd shannon-entropy
npm install
npm run dev
```

#### Deploy

The app deploys as a static site to **Cloudflare Pages** — just push to `main`.

---

## The key insight

Every human language, no matter how different it looks on the surface — whether written in Greek letters, Latin script, or Chinese characters — obeys the same deep statistical laws.

Shannon gave us the tools to see this. This app lets you explore it yourself.

---

## License

MIT

---

*A première secondaire project — humanités gréco-latines, Belgium.*
