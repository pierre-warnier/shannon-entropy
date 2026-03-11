import Papa from 'papaparse';
import { useI18n } from '../i18n/I18nContext';
import type { AnalysisResult } from '../types';

interface ExportButtonProps {
  result: AnalysisResult;
  title: string;
}

export function ExportButton({ result, title }: ExportButtonProps) {
  const { t } = useI18n();
  const handleExport = () => {
    // Build letter frequency rows
    const letterRows = Array.from(result.letterFrequencies.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, count]) => ({
        type: 'letter',
        token: letter,
        count,
        relative_frequency:
          result.totalCharacters > 0
            ? (count / result.totalCharacters).toFixed(6)
            : '0',
      }));

    // Build word frequency rows
    const wordRows = Array.from(result.wordFrequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => ({
        type: 'word',
        token: word,
        count,
        relative_frequency:
          result.totalWords > 0
            ? (count / result.totalWords).toFixed(6)
            : '0',
      }));

    const allRows = [...letterRows, ...wordRows];
    const csv = Papa.unparse(allRows);

    // Trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeTitle}_frequencies.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {t('export.csv')}
    </button>
  );
}
