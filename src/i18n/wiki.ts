/**
 * Wikipedia article slugs for each locale.
 * When an article doesn't exist in a given locale, we fall back to English.
 */

import type { Locale } from './I18nContext';

/** Mapping of concept keys to Wikipedia article slugs per locale */
const WIKI_ARTICLES: Record<string, Partial<Record<Locale, string>>> = {
  shannon: {
    fr: 'Claude_Shannon',
    en: 'Claude_Shannon',
    nl: 'Claude_Shannon',
  },
  mathTheory: {
    fr: 'Théorie_mathématique_de_la_communication',
    en: 'A_Mathematical_Theory_of_Communication',
    nl: 'A_Mathematical_Theory_of_Communication',
  },
  entropy: {
    fr: 'Entropie_de_Shannon',
    en: 'Entropy_(information_theory)',
    nl: 'Entropie_(informatietheorie)',
  },
  infoContent: {
    fr: 'Contenu_informationnel',
    en: 'Information_content',
    nl: 'Informatie-inhoud',
  },
  infoTheory: {
    fr: 'Théorie_de_l%27information',
    en: 'Information_theory',
    nl: 'Informatietheorie',
  },
  bit: {
    fr: 'Bit',
    en: 'Bit',
    nl: 'Bit_(eenheid)',
  },
  mutualInfo: {
    fr: 'Information_mutuelle',
    en: 'Mutual_information',
    nl: 'Wederzijdse_informatie',
  },
  inflection: {
    fr: 'Flexion_(linguistique)',
    en: 'Inflection',
    nl: 'Flexie_(taalkunde)',
  },
  morphology: {
    fr: 'Morphologie_(linguistique)',
    en: 'Morphology_(linguistics)',
    nl: 'Morfologie_(taalkunde)',
  },
  nlp: {
    fr: 'Traitement_automatique_des_langues',
    en: 'Natural_language_processing',
    nl: 'Natuurlijke_taalverwerking',
  },
  sentiment: {
    fr: 'Analyse_de_sentiments',
    en: 'Sentiment_analysis',
    nl: 'Sentimentanalyse',
  },
  ner: {
    fr: 'Reconnaissance_d%27entités_nommées',
    en: 'Named-entity_recognition',
    nl: 'Named-entity_recognition',
  },
  pos: {
    fr: 'Étiquetage_morpho-syntaxique',
    en: 'Part-of-speech_tagging',
    nl: 'Part-of-speech_tagging',
  },
  topicModel: {
    fr: 'Modèle_de_thèmes',
    en: 'Topic_model',
    nl: 'Topic_model',
  },
  machineTranslation: {
    fr: 'Traduction_automatique',
    en: 'Machine_translation',
    nl: 'Machinevertaling',
  },
  wordEmbedding: {
    fr: 'Word_embedding',
    en: 'Word_embedding',
    nl: 'Word_embedding',
  },
  letterFrequency: {
    fr: 'Fréquence_d%27apparition_des_lettres',
    en: 'Letter_frequency',
    nl: 'Letterfrequentie',
  },
  comparativeLinguistics: {
    fr: 'Linguistique_comparée',
    en: 'Comparative_linguistics',
    nl: 'Vergelijkende_taalkunde',
  },
  dataCompression: {
    fr: 'Compression_de_données',
    en: 'Data_compression',
    nl: 'Datacompressie',
  },
  collocation: {
    fr: 'Collocation_(linguistique)',
    en: 'Collocation',
    nl: 'Collocatie',
  },
  gutenberg: {
    fr: 'Projet_Gutenberg',
    en: 'Project_Gutenberg',
    nl: 'Project_Gutenberg',
  },
  binarySearch: {
    fr: 'Recherche_dichotomique',
    en: 'Binary_search',
    nl: 'Binair_zoeken',
  },
};

const WIKI_BASES: Record<Locale, string> = {
  fr: 'https://fr.wikipedia.org/wiki/',
  en: 'https://en.wikipedia.org/wiki/',
  nl: 'https://nl.wikipedia.org/wiki/',
};

/**
 * Get a Wikipedia URL for a concept in the current locale.
 * Falls back to English if the concept isn't available in the current locale.
 */
export function wikiUrl(concept: string, locale: Locale): string {
  const articles = WIKI_ARTICLES[concept];
  if (!articles) return `${WIKI_BASES.en}${concept}`;
  const slug = articles[locale] ?? articles.en ?? concept;
  const base = WIKI_BASES[locale];
  return `${base}${slug}`;
}
