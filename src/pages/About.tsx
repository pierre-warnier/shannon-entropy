import { useI18n } from '../i18n/I18nContext';

const GITHUB_URL = 'https://github.com/pierre-warnier/shannon-entropy';
const SCHOLA_URL = 'https://www.scholanova.be';

export default function About() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-8 text-xl font-bold text-slate-900 sm:mb-10 sm:text-2xl">
        {t('about.title' as any)}
      </h2>

      <div className="space-y-6 sm:space-y-8">
        {/* School project */}
        <Section title={t('about.school.title' as any)}>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('about.school.text' as any)
              .split('{link}')
              .map((part: string, i: number) =>
                i === 0 ? (
                  <span key={i}>{part}</span>
                ) : (
                  <span key={i}>
                    <a
                      href={SCHOLA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                    >
                      {t('about.school.link' as any)}
                    </a>
                    {part}
                  </span>
                ),
              )}
          </p>
        </Section>

        {/* Companion app */}
        <Section title={t('about.companion.title' as any)}>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('about.companion.text' as any)}
          </p>
        </Section>

        {/* Technical */}
        <Section title={t('about.tech.title' as any)}>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('about.tech.text' as any)}
          </p>
          <p className="mt-3 font-mono text-xs text-slate-500 sm:text-sm">
            {t('about.tech.stack' as any)}
          </p>
        </Section>

        {/* Source code */}
        <Section title={t('about.source.title' as any)}>
          <p className="text-sm text-slate-700 sm:text-base">
            {t('about.source.text' as any)}
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            pierre-warnier/shannon-entropy
          </a>
        </Section>

        {/* Credits */}
        <Section title={t('about.credits.title' as any)}>
          <ul className="space-y-1.5 text-sm text-slate-600 sm:text-base">
            <li>{t('about.credits.corpus' as any)}</li>
            <li>{t('about.credits.portraits' as any)}</li>
            <li>{t('about.credits.ai' as any)}</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-3 text-base font-bold text-slate-900 sm:text-lg">{title}</h3>
      {children}
    </section>
  );
}
