import { useState, useCallback, useRef } from 'react';
import { useI18n } from '../i18n/I18nContext';

interface FileUploadProps {
  onTextLoaded: (text: string, filename: string) => void;
  compact?: boolean;
}

export function FileUpload({ onTextLoaded, compact }: FileUploadProps) {
  const { t } = useI18n();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          onTextLoaded(text, file.name);
        }
      };
      reader.readAsText(file);
    },
    [onTextLoaded],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  if (compact) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${
          dragActive
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:bg-slate-50'
        }`}
      >
        <input ref={inputRef} type="file" accept=".txt" onChange={handleInputChange} className="hidden" />
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {fileName ? <span className="max-w-[120px] truncate">{fileName}</span> : <span>{t('upload.browse')}</span>}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 transition-colors sm:p-8 ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        onChange={handleInputChange}
        className="hidden"
      />

      <svg
        className="mb-2 h-8 w-8 text-slate-400 sm:mb-3 sm:h-10 sm:w-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      {fileName ? (
        <div className="text-center">
          <p className="truncate text-sm font-medium text-slate-700">{fileName}</p>
          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            {t('upload.replace')}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            {t('upload.drop').split('{ext}')[0]}
            <span className="text-blue-600">.txt</span>
            {t('upload.drop').split('{ext}')[1]}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{t('upload.browse')}</p>
        </div>
      )}
    </div>
  );
}
