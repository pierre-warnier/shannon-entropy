export interface CorpusMetadata {
  id: string;
  title: string;
  author: string;
  language: string;
  languageCode: string;
  period: string;
  source: string;
  gutenbergId?: number;
  textPath: string;
}

export interface AnalysisResult {
  letterFrequencies: Map<string, number>;
  wordFrequencies: Map<string, number>;
  letterEntropy: number;
  wordEntropy: number;
  wordLengthDistribution: Map<number, number>;
  wordLengthStats: { mean: number; variance: number; median: number };
  totalCharacters: number;
  totalWords: number;
  uniqueWords: number;
  topWords: [string, number][];
  topWordsFiltered: [string, number][];
  mutualInformation: { pair: [string, string]; mi: number }[];
  detectedLanguageCode?: string;
}

export interface TextSource {
  metadata: CorpusMetadata | UserTextMetadata;
  text: string;
}

export interface UserTextMetadata {
  id: string;
  title: string;
  author: string;
  language: string;
  languageCode: string;
  period: string;
  source: 'User Upload';
  textPath: '';
}
